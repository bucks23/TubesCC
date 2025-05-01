import psycopg2
import os
import time

def get_db_connection():
    conn = None
    max_retries = 5  # Try 5 times maximum
    retries = 0
    
    while conn is None and retries < max_retries:
        try:
            conn = psycopg2.connect(
                host=os.environ.get("DB_HOST", "localhost"),
                database=os.environ.get("DB_NAME", "hotel_cc"),
                user=os.environ.get("DB_USER", "hotel_cc"),
                password=os.environ.get("DB_PASSWORD", "password")
            )
        except psycopg2.OperationalError as e:
            retries += 1
            if retries >= max_retries:
                raise  # Re-raise exception after max retries
            print(f"Database connection failed ({retries}/{max_retries}), retrying in 5 seconds...")
            time.sleep(5) 
    return conn