from flask import Flask, jsonify
from services.users import user_bp
from services.rooms import room_bp
from services.conn import get_db_connection
import os

app = Flask(__name__)

# Register blueprint routes
app.register_blueprint(user_bp, url_prefix='/api/users')
app.register_blueprint(room_bp, url_prefix='/api/rooms')

# Root endpoint
@app.route('/')
def home():
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
        return jsonify({'status': 'healthy'}), 200
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

# Jalankan aplikasi
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)