import psycopg2
import os
from flask import Blueprint, request, jsonify
from .conn import get_db_connection

room_bp = Blueprint('rooms', __name__)

# Endpoint untuk mengambil semua data kamar
@room_bp.route('/', methods=['GET'])
def get_rooms():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, room_number, room_type, price, status, description FROM rooms;")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    rooms = [
        {
            "id": row[0],
            "room_number": row[1],
            "room_type": row[2],
            "price": row[3],
            "status": row[4],
            "description": row[5]
        }
        for row in rows
    ]
    return jsonify(rooms)

@room_bp.route('/<int:room_id>', methods=['GET'])
def get_room_by_id(room_id):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, room_number, room_type, price, status, description FROM rooms WHERE id = %s;", (room_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if row is None:
        return jsonify({"error": "Room not found"}), 404

    room = {
        "id": row[0],
        "room_number": row[1],
        "room_type": row[2],
        "price": row[3],
        "status": row[4],
        "description": row[5]
    }
    return jsonify(room)


# Endpoint untuk menambahkan kamar baru
@room_bp.route('/', methods=['POST'])
def create_room():
    data = request.json
    room_number = data['room_number']
    room_type = data['room_type']
    price = data['price']
    status = data.get('status', 'Available')  # default status
    description = data.get('description', '')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO rooms (room_number, room_type, price, status, description) "
        "VALUES (%s, %s, %s, %s, %s) RETURNING id;",
        (room_number, room_type, price, status, description)
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "id": new_id,
        "room_number": room_number,
        "room_type": room_type,
        "price": price,
        "status": status,
        "description": description
    }), 201

# Endpoint untuk mengubah status kamar
@room_bp.route('/<int:room_id>', methods=['PUT'])
def update_room_status(room_id):
    data = request.json
    status = data['status']

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE rooms SET status = %s WHERE id = %s RETURNING id;", (status, room_id))
    updated_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"msg": "Room status updated", "id": updated_id}), 200
