from flask import Flask, jsonify, Response
from services.users import user_bp
from services.rooms import room_bp
from services.conn import get_db_connection
from flask_cors import CORS
import os
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST, Counter

app = Flask(__name__)
CORS(app)

# Register blueprint routes
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(room_bp, url_prefix='/api/rooms')

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
