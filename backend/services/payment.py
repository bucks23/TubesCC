from flask import Blueprint, request, jsonify
from .conn import get_db_connection

payment_bp = Blueprint('payment', __name__)

# Endpoint to create a new payment
@payment_bp.route('/', methods=['POST'])
def create_payment():
    try:
        data = request.json
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO payments (booking_id, payment_method, amount) VALUES (%s, %s, %s) RETURNING id;", 
                   (data['booking_id'], data['payment_method'], data['amount']))
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({"id": new_id, "booking_id": data['booking_id'], "payment_method": data['payment_method'], "amount": data['amount']}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
