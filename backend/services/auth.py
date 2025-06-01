from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import psycopg2
import psycopg2.extras
from contextlib import contextmanager
import os
from dotenv import load_dotenv
from .conn import get_db_connection  # Pastikan kamu punya modul conn.py yang berisi fungsi ini

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
        cur.execute("CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)")
        
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
            cur = conn.cursor()
            # Check if username exists for other users
            cur.execute("""
                SELECT id FROM users WHERE username = %s AND id != %s
            """, (username, current_user_id))
            if cur.fetchone():
                return jsonify({'error': 'Username already taken'}), 400
            
            # Update username
            cur.execute("""
                UPDATE users SET username = %s WHERE id = %s
            """, (username, current_user_id))
            conn.commit()
        
        return jsonify({'message': 'Username updated successfully'}), 200
    
    except psycopg2.Error as e:
        print(f"Database error in update_profile: {e}")
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Unexpected error in update_profile: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input fields
        required_fields = ['old_password', 'new_password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        if len(data['new_password']) < 6:
            return jsonify({'error': 'New password must be at least 6 characters long'}), 400
        
        # Get user including password hash
        user = get_user_with_password(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Verify old password
        if not verify_password(user['password'], data['old_password']):
            return jsonify({'error': 'Old password is incorrect'}), 401
        
        # Hash new password and update
        new_password_hash = generate_password_hash(data['new_password'])
        
        with get_db_cursor() as conn:
            cur = conn.cursor()
            cur.execute("""
                UPDATE users SET password = %s WHERE id = %s
            """, (new_password_hash, current_user_id))
            conn.commit()
        
        return jsonify({'message': 'Password updated successfully'}), 200
        
    except psycopg2.Error as e:
        print(f"Database error in change_password: {e}")
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Unexpected error in change_password: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@auth_bp.route('/change-role', methods=['POST'])
@jwt_required()
def change_role():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['target_user_id', 'new_role']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        target_user_id = data['target_user_id']
        new_role = data['new_role']
        
        # Check role validity
        if not validate_role(new_role):
            return jsonify({'error': 'Invalid role'}), 400
        
        # Only admin can change roles
        current_user = get_user_by_id(current_user_id)
        if not current_user or current_user['role'] != 'admin':
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Prevent admin from downgrading their own role
        if target_user_id == current_user_id:
            return jsonify({'error': 'Admin cannot change own role'}), 403
        
        # Check target user exists
        target_user = get_user_by_id(target_user_id)
        if not target_user:
            return jsonify({'error': 'Target user not found'}), 404
        
        # Update role
        with get_db_cursor() as conn:
            cur = conn.cursor()
            cur.execute("""
                UPDATE users SET role = %s WHERE id = %s
            """, (new_role, target_user_id))
            conn.commit()
        
        return jsonify({'message': 'Role updated successfully'}), 200
    
    except psycopg2.Error as e:
        print(f"Database error in change_role: {e}")
        return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        print(f"Unexpected error in change_role: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500
