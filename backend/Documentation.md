# 🏨 Hotel Reservation API Documentation

API ini menyediakan endpoint untuk manajemen pengguna (**Users**) dan kamar hotel (**Rooms**) dalam sistem reservasi. Semua response bertipe `application/json`.

---

## 🔐 User API

### ➕ Create User

**Endpoint:** `POST /users/`  
**Deskripsi:** Membuat pengguna baru.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe"
}
```

**Status Code:** `201 Created`

**Error:**
- `400 Bad Request` – Jika username atau password tidak diisi
- `500 Internal Server Error` – Jika terjadi kesalahan server

---

### 📋 Get All Users

**Endpoint:** `GET /users/`  
**Deskripsi:** Mengambil seluruh data pengguna (tanpa password).

**Response:**
```json
[
  {
    "id": 1,
    "username": "john_doe"
  },
  {
    "id": 2,
    "username": "jane_smith"
  }
]
```

**Status Code:** `200 OK`

**Error:**
- `500 Internal Server Error` – Jika terjadi kesalahan saat mengambil data

---

## 🛏️ Room API

### ➕ Create Room

**Endpoint:** `POST /rooms/`  
**Deskripsi:** Menambahkan data kamar baru.

**Request Body:**
```json
{
  "room_number": "101",
  "room_type": "Deluxe",
  "price": 500000,
  "status": "Available",
  "description": "Spacious room with sea view"
}
```

**Response:**
```json
{
  "id": 1,
  "room_number": "101",
  "room_type": "Deluxe",
  "price": 500000,
  "status": "Available",
  "description": "Spacious room with sea view"
}
```

**Status Code:** `201 Created`

**Error:**
- `500 Internal Server Error` – Jika terjadi kesalahan saat menyimpan data

---

### 📋 Get All Rooms

**Endpoint:** `GET /rooms/`  
**Deskripsi:** Mengambil seluruh data kamar hotel.

**Response:**
```json
[
  {
    "id": 1,
    "room_number": "101",
    "room_type": "Deluxe",
    "price": 500000,
    "status": "Available",
    "description": "Spacious room with sea view"
  }
]
```

**Status Code:** `200 OK`

**Error:**
- `500 Internal Server Error` – Jika gagal mengambil data dari database

---

### 🔁 Update Room Status

**Endpoint:** `PUT /rooms/<room_id>`  
**Deskripsi:** Mengubah status kamar berdasarkan ID.

**Request Body:**
```json
{
  "status": "Booked"
}
```

**Response:**
```json
{
  "msg": "Room status updated",
  "id": 1
}
```

**Status Code:** `200 OK`

**Error:**
- `500 Internal Server Error` – Jika gagal memperbarui status

---

## 📌 Catatan

- Pastikan server PostgreSQL aktif dan tabel `users` serta `rooms` sudah dibuat.
- Password disimpan secara **hashed** menggunakan `werkzeug.security`.
- Semua request harus memiliki header:  
  `Content-Type: application/json`
