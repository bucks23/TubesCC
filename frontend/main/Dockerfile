# Base image Node.js versi 20 Alpine
FROM node:20 AS builder

WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies termasuk devDependencies
RUN npm install --force

# Install prom-client secara terpisah jika belum ada dalam package.json
RUN npm install prom-client

# Copy seluruh source code
COPY . .

# Build untuk production menggunakan Vite
RUN NODE_ENV=production npm run build

# Gunakan Nginx untuk serve static file
FROM nginx:stable-alpine

# Salin hasil build dari tahap sebelumnya ke Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 untuk akses HTTP
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
