{
  "version": 2,
  "builds": [
    {
      "src": "app.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/users/(.*)",
      "dest": "users.py"
    },
    {
      "src": "/api/rooms/(.*)",
      "dest": "rooms.py"
    },
    {
      "src": "/health",
      "dest": "app.py"
    },
    {
      "src": "/(.*)",
      "dest": "app.py"
    }
  ],
  "env": {
    "DB_HOST": "db",
    "DB_NAME": "hotel_cc",
    "DB_USER": "hotel_cc",
    "DB_PASSWORD": "password"
  }
}
