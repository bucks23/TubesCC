from flask import Flask, jsonify, Response
from flask_jwt_extended import JWTManager
from services.auth import auth_bp
from services.rooms import room_bp
from services.booking import booking_bp
from services.payment import payment_bp
from services.conn import get_db_connection
from datetime import timedelta
from flask_cors import CORS
import os
from dotenv import load_dotenv  # Add this import
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST, Counter

# Load environment variables BEFORE creating the app
load_dotenv()

app = Flask(__name__)

# Configuration - Updated to use environment variables properly
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'fallback-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600)))

# Debug: Print the JWT secret key to verify it's loaded correctly
print(f"DEBUG: JWT_SECRET_KEY loaded: {app.config['JWT_SECRET_KEY'][:10]}...")

# Initialize extensions
jwt = JWTManager(app)
CORS(app, origins=os.getenv('CORS_ORIGINS', 'https://remarkable-amazement-production.up.railway.app').split(','))

# Register blueprint routes
app.register_blueprint(room_bp, url_prefix='/api/rooms')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(booking_bp, url_prefix='/api/booking')
app.register_blueprint(payment_bp, url_prefix='/api/payment')

# Enhanced JWT Error handlers with better debugging
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({
        'error': 'Token has expired',
        'error_type': 'token_expired',
        'message': 'Please login again to get a new token'
    }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({
        'error': 'Invalid token',
        'error_type': 'token_invalid',
        'message': 'The provided token is malformed or invalid'
    }), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({
        'error': 'Authorization token is required',
        'error_type': 'token_missing',
        'message': 'Include Authorization header with Bearer token'
    }), 401

# Prometheus metrics counter
REQUEST_COUNT = Counter('request_count', 'Total HTTP Requests')

# Root endpoint
@app.route('/')
def home():
    REQUEST_COUNT.inc()
    return {"message": "Hello from Flask!", "jwt_secret_loaded": bool(os.getenv('JWT_SECRET_KEY'))}

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT 1')
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        REQUEST_COUNT.inc()
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'jwt_secret_configured': bool(os.getenv('JWT_SECRET_KEY'))
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy', 
            'error': str(e),
            'jwt_secret_configured': bool(os.getenv('JWT_SECRET_KEY'))
        }), 500

# Debug endpoint to check environment variables
@app.route('/debug/config')
def debug_config():
    return jsonify({
        'jwt_secret_key_set': bool(os.getenv('JWT_SECRET_KEY')),
        'jwt_secret_key_length': len(os.getenv('JWT_SECRET_KEY', '')),
        'jwt_token_expires': os.getenv('JWT_ACCESS_TOKEN_EXPIRES'),
        'database_url_set': bool(os.getenv('DATABASE_URL')),
        'flask_env': os.getenv('FLASK_ENV'),
        'cors_origins': os.getenv('CORS_ORIGINS')
    })

# Prometheus metrics endpoint
@app.route('/metrics')
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)

@app.route('/debug/routes')
def list_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            'endpoint': rule.endpoint,
            'methods': list(rule.methods),
            'rule': rule.rule
        })
    return jsonify(routes)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)