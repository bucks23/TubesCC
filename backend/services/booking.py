from flask import Blueprint, request, jsonify
from .conn import get_db_connection
from datetime import datetime
import psycopg2

booking_bp = Blueprint('booking', __name__)

def validate_date(date_string):
    """Validate and parse date string"""
    try:
        return datetime.strptime(date_string, '%Y-%m-%d').date()
    except ValueError:
        return None

@booking_bp.route('/', methods=['POST'])
def create_booking():
    conn = None
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Validate required fields
        required_fields = ['user_id', 'room_id', 'checkin_date', 'checkout_date']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"{field} is required"}), 400
        
        # Validate and parse dates
        checkin_date = validate_date(data['checkin_date'])
        checkout_date = validate_date(data['checkout_date'])
        
        if not checkin_date or not checkout_date:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        
        # Validate date logic
        if checkin_date >= checkout_date:
            return jsonify({"error": "Check-out date must be after check-in date"}), 400
        
        user_id = int(data['user_id'])
        room_id = int(data['room_id'])
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check if room exists and get price
        cur.execute("SELECT price, status FROM rooms WHERE id = %s;", (room_id,))
        room_data = cur.fetchone()
        
        if not room_data:
            return jsonify({"error": "Room not found"}), 404
            
        room_price, room_status = room_data
        
        if room_status != 'Available':
            return jsonify({"error": "Room is not available"}), 400
        
        # Calculate total price
        days = (checkout_date - checkin_date).days
        total_price = days * room_price
        
        # Create booking
        cur.execute(
            "INSERT INTO bookings (user_id, room_id, checkin_date, checkout_date, total_price) "
            "VALUES (%s, %s, %s, %s, %s) RETURNING id;", 
            (user_id, room_id, checkin_date, checkout_date, total_price)
        )
        new_id = cur.fetchone()[0]
        
        # Update room status to booked
        cur.execute("UPDATE rooms SET status = 'Booked' WHERE id = %s;", (room_id,))
        
        conn.commit()
        
        return jsonify({
            "id": new_id, 
            "user_id": user_id, 
            "room_id": room_id, 
            "checkin_date": checkin_date.isoformat(), 
            "checkout_date": checkout_date.isoformat(), 
            "total_price": float(total_price)
        }), 201
        
    except ValueError as e:
        if conn:
            conn.rollback()
        return jsonify({"error": "Invalid input data"}), 400
    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        if conn:
            conn.close()

@booking_bp.route('/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Get room_id before deletion to update room status
        cur.execute("SELECT room_id FROM bookings WHERE id = %s;", (booking_id,))
        result = cur.fetchone()
        
        if not result:
            return jsonify({"error": "Booking not found"}), 404
            
        room_id = result[0]
        
        # Delete booking
        cur.execute("DELETE FROM bookings WHERE id = %s;", (booking_id,))
        
        # Update room status back to available
        cur.execute("UPDATE rooms SET status = 'Available' WHERE id = %s;", (room_id,))
        
        conn.commit()
        
        return jsonify({"message": "Booking deleted successfully", "id": booking_id}), 200
        
    except psycopg2.Error as e:
        if conn:
            conn.rollback()
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        if conn:
            conn.close()

@booking_bp.route('/', methods=['GET'])
def get_bookings():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, user_id, room_id, checkin_date, checkout_date, total_price "
            "FROM bookings ORDER BY checkin_date;"
        )
        rows = cur.fetchall()
        
        bookings = [{
            "id": row[0], 
            "user_id": row[1], 
            "room_id": row[2], 
            "checkin_date": row[3].isoformat() if row[3] else None, 
            "checkout_date": row[4].isoformat() if row[4] else None,
            "total_price": float(row[5]) if row[5] else 0
        } for row in rows]
        
        return jsonify(bookings), 200
        
    except psycopg2.Error as e:
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        if conn:
            conn.close()