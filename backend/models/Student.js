import mongoose from 'mongoose';

// Định nghĩa Schema với cấu trúc mới nhưng giữ nguyên 3 trường: name, age, class
const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên học sinh'],
      trim: true,
      minlength: [2, 'Tên phải có ít nhất 2 ký tự']
    },
    age: {
      type: Number,
      required: [true, 'Vui lòng nhập tuổi'],
      min: [5, 'Tuổi phải từ 5 trở lên'],
      max: [100, 'Tuổi không hợp lệ']
    },
    class: {
      type: String,
      required: [true, 'Vui lòng nhập lớp'],
      trim: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'students'
  }
);

// Middleware: Tự động capitalize tên trước khi lưu
StudentSchema.pre('save', function() {
  if (this.name) {
    this.name = this.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
});

// Method: Kiểm tra học sinh có phải học sinh giỏi không (tuổi nhỏ so với lớp)
StudentSchema.methods.isExcellentStudent = function() {
  const classNumber = parseInt(this.class.match(/\d+/)?.[0] || 0);
  const expectedAge = classNumber + 6;
  return this.age <= expectedAge;
};

// Static method: Tìm học sinh theo độ tuổi
StudentSchema.statics.findByAgeRange = function(minAge, maxAge) {
  return this.find({ age: { $gte: minAge, $lte: maxAge } });
};

// Static method: Thống kê theo lớp
StudentSchema.statics.getStatsByClass = async function() {
  return this.aggregate([
    {
      $group: {
        _id: '$class',
        count: { $sum: 1 },
        averageAge: { $avg: '$age' }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Tạo index để tối ưu tìm kiếm
StudentSchema.index({ name: 'text' });
StudentSchema.index({ class: 1, age: 1 });

const Student = mongoose.model('Student', StudentSchema);

export default Student;
