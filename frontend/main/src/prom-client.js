const express = require('express');
const client = require('prom-client');
const app = express();

// Membuat registry dan metrik
const register = new client.Registry();
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durasi permintaan HTTP dalam detik',
  labelNames: ['method', 'route', 'code'],
});
register.registerMetric(httpRequestDurationMicroseconds);

// Endpoint untuk metrik
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Menjalankan server
app.listen(3000, () => {
  console.log('Server berjalan di port 3000');
});
