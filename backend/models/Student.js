// ==================== MODEL: STUDENT ====================
// File này định nghĩa cấu trúc dữ liệu học sinh trong MongoDB
// Sử dụng Mongoose Schema để validate và quản lý dữ liệu

import mongoose from 'mongoose';

// ĐỊNH NGHĨA SCHEMA CHO HỌC SINH
// Schema xác định cấu trúc và quy tắc cho dữ liệu học sinh
const StudentSchema = new mongoose.Schema(
  {
    // TRƯỜNG: Tên học sinh
    name: {
      type: String,                                    // Kiểu dữ liệu: Chuỗi
      required: [true, 'Vui lòng nhập tên học sinh'], // Bắt buộc phải nhập
      trim: true,                                      // Tự động xóa khoảng trắng đầu/cuối
      minlength: [2, 'Tên phải có ít nhất 2 ký tự']  // Độ dài tối thiểu
    },
    
    // TRƯỜNG: Tuổi học sinh
    age: {
      type: Number,                              // Kiểu dữ liệu: Số
      required: [true, 'Vui lòng nhập tuổi'],   // Bắt buộc phải nhập
      min: [5, 'Tuổi phải từ 5 trở lên'],       // Giá trị tối thiểu
      max: [100, 'Tuổi không hợp lệ']           // Giá trị tối đa
    },
    
    // TRƯỜNG: Lớp học
    class: {
      type: String,                           // Kiểu dữ liệu: Chuỗi
      required: [true, 'Vui lòng nhập lớp'], // Bắt buộc phải nhập
      trim: true                              // Tự động xóa khoảng trắng đầu/cuối
    }
  },
  {
    timestamps: true,          // Tự động thêm createdAt và updatedAt
    versionKey: false,         // Không thêm trường __v
    collection: 'students'     // Tên collection trong MongoDB
  }
);

// ==================== MIDDLEWARE ====================
// CHỨC NĂNG: Tự động viết hoa chữ cái đầu mỗi từ trong tên
// Chạy TRƯỚC KHI lưu (save) vào database
StudentSchema.pre('save', function() {
  if (this.name) {
    // Tách tên thành các từ
    // Viết hoa chữ cái đầu, viết thường các chữ còn lại
    // Nối lại thành chuỗi hoàn chỉnh
    this.name = this.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
});

// ==================== INSTANCE METHODS ====================
// PHƯƠNG THỨC: Kiểm tra học sinh giỏi
// Học sinh giỏi là học sinh có tuổi nhỏ hơn hoặc bằng tuổi chuẩn của lớp
StudentSchema.methods.isExcellentStudent = function() {
  const classNumber = parseInt(this.class.match(/\d+/)?.[0] || 0); // Lấy số lớp (vd: "10A1" -> 10)
  const expectedAge = classNumber + 6;                               // Tuổi chuẩn = số lớp + 6
  return this.age <= expectedAge;                                    // So sánh với tuổi thực tế
};

// ==================== STATIC METHODS ====================
// PHƯƠNG THỨC TĨNH: Tìm học sinh theo khoảng tuổi
// Sử dụng: Student.findByAgeRange(15, 18)
StudentSchema.statics.findByAgeRange = function(minAge, maxAge) {
  return this.find({ age: { $gte: minAge, $lte: maxAge } });
};

// PHƯƠNG THỨC TĨNH: Thống kê học sinh theo lớp
// Trả về số lượng và tuổi trung bình của mỗi lớp
StudentSchema.statics.getStatsByClass = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$class',                    // Nhóm theo lớp
        count: { $sum: 1 },               // Đếm số học sinh
        averageAge: { $avg: '$age' }      // Tính tuổi trung bình
      }
    },
    { $sort: { _id: 1 } }                // Sắp xếp theo tên lớp
  ]);
};

// ==================== INDEXES ====================
// Tạo index để tối ưu hóa tìm kiếm
StudentSchema.index({ name: 'text' });      // Index text search cho tên
StudentSchema.index({ class: 1, age: 1 });  // Index compound cho lớp và tuổi

// ==================== EXPORT MODEL ====================
// Tạo và export model Student từ schema
const Student = mongoose.model('Student', StudentSchema);

export default Student;
