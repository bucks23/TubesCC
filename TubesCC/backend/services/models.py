from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# User: bisa jadi pelanggan atau admin
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

# Model Kamar Hotel
class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_number = db.Column(db.String(10), unique=True, nullable=False)
    room_type = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='Available')  # Available, Booked, Maintenance, etc.
    description = db.Column(db.Text)


