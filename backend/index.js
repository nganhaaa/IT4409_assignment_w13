import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import studentRoutes from './routes/studentRoutes.js';

const app = express();
const SERVER_PORT = 5000;
const DB_CONNECTION_STRING = 'mongodb://localhost:27017/student_db';

// Cấu hình CORS để cho phép frontend truy cập
app.use(cors());

// Middleware để parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware - Ghi log mỗi request
app.use((request, response, next) => {
  const currentTime = new Date().toLocaleString('vi-VN');
  console.log(`[${currentTime}] ${request.method} -> ${request.url}`);
  next();
});

// Kết nối MongoDB
const initializeDatabaseConnection = async () => {
  try {
    await mongoose.connect(DB_CONNECTION_STRING);
    console.log('✓ Database connected successfully');
    console.log(`✓ Database name: ${mongoose.connection.db.databaseName}`);
  } catch (err) {
    console.error('✗ Database connection failed:', err.message);
    process.exit(1);
  }
};

// Lắng nghe sự kiện database
mongoose.connection.on('disconnected', () => {
  console.warn('⚠ Database disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✓ Database reconnected');
});

// Root endpoint
app.get('/', (request, response) => {
  response.json({ 
    message: 'Student Management System API',
    version: '1.0',
    status: 'running'
  });
});

// Student routes
app.use('/api/students', studentRoutes);

// 404 handler
app.use((request, response) => {
  response.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: request.originalUrl
  });
});

// Error handler
app.use((error, request, response, next) => {
  console.error('Server Error:', error);
  response.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  });
});

// Khởi động server
const startApplication = async () => {
  await initializeDatabaseConnection();
  
  app.listen(SERVER_PORT, () => {
    console.log('==========================================');
    console.log(`✓ Server running on port ${SERVER_PORT}`);
    console.log(`✓ API: http://localhost:${SERVER_PORT}/api/students`);
    console.log('==========================================');
  });
};

startApplication();
