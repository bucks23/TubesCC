# Base image Node.js versi 16 Alpine
FROM node:20 AS builder

# Set build arguments (opsional, bisa diubah saat build)
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies berdasarkan NODE_ENV
RUN npm install --force

# Copy seluruh source code
COPY . .

# Build untuk production menggunakan Vite
RUN npm run build

# Gunakan Nginx untuk serve static file
FROM nginx:stable-alpine

# Salin hasil build dari tahap sebelumnya ke Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 untuk akses HTTP
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
