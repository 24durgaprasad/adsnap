// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const geminiRoutes = require('./routes/response');

const app = express();
const port = 5000;

app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true
}));
app.use(express.json());

// Add this line to serve files from the 'public' folder
app.use(express.static('public'));

// Add specific video serving with proper headers
app.use('/videos', express.static('public/videos', {
  setHeaders: (res, path) => {
    res.set({
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache'
    });
  }
}));

app.use('/api', geminiRoutes);

app.listen(port, () => {
  console.log(`✅ Server running. Videos will be available at http://localhost:${port}/videos/`);
});