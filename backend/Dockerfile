# backend/Dockerfile

FROM python:3.10-slim

# Membuat direktori kerja di dalam container
WORKDIR /app

# Copy file requirements_prom.txt ke dalam container
COPY requirements_prom.txt requirements.txt

# Install package yang dibutuhkan dengan pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy semua file di direktori saat ini ke dalam container
COPY . .

# Membuka port 5000 untuk akses dari luar
EXPOSE 5000
# Menjalankan aplikasi dengan perintah python app.py
CMD ["python", "-m", "services.app"]

