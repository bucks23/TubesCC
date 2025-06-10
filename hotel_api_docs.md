# Dokumentasi API Hotel Management System

## Daftar Isi
- [Informasi Umum](#informasi-umum)
- [Autentikasi](#autentikasi)
- [Endpoint Auth](#endpoint-auth)
- [Endpoint Rooms](#endpoint-rooms)
- [Endpoint Bookings](#endpoint-bookings)
- [Endpoint Payments](#endpoint-payments)
- [Endpoint Utilitas](#endpoint-utilitas)
- [Error Codes](#error-codes)

## Informasi Umum

**Base URL:** `http://localhost:5000`

**Format Response:** JSON

**Authentication:** JWT Token (Bearer)

## Autentikasi

API ini menggunakan JWT (JSON Web Token) untuk autentikasi. Setelah login berhasil, Anda akan menerima access token yang harus disertakan dalam header untuk endpoint yang dilindungi.

```
Authorization: Bearer <your_jwt_token>
```

## Endpoint Auth

### 1. Register User Baru

**POST** `/api/auth/register`

Mendaftarkan user baru ke dalam sistem.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123",
  "role": "guest"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "role": "guest",
    "created_at": "2025-01-01T10:00:00"
  }
}
```

**Validasi:**
- Username minimal 3 karakter, hanya boleh huruf, angka, underscore, dan hyphen
- Password minimal 6 karakter
- Role yang valid: `guest`, `user`, `admin`, `moderator`

### 2. Login

**POST** `/api/auth/login`

Login untuk mendapatkan access token.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "role": "guest",
    "created_at": "2025-01-01T10:00:00"
  }
}
```

### 3. Get Profile

**GET** `/api/auth/profile`

🔒 **Memerlukan Autentikasi**

Mengambil informasi profil user yang sedang login.

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "role": "guest",
    "created_at": "2025-01-01T10:00:00"
  }
}
```

### 4. Update Profile

**PUT** `/api/auth/profile`

🔒 **Memerlukan Autentikasi**

Memperbarui username user.

**Request Body:**
```json
{
  "username": "newusername"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "username": "newusername",
    "role": "guest",
    "created_at": "2025-01-01T10:00:00"
  }
}
```



**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

### 5. Ganti Role User (Admin Only)

**PUT** `/api/auth/change-role`

🔒 **Memerlukan Autentikasi Admin**

Mengubah role user lain (hanya admin yang bisa).

**Request Body:**
```json
{
  "user_id": 2,
  "new_role": "moderator"
}
```

**Response (200):**
```json
{
  "message": "User role updated successfully",
  "user": {
    "id": 2,
    "username": "otheruser",
    "role": "moderator",
    "created_at": "2025-01-01T11:00:00"
  }
}
```

### 6. Get All Users (Admin Only)

**GET** `/api/auth/admin/users`

🔒 **Memerlukan Autentikasi Admin**

Mengambil daftar semua user.

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "role": "admin",
      "created_at": "2025-01-01T09:00:00"
    },
    {
      "id": 2,
      "username": "user1",
      "role": "guest",
      "created_at": "2025-01-01T10:00:00"
    }
  ]
}
```


## Endpoint Rooms

### 1. Get All Rooms

**GET** `/api/rooms/`

Mengambil daftar semua kamar.

**Response (200):**
```json
[
  {
    "id": 1,
    "room_number": "101",
    "room_type": "Single",
    "price": 500000,
    "status": "Available",
    "description": "Kamar single dengan AC dan TV"
  },
  {
    "id": 2,
    "room_number": "102",
    "room_type": "Double",
    "price": 750000,
    "status": "Booked",
    "description": "Kamar double dengan balkon"
  }
]
```

### 2. Create New Room

**POST** `/api/rooms/`

Menambahkan kamar baru.

**Request Body:**
```json
{
  "room_number": "103",
  "room_type": "Suite",
  "price": 1500000,
  "status": "Available",
  "description": "Suite mewah dengan jacuzzi"
}
```

**Response (201):**
```json
{
  "id": 3,
  "room_number": "103",
  "room_type": "Suite",
  "price": 1500000,
  "status": "Available",
  "description": "Suite mewah dengan jacuzzi"
}
```

### 3. Update Room Status

**PUT** `/api/rooms/{room_id}`

Mengubah status kamar.

**Request Body:**
```json
{
  "status": "Maintenance"
}
```

**Response (200):**
```json
{
  "msg": "Room status updated",
  "id": 1
}
```

**Status yang valid:**
- `Available` - Tersedia
- `Booked` - Dipesan
- `Maintenance` - Sedang maintenance
- `Out of Order` - Rusak

## Endpoint Bookings

### 1. Create Booking

**POST** `/api/booking/`

Membuat booking baru.

**Request Body:**
```json
{
  "user_id": 1,
  "room_id": 1,
  "checkin_date": "2025-02-01",
  "checkout_date": "2025-02-05"
}
```

**Response (201):**
```json
{
  "id": 1,
  "user_id": 1,
  "room_id": 1,
  "checkin_date": "2025-02-01",
  "checkout_date": "2025-02-05",
  "total_price": 2000000.0
}
```

**Validasi:**
- Format tanggal: `YYYY-MM-DD`
- Tanggal checkout harus setelah checkin
- Kamar harus tersedia (status `Available`)
- Total harga dihitung otomatis berdasarkan jumlah hari × harga kamar

### 2. Get All Bookings

**GET** `/api/booking/`

Mengambil daftar semua booking.

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "room_id": 1,
    "checkin_date": "2025-02-01",
    "checkout_date": "2025-02-05",
    "total_price": 2000000.0
  }
]
```

### 3. Delete Booking

**DELETE** `/api/booking/{booking_id}`

Menghapus booking dan mengubah status kamar kembali ke `Available`.

**Response (200):**
```json
{
  "message": "Booking deleted successfully",
  "id": 1
}
```

## Endpoint Payments

### 1. Create Payment

**POST** `/api/payment/`

Membuat pembayaran untuk booking.

**Request Body:**
```json
{
  "booking_id": 1,
  "payment_method": "Credit Card",
  "amount": 2000000
}
```

**Response (201):**
```json
{
  "id": 1,
  "booking_id": 1,
  "payment_method": "Credit Card",
  "amount": 2000000
}
```

## Endpoint Utilitas

### 1. Health Check

**GET** `/health`

Mengecek status kesehatan API dan database.

**Response (200):**
```json
{
  "status": "healthy"
}
```

### 2. Home

**GET** `/`

Endpoint root.

**Response (200):**
```json
{
  "message": "Hello from Flask!"
}
```

### 3. Debug Routes

**GET** `/debug/routes`

Menampilkan daftar semua endpoint yang tersedia.

**Response (200):**
```json
[
  {
    "endpoint": "home",
    "methods": ["GET"],
    "rule": "/"
  },
  {
    "endpoint": "auth.login",
    "methods": ["POST"],
    "rule": "/api/auth/login"
  }
]
```

### 4. Metrics (Prometheus)

**GET** `/metrics`

Endpoint untuk monitoring Prometheus.

## Error Codes

### HTTP Status Codes

| Code | Deskripsi |
|------|-----------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Input tidak valid |
| 401 | Unauthorized - Token tidak valid atau expired |
| 403 | Forbidden - Tidak memiliki permission |
| 404 | Not Found - Resource tidak ditemukan |
| 500 | Internal Server Error - Error server |

### JWT Error Messages

| Error | Deskripsi |
|-------|-----------|
| `Token has expired` | Token JWT sudah expired |
| `Invalid token` | Token JWT tidak valid |
| `Authorization token is required` | Header Authorization tidak ada |

### Common Error Response Format

```json
{
  "error": "Error message description"
}
```

### Validation Errors

```json
{
  "error": "Username is required"
}
```

### Database Errors

```json
{
  "error": "Database error occurred",
  "details": "Detailed error message"
}
```

## Role Permissions

| Role | Permissions |
|------|-------------|
| `guest` | Basic access, can view own profile |
| `user` | Standard user permissions |
| `moderator` | Can view user statistics |
| `admin` | Full access, can manage users and roles |

## Contoh Penggunaan

### 1. Register dan Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123", "role": "guest"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

### 2. Menggunakan JWT Token
```bash
# Get profile dengan token
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

### 3. Booking Flow
```bash
# 1. Lihat kamar tersedia
curl -X GET http://localhost:5000/api/rooms/

# 2. Buat booking
curl -X POST http://localhost:5000/api/booking/ \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "room_id": 1, "checkin_date": "2025-02-01", "checkout_date": "2025-02-05"}'

# 3. Buat pembayaran
curl -X POST http://localhost:5000/api/payment/ \
  -H "Content-Type: application/json" \
  -d '{"booking_id": 1, "payment_method": "Credit Card", "amount": 2000000}'
```