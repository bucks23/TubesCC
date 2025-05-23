from flask import Flask, jsonify, Response
#from services.users import user_bp
from flask_jwt_extended import JWTManager
from services.auth import auth_bp
from services.rooms import room_bp
from services.conn import get_db_connection
from datetime import timedelta
from flask_cors import CORS
import os
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST, Counter

app = Flask(__name__)

# Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialize extensions
jwt = JWTManager(app)
CORS(app)

# Register blueprint routes
# app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(room_bp, url_prefix='/api/rooms')
app.register_blueprint(auth_bp, url_prefix='/api/auth')

# JWT Error handlers
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({'error': 'Token has expired'}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({'error': 'Invalid token'}), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({'error': 'Authorization token is required'}), 401

# Prometheus metrics counter example
REQUEST_COUNT = Counter('request_count', 'Total HTTP Requests')

# Root endpoint
@app.route('/')
def home():
    REQUEST_COUNT.inc()
    return {"message": "Hello from Flask!"}

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
        return jsonify({'status': 'healthy'}), 200
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

# Prometheus metrics endpoint
@app.route('/metrics')
def metrics():
    return Response(generate_latest(), mimetype=CONTENT_TYPE_LATEST)

# Jalankan aplikasi
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
