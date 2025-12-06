// ==================== ROUTES: STUDENT API ====================
// File này định nghĩa tất cả các API endpoints để quản lý học sinh
// Bao gồm: XEM danh sách, THÊM, SỬA, XÓA học sinh

import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// ==================== CHỨC NĂNG: XEM DANH SÁCH HỌC SINH ====================
// METHOD: GET
// ENDPOINT: /api/students
// MÔ TẢ: Lấy toàn bộ danh sách học sinh, hỗ trợ tìm kiếm và sắp xếp
router.get('/', async (req, res) => {
  try {
    // Lấy parameters từ query string (URL)
    const { search, sortBy, order } = req.query;
    
    let query = {};        // Điều kiện tìm kiếm
    let sortOptions = {};  // Điều kiện sắp xếp

    // ===== TÌM KIẾM =====
    // Nếu có từ khóa tìm kiếm, tìm theo tên HOẶC lớp
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },   // Tìm theo tên (không phân biệt hoa thường)
          { class: { $regex: search, $options: 'i' } }   // Tìm theo lớp (không phân biệt hoa thường)
        ]
      };
    }

    // ===== SẮP XẾP =====
    // Sắp xếp theo trường được chỉ định (name, age, class)
    if (sortBy) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;  // -1: giảm dần, 1: tăng dần
    } else {
      sortOptions = { name: 1 };  // Mặc định: sắp xếp theo tên (A->Z)
    }

    // ===== THỰC HIỆN QUERY =====
    // Tìm học sinh theo điều kiện và sắp xếp kết quả
    const studentList = await Student.find(query).sort(sortOptions);
    
    // ===== TRẢ KẾT QUẢ =====
    res.status(200).json({
      success: true,
      count: studentList.length,  // Số lượng học sinh tìm được
      data: studentList           // Danh sách học sinh
    });
  } catch (error) {
    // ===== XỬ LÝ LỖI =====
    console.error('Error fetching students:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể lấy danh sách học sinh',
      error: error.message 
    });
  }
});

// ==================== CHỨC NĂNG: THÊM HỌC SINH MỚI ====================
// METHOD: POST
// ENDPOINT: /api/students
// MÔ TẢ: Thêm một học sinh mới vào database
// BODY: { name, age, class }
router.post('/', async (req, res) => {
  try {
    // ===== NHẬN DỮ LIỆU =====
    // Lấy thông tin học sinh từ request body
    const { name, age, class: studentClass } = req.body;

    // ===== VALIDATION =====
    // Kiểm tra các trường bắt buộc
    if (!name || !age || !studentClass) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: name, age, class'
      });
    }

    // ===== TẠO HỌC SINH MỚI =====
    // Khởi tạo object học sinh với dữ liệu đã xử lý
    const newStudent = new Student({
      name: name.trim(),              // Xóa khoảng trắng thừa
      age: parseInt(age),             // Chuyển sang số nguyên
      class: studentClass.trim()      // Xóa khoảng trắng thừa
    });

    // ===== LƯU VÀO DATABASE =====
    // Mongoose sẽ tự động validate và chạy middleware pre('save')
    await newStudent.save();
    
    // ===== TRẢ KẾT QUẢ =====
    res.status(201).json({
      success: true,
      message: 'Đã thêm học sinh mới thành công',
      data: newStudent  // Trả về thông tin học sinh vừa tạo
    });
  } catch (error) {
    // ===== XỬ LÝ LỖI VALIDATION =====
    if (error.name === 'ValidationError') {
      // Lấy tất cả thông báo lỗi từ Mongoose validation
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false,
        message: messages.join(', ')
      });
    }
    
    // ===== XỬ LÝ LỖI CHUNG =====
    console.error('Error creating student:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi thêm học sinh',
      error: error.message 
    });
  }
});

// ==================== CHỨC NĂNG: XEM CHI TIẾT HỌC SINH ====================
// METHOD: GET
// ENDPOINT: /api/students/:id
// MÔ TẢ: Lấy thông tin chi tiết của một học sinh theo ID
router.get('/:id', async (req, res) => {
  try {
    // ===== LẤY ID =====
    const studentId = req.params.id;  // Lấy ID từ URL parameter
    
    // ===== TÌM HỌC SINH =====
    const student = await Student.findById(studentId);
    
    // ===== KIỂM TRA TỒN TẠI =====
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: `Không tìm thấy học sinh với ID: ${studentId}` 
      });
    }
    
    // ===== TRẢ KẾT QUẢ =====
    res.status(200).json({
      success: true,
      data: student  // Thông tin học sinh
    });
  } catch (error) {
    // ===== XỬ LÝ LỖI ID KHÔNG HỢP LỆ =====
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        success: false,
        message: 'ID không đúng định dạng' 
      });
    }
    
    // ===== XỬ LÝ LỖI CHUNG =====
    console.error('Error getting student:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi lấy thông tin học sinh',
      error: error.message 
    });
  }
});

// ==================== CHỨC NĂNG: CẬP NHẬT THÔNG TIN HỌC SINH ====================
// METHOD: PUT
// ENDPOINT: /api/students/:id
// MÔ TẢ: Cập nhật thông tin học sinh (name, age, class)
// BODY: { name?, age?, class? } - Các trường optional
router.put('/:id', async (req, res) => {
  try {
    // ===== LẤY ID =====
    const studentId = req.params.id;
    
    // ===== CHUẨN BỊ DỮ LIỆU CẬP NHẬT =====
    const updates = {};
    
    // Chỉ cập nhật những trường được gửi lên (partial update)
    if (req.body.name !== undefined) updates.name = req.body.name.trim();
    if (req.body.age !== undefined) updates.age = parseInt(req.body.age);
    if (req.body.class !== undefined) updates.class = req.body.class.trim();

    // ===== THỰC HIỆN CẬP NHẬT =====
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,      // ID học sinh cần update
      updates,        // Dữ liệu mới
      { 
        new: true,          // Trả về document sau khi update
        runValidators: true // Chạy validation cho dữ liệu mới
      }
    );
    
    // ===== KIỂM TRA TỒN TẠI =====
    if (!updatedStudent) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy học sinh để cập nhật' 
      });
    }
    
    // ===== TRẢ KẾT QUẢ =====
    res.status(200).json({
      success: true,
      message: 'Cập nhật thành công',
      data: updatedStudent  // Thông tin học sinh sau khi cập nhật
    });
  } catch (error) {
    // ===== XỬ LÝ LỖI VALIDATION =====
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false,
        message: messages.join(', ')
      });
    }
    
    // ===== XỬ LÝ LỖI CHUNG =====
    console.error('Error updating student:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi cập nhật học sinh',
      error: error.message 
    });
  }
});

// ==================== CHỨC NĂNG: XÓA HỌC SINH ====================
// METHOD: DELETE
// ENDPOINT: /api/students/:id
// MÔ TẢ: Xóa một học sinh khỏi database
router.delete('/:id', async (req, res) => {
  try {
    // ===== LẤY ID =====
    const studentId = req.params.id;
    
    // ===== THỰC HIỆN XÓA =====
    // findByIdAndDelete tìm và xóa trong một lần gọi
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    
    // ===== KIỂM TRA TỒN TẠI =====
    if (!deletedStudent) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy học sinh để xóa' 
      });
    }
    
    // ===== TRẢ KẾT QUẢ =====
    res.status(200).json({ 
      success: true,
      message: `Đã xóa học sinh "${deletedStudent.name}" thành công`,
      data: {
        _id: deletedStudent._id,
        name: deletedStudent.name,
        age: deletedStudent.age,
        class: deletedStudent.class
      }
    });
  } catch (error) {
    // ===== XỬ LÝ LỖI =====
    console.error('Error deleting student:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi xóa học sinh',
      error: error.message 
    });
  }
});

// ==================== EXPORT ROUTER ====================
export default router;
