# Dockerfile untuk Prometheus menggunakan official image

FROM prom/prometheus:latest

# Menyalin file konfigurasi prometheus.yml ke dalam container
COPY prometheus.yml /etc/prometheus/prometheus.yml

# Mengekspos port default Prometheus
EXPOSE 9090

# Perintah default sudah diatur di base image untuk menjalankan Prometheus dengan konfigurasi ini
