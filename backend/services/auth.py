from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import psycopg2
import psycopg2.extras
from contextlib import contextmanager
import os
from dotenv import load_dotenv
from .conn import get_db_connection

# Load environment variables
load_dotenv()

# Create Blueprint
auth_bp = Blueprint('auth', __name__)

# Database connection manager using your existing conn.py
@contextmanager
def get_db_cursor():
    conn = None
    try:
        conn = get_db_connection()
        yield conn
    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        raise e
    finally:
        if conn:
            conn.close()

# Database functions
def init_db():
    """Initialize database tables"""
    with get_db_cursor() as conn:
        cur = conn.cursor()
        
        # Create users table without email
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'guest',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create indexes for faster lookups
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)
        """)
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)
        """)
        
        conn.commit()
        print("Database initialized successfully")

def create_user(username, password, role='guest'):
    """Create a new user"""
    password_hash = generate_password_hash(password)
    
    with get_db_cursor() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        try:
            cur.execute("""
                INSERT INTO users (username, password, role)
                VALUES (%s, %s, %s)
                RETURNING id, username, role, created_at
            """, (username, password_hash, role))
            
            user = dict(cur.fetchone())
            conn.commit()
            return user
            
        except psycopg2.IntegrityError as e:
            conn.rollback()
            if 'username' in str(e):
                return {'error': 'Username already exists'}
            return {'error': 'User already exists'}

def get_user_by_username(username):
    """Get user by username"""
    with get_db_cursor() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        cur.execute("""
            SELECT id, username, password, role, created_at
            FROM users WHERE username = %s
        """, (username,))
        
        user = cur.fetchone()
        return dict(user) if user else None

def get_user_by_id(user_id):
    """Get user by ID"""
    with get_db_cursor() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        cur.execute("""
            SELECT id, username, role, created_at
            FROM users WHERE id = %s
        """, (user_id,))
        
        user = cur.fetchone()
        return dict(user) if user else None

def get_user_with_password(user_id):
    """Get user with password hash for password change operations"""
    with get_db_cursor() as conn:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        cur.execute("""
            SELECT id, username, password, role, created_at
            FROM users WHERE id = %s
        """, (user_id,))
        
        user = cur.fetchone()
        return dict(user) if user else None

def verify_password(stored_hash, password):
    """Verify password against hash"""
    return check_password_hash(stored_hash, password)

# Helper functions
def format_user_response(user):
    """Format user data for API response"""
    if 'password' in user:
        del user['password']
    
    if 'created_at' in user and user['created_at']:
        user['created_at'] = user['created_at'].isoformat()
    
    return user

def validate_username(username):
    """Username validation"""
    return len(username) >= 3 and username.replace('_', '').replace('-', '').isalnum()

def validate_role(role):
    """Role validation"""
    valid_roles = ['guest', 'user', 'admin', 'moderator']
    return role in valid_roles

# Routes
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['username', 'password']
        for field in required_fields:
            if field not in data or not data[field] or not data[field].strip():
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate username
        if not validate_username(data['username']):
            return jsonify({'error': 'Username must be at least 3 characters long and contain only letters, numbers, underscores, and hyphens'}), 400
        
        # Validate password length
        if len(data['password']) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        # Validate role if provided
        role = data.get('role', 'guest')
        if not validate_role(role):
            return jsonify({'error': 'Invalid role. Must be one of: guest, user, admin, moderator'}), 400
        
        # Create new user
        result = create_user(
            username=data['username'].strip().lower(),
            password=data['password'],
            role=role
        )
        
        if 'error' in result:
            return jsonify({'error': result['error']}), 400
        
        # Create access token
        access_token = create_access_token(identity=result['id'])
        
        return jsonify({
            'message': 'User created successfully',
            'access_token': access_token,
            'user': format_user_response(result)
        }), 201
        
    except psycopg2.Error as e:
        error_message = str(e)
        print(f"Database error in register: {error_message}")
        return jsonify({'error': 'Database error occurred', 'details': error_message}), 500
    except Exception as e:
        print(f"Unexpected error in register: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400
        
        username = data['username'].strip().lower()
        
        # Get user by username
        user = get_user_by_username(username)
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        if not verify_password(user['password'], data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=user['id'])
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': format_user_response(user)
        }), 200
        
    except psycopg2.Error as e:
        print(f"Database error in login: {e}")
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Unexpected error in login: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = get_user_by_id(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': format_user_response(user)}), 200
        
    except psycopg2.Error as e:
        print(f"Database error in get_profile: {e}")
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Unexpected error in get_profile: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input - only username can be updated
        if 'username' not in data or not data['username'] or not data['username'].strip():
            return jsonify({'error': 'Username is required'}), 400
        
        username = data['username'].strip().lower()
        
        if not validate_username(username):
            return jsonify({'error': 'Username must be at least 3 characters long and contain only letters, numbers, underscores, and hyphens'}), 400
        
        with get_db_cursor() as conn:
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            
            try:
                cur.execute("""
                    UPDATE users 
                    SET username = %s
                    WHERE id = %s
                    RETURNING id, username, role, created_at
                """, (username, current_user_id))
                
                user = cur.fetchone()
                conn.commit()
                
                if not user:
                    return jsonify({'error': 'User not found'}), 404
                
                return jsonify({
                    'message': 'Profile updated successfully',
                    'user': format_user_response(dict(user))
                }), 200
                
            except psycopg2.IntegrityError:
                conn.rollback()
                return jsonify({'error': 'Username already exists'}), 400
        
    except psycopg2.Error as e:
        print(f"Database error in update_profile: {e}")
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Unexpected error in update_profile: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        if len(data['new_password']) < 6:
            return jsonify({'error': 'New password must be at least 6 characters long'}), 400
        
        # Get current user with password hash
        user = get_user_with_password(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Verify current password
        if not verify_password(user['password'], data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Update password
        new_password_hash = generate_password_hash(data['new_password'])
        
        with get_db_cursor() as conn:
            cur = conn.cursor()
            
            cur.execute("""
                UPDATE users 
                SET password = %s
                WHERE id = %s
            """, (new_password_hash, current_user_id))
            
            conn.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except psycopg2.Error as e:
        print(f"Database error in change_password: {e}")
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Unexpected error in change_password: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@auth_bp.route('/change-role', methods=['PUT'])
@jwt_required()
def change_role():
    """Change user role - only admins can change roles"""
    try:
        current_user_id = get_jwt_identity()
        current_user = get_user_by_id(current_user_id)
        
        # Check if current user is admin
        if not current_user or current_user['role'] != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        data = request.get_json()
        
        if not data or not data.get('user_id') or not data.get('new_role'):
            return jsonify({'error': 'User ID and new role are required'}), 400
        
        if not validate_role(data['new_role']):
            return jsonify({'error': 'Invalid role. Must be one of: guest, user, admin, moderator'}), 400
        
        with get_db_cursor() as conn:
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            
            cur.execute("""
                UPDATE users 
                SET role = %s
                WHERE id = %s
                RETURNING id, username, role, created_at
            """, (data['new_role'], data['user_id']))
            
            user = cur.fetchone()
            conn.commit()
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            return jsonify({
                'message': 'User role updated successfully',
                'user': format_user_response(dict(user))
            }), 200
        
    except psycopg2.Error as e:
        print(f"Database error in change_role: {e}")
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Unexpected error in change_role: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@auth_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    try:
        current_user_id = get_jwt_identity()
        user = get_user_by_id(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'message': f'Hello {user["username"]}! This is a protected route.',
            'user_id': current_user_id,
            'role': user['role'],
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except psycopg2.Error as e:
        print(f"Database error in protected: {e}")
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Unexpected error in protected: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@auth_bp.route('/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    """Get all users - admin only"""
    try:
        current_user_id = get_jwt_identity()
        current_user = get_user_by_id(current_user_id)
        
        # Check if current user is admin
        if not current_user or current_user['role'] != 'admin':
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        with get_db_cursor() as conn:
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            
            cur.execute("""
                SELECT id, username, role, created_at
                FROM users
                ORDER BY created_at DESC
            """)
            
            users = [format_user_response(dict(user)) for user in cur.fetchall()]
            
            return jsonify({'users': users}), 200
        
    except psycopg2.Error as e:
        print(f"Database error in get_all_users: {e}")
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Unexpected error in get_all_users: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@auth_bp.route('/users/stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    """Get user statistics"""
    try:
        current_user_id = get_jwt_identity()
        current_user = get_user_by_id(current_user_id)
        
        # Check if current user is admin or moderator
        if not current_user or current_user['role'] not in ['admin', 'moderator']:
            return jsonify({'error': 'Insufficient permissions'}), 403
        
        with get_db_cursor() as conn:
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            
            cur.execute("""
                SELECT 
                    COUNT(*) as total_users,
                    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as users_last_30_days,
                    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as users_last_7_days,
                    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
                    COUNT(CASE WHEN role = 'moderator' THEN 1 END) as moderator_count,
                    COUNT(CASE WHEN role = 'user' THEN 1 END) as user_count,
                    COUNT(CASE WHEN role = 'guest' THEN 1 END) as guest_count
                FROM users
            """)
            
            stats = dict(cur.fetchone())
            
            return jsonify({'stats': stats}), 200
            
    except psycopg2.Error as e:
        print(f"Database error in get_user_stats: {e}")
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Unexpected error in get_user_stats: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500