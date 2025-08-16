// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Add error handling for route loading
let geminiRoutes;
try {
  geminiRoutes = require('./routes/response');
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 5001;

// Add global error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:8081', 'http://127.0.0.1:8081', 'http://localhost:5173', 'http://127.0.0.1:5173'],
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

app.get("/",(req,res)=>{
  res.send("Welcome to backend adsnap");
})

// Add error handling for server startup
const server = app.listen(port, () => {
  console.log(`✅ Server running. Videos will be available at http://localhost:${port}/videos/`);
}).on('error', (err) => {
  console.error('❌ Server startup error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use. Please close other applications using this port.`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});