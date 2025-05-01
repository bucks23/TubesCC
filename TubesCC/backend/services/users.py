import psycopg2
import os
from flask import Blueprint, request, jsonify
from .conn import get_db_connection
from werkzeug.security import generate_password_hash

user_bp = Blueprint('users', __name__)  # Fixed the __name__ syntax

# Endpoint to create a new user
@user_bp.route('/', methods=['POST'])
def create_user():
    try:
        data = request.json
        if not data or 'username' not in data or 'password' not in data:
            return jsonify({"error": "Username and password are required"}), 400
            
        username = data['username']
        password = generate_password_hash(data['password'])  # Hash the password for security
        
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO users (username, password) VALUES (%s, %s) RETURNING id;", 
                   (username, password))
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({"id": new_id, "username": username}), 201  # Don't return password in response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to get all users
@user_bp.route('/', methods=['GET'])
def get_users():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, username FROM users;")  # Don't return password in response
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        users = [
            {"id": row[0], "username": row[1]} for row in rows
        ]
        return jsonify(users)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
