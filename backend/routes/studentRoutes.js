import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// GET /api/students - Lấy toàn bộ danh sách học sinh
router.get('/', async (req, res) => {
  try {
    const { search, sortBy, order } = req.query;
    
    let query = {};
    let sortOptions = {};

    // Tìm kiếm theo tên hoặc lớp
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { class: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Sắp xếp
    if (sortBy) {
      sortOptions[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      sortOptions = { name: 1 }; // Mặc định sắp xếp theo tên
    }

    const studentList = await Student.find(query).sort(sortOptions);
    
    res.status(200).json({
      success: true,
      count: studentList.length,
      data: studentList
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ 
      success: false,
      message: 'Không thể lấy danh sách học sinh',
      error: error.message 
    });
  }
});

// POST /api/students - Thêm học sinh mới
router.post('/', async (req, res) => {
  try {
    const { name, age, class: studentClass } = req.body;

    // Validation cơ bản
    if (!name || !age || !studentClass) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: name, age, class'
      });
    }

    const newStudent = new Student({
      name: name.trim(),
      age: parseInt(age),
      class: studentClass.trim()
    });

    await newStudent.save();
    
    res.status(201).json({
      success: true,
      message: 'Đã thêm học sinh mới thành công',
      data: newStudent
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false,
        message: messages.join(', ')
      });
    }
    
    console.error('Error creating student:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi thêm học sinh',
      error: error.message 
    });
  }
});

// GET /api/students/:id - Lấy thông tin một học sinh
router.get('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: `Không tìm thấy học sinh với ID: ${studentId}` 
      });
    }
    
    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ 
        success: false,
        message: 'ID không đúng định dạng' 
      });
    }
    
    console.error('Error getting student:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi lấy thông tin học sinh',
      error: error.message 
    });
  }
});

// PUT /api/students/:id - Cập nhật thông tin học sinh
router.put('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const updates = {};

    // Chỉ update những field được gửi lên
    if (req.body.name !== undefined) updates.name = req.body.name.trim();
    if (req.body.age !== undefined) updates.age = parseInt(req.body.age);
    if (req.body.class !== undefined) updates.class = req.body.class.trim();

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updates,
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!updatedStudent) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy học sinh để cập nhật' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật thành công',
      data: updatedStudent
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false,
        message: messages.join(', ')
      });
    }
    
    console.error('Error updating student:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi cập nhật học sinh',
      error: error.message 
    });
  }
});

// DELETE /api/students/:id - Xóa học sinh
router.delete('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    
    if (!deletedStudent) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy học sinh để xóa' 
      });
    }
    
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
    console.error('Error deleting student:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi khi xóa học sinh',
      error: error.message 
    });
  }
});

export default router;
