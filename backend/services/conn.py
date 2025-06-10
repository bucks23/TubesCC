# import psycopg2
# import os
# import time

# def get_db_connection():
#     conn = None
#     max_retries = 5
#     retries = 0
    
#     # Deteksi environment dari variabel lingkungan
#     env = os.environ.get("APP_ENV", "local")
    
#     if env == "production" or os.environ.get("DATABASE_URL"):
#         # Gunakan konfigurasi Railway jika dalam production atau ada DATABASE_URL
#         connection_params = {
#             "host": os.environ.get("DB_HOST", "trolley.proxy.rlwy.net"),
#             "port": os.environ.get("DB_PORT", "17483"),
#             "database": os.environ.get("DB_NAME", "railway"),
#             "user": os.environ.get("DB_USER", "postgres"),
#             "password": os.environ.get("DB_PASSWORD", "GfLTktYYyjOMNicZoRXtbKddJwgoPYGM")
#         }
#         print("Menggunakan koneksi Railway")
#     else:
#         # Gunakan konfigurasi localhost
#         connection_params = {
#             "host": os.environ.get("LOCAL_DB_HOST", "localhost"),
#             "port": os.environ.get("LOCAL_DB_PORT", "5432"),
#             "database": os.environ.get("LOCAL_DB_NAME", "hotel_cc"),
#             "user": os.environ.get("LOCAL_DB_USER", "hotel_cc"),
#             "password": os.environ.get("LOCAL_DB_PASSWORD", "password")
#         }
#         print("Menggunakan koneksi localhost")
    
#     while conn is None and retries < max_retries:
#         try:
#             conn = psycopg2.connect(**connection_params)
#             print("Koneksi ke database berhasil!")
#         except psycopg2.OperationalError as e:
#             retries += 1
#             if retries >= max_retries:
#                 print(f"Gagal terhubung ke database setelah {max_retries} percobaan: {str(e)}")
#                 raise
#             print(f"Koneksi database gagal ({retries}/{max_retries}), mencoba lagi dalam 5 detik...")
#             time.sleep(5) 
#     return conn

import psycopg2
import os
import time

def get_db_connection():
    conn = None
    max_retries = 5  # Try 5 times maximum
    retries = 0
    
    while conn is None and retries < max_retries:
        try:
            # Method 1: Using parameters (RECOMMENDED)
            conn = psycopg2.connect(
                host=os.environ.get("DB_HOST", "turntable.proxy.rlwy.net"),
                port=os.environ.get("DB_PORT", "52503"),
                database=os.environ.get("DB_NAME", "railway"),
                user=os.environ.get("DB_USER", "postgres"),
                password=os.environ.get("DB_PASSWORD", "jUzVOeOdaPbAICxOozhAfCcsGIxCGobL"),
                sslmode='require'  # Required for Railway
            )
            print("✅ Connected to database successfully!")
            
        except psycopg2.OperationalError as e:
            retries += 1
            print(f"❌ Database connection failed ({retries}/{max_retries})")
            print(f"Error: {e}")
            
            if retries >= max_retries:
                print("🚨 Maximum retries reached. Check your database configuration.")
                raise  # Re-raise exception after max retries
                
            print(f"⏳ Retrying in 5 seconds...")
            time.sleep(5) 
            
    return conn

    