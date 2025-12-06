// ==================== BACKEND SERVER - MAIN FILE ====================
// File chính khởi tạo Express server và kết nối MongoDB
// Xử lý các routes, middleware và error handling

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import studentRoutes from './routes/studentRoutes.js';

// ==================== CẤU HÌNH SERVER ====================
const app = express();
const SERVER_PORT = 5000;                                    // Port chạy server
const DB_CONNECTION_STRING = 'mongodb://localhost:27017/student_db'; // Địa chỉ MongoDB

// ==================== MIDDLEWARE CONFIGURATION ====================

// MIDDLEWARE 1: Cấu hình CORS
// Cho phép frontend (http://localhost:3000) truy cập API
app.use(cors());

// MIDDLEWARE 2: Parse JSON request body
// Chuyển đổi dữ liệu JSON từ client thành object JavaScript
app.use(express.json());

// MIDDLEWARE 3: Parse URL-encoded data
// Xử lý dữ liệu từ form HTML
app.use(express.urlencoded({ extended: true }));

// MIDDLEWARE 4: Logger - Ghi log mỗi request
// Hiển thị thời gian, phương thức HTTP và URL của mỗi request
app.use((request, response, next) => {
  const currentTime = new Date().toLocaleString('vi-VN');
  console.log(`[${currentTime}] ${request.method} -> ${request.url}`);
  next(); // Chuyển sang middleware tiếp theo
});

// ==================== DATABASE CONNECTION ====================

// HÀM: Khởi tạo kết nối MongoDB
const initializeDatabaseConnection = async () => {
  try {
    // Kết nối đến MongoDB
    await mongoose.connect(DB_CONNECTION_STRING);
    console.log('✓ Database connected successfully');
    console.log(`✓ Database name: ${mongoose.connection.db.databaseName}`);
  } catch (err) {
    // Nếu kết nối thất bại, hiển thị lỗi và thoát ứng dụng
    console.error('✗ Database connection failed:', err.message);
    process.exit(1);
  }
};

// SỰ KIỆN: Lắng nghe khi database bị ngắt kết nối
mongoose.connection.on('disconnected', () => {
  console.warn('⚠ Database disconnected');
});

// SỰ KIỆN: Lắng nghe khi database kết nối lại
mongoose.connection.on('reconnected', () => {
  console.log('✓ Database reconnected');
});

// ==================== API ROUTES ====================

// ROUTE: Root endpoint - Kiểm tra server đang chạy
app.get('/', (request, response) => {
  response.json({ 
    message: 'Student Management System API',
    version: '1.0',
    status: 'running'
  });
});

// ROUTE: Student API endpoints
// Tất cả các route bắt đầu bằng /api/students sẽ được xử lý bởi studentRoutes
app.use('/api/students', studentRoutes);

// ==================== ERROR HANDLERS ====================

// HANDLER: 404 - Route không tồn tại
app.use((request, response) => {
  response.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: request.originalUrl
  });
});

// HANDLER: Global error handler
// Xử lý tất cả các lỗi từ middleware và routes
app.use((error, request, response, next) => {
  console.error('Server Error:', error);
  response.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  });
});

// ==================== START APPLICATION ====================

// HÀM: Khởi động ứng dụng
// Kết nối database trước, sau đó khởi động server
const startApplication = async () => {
  // Bước 1: Kết nối MongoDB
  await initializeDatabaseConnection();
  
  // Bước 2: Khởi động server
  app.listen(SERVER_PORT, () => {
    console.log('==========================================');
    console.log(`✓ Server running on port ${SERVER_PORT}`);
    console.log(`✓ API: http://localhost:${SERVER_PORT}/api/students`);
    console.log('==========================================');
  });
};

// Chạy ứng dụng
startApplication();
