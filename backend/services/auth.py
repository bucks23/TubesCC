# auth.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import psycopg2
import psycopg2.extras
from contextlib import contextmanager
import os
from dotenv import load_dotenv
from .conn import get_db_connection  
import jwt as pyjwt
import time

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

# Debug Routes
@auth_bp.route('/debug/check-request', methods=['POST', 'OPTIONS'])
def debug_check_request():
    """Debug endpoint to check incoming request"""
    try:
        return jsonify({
            'method': request.method,
            'headers': dict(request.headers),
            'json_data': request.get_json(),
            'content_type': request.content_type,
            'origin': request.headers.get('Origin'),
            'user_agent': request.headers.get('User-Agent'),
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/debug/test-db', methods=['GET'])
def debug_test_db():
    """Test database connection and check users table"""
    try:
        with get_db_cursor() as conn:
            cur = conn.cursor()
            
            # Test basic connection
            cur.execute('SELECT 1')
            connection_test = cur.fetchone()
            
            # Check if users table exists
            cur.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'users'
                );
            """)
            table_exists = cur.fetchone()[0]
            
            # Count users
            user_count = 0
            if table_exists:
                cur.execute('SELECT COUNT(*) FROM users')
                user_count = cur.fetchone()[0]
            
            return jsonify({
                'database_connected': bool(connection_test),
                'users_table_exists': table_exists,
                'user_count': user_count,
                'timestamp': datetime.now().isoformat()
            }), 200
            
    except Exception as e:
        return jsonify({
            'error': str(e),
            'database_connected': False
        }), 500

# Main Routes
@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        print(f"Register request received: {request.method}")
        print(f"Headers: {dict(request.headers)}")
        
        data = request.get_json()
        print(f"Request data: {data}")
        
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
        access_token = create_access_token(identity=str(result['id']))
        
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
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        print(f"Login request received: {request.method}")
        print(f"Headers: {dict(request.headers)}")
        
        data = request.get_json()
        print(f"Login data: {data}")
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username and password are required'}), 400
        
        username = data['username'].strip().lower()
        
        # Get user by username
        user = get_user_by_username(username)
        print(f"User found: {bool(user)}")
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        password_valid = verify_password(user['password'], data['password'])
        print(f"Password valid: {password_valid}")
        
        if not password_valid:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user['id']))
        print(f"Token created for user ID: {user['id']}")
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': format_user_response(user)
        }), 200
        
    except psycopg2.Error as e:
        print(f"Database error in login: {e}")
        return jsonify({'error': 'Database error occurred', 'details': str(e)}), 500
    except Exception as e:
        print(f"Unexpected error in login: {e}")
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
        user = get_user_by_id(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': format_user_response(user)}), 200
        
    except Exception as e:
        print(f"Unexpected error in get_profile: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

# Initialize database when module is imported
try:
    init_db()
except Exception as e:
    print(f"Warning: Could not initialize database: {e}")