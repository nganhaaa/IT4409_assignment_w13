// ==================== COMPONENT: FORM THÊM HỌC SINH ====================
// Component hiển thị form để thêm học sinh mới
// Gửi request POST đến backend khi submit

import { useState } from 'react';
import axios from 'axios';

// ===== CẤU HÌNH API =====
const API_BASE_URL = 'http://localhost:5000/api/students';

const AddStudentForm = ({ onStudentAdded }) => {
  // ==================== STATE MANAGEMENT ====================
  
  // STATE 1: Dữ liệu form (name, age, class)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: ''
  });
  
  // STATE 2: Thông báo thành công/lỗi
  const [notification, setNotification] = useState({ 
    show: false,    // Hiển thị hay không
    message: '',    // Nội dung thông báo
    type: ''        // 'success' hoặc 'error'
  });
  
  // STATE 3: Trạng thái đang submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==================== HANDLER FUNCTIONS ====================
  
  // HÀM: Cập nhật giá trị input khi người dùng nhập
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // HÀM: Reset form về trạng thái ban đầu
  const resetForm = () => {
    setFormData({ name: '', age: '', class: '' });
  };

  // HÀM: Hiển thị thông báo (tự động ẩn sau 3 giây)
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // HÀM: Xử lý submit form
  const handleFormSubmit = async (event) => {
    // Ngăn form reload trang
    event.preventDefault();
    
    // Đánh dấu đang submit (disable form)
    setIsSubmitting(true);

    try {
      // ===== GỬI REQUEST THÊM HỌC SINH =====
      const response = await axios.post(API_BASE_URL, {
        name: formData.name.trim(),      // Xóa khoảng trắng thừa
        age: parseInt(formData.age),     // Chuyển sang số
        class: formData.class.trim()     // Xóa khoảng trắng thừa
      });

      // ===== XỬ LÝ THÀNH CÔNG =====
      if (response.data.success) {
        showNotification('✓ Đã thêm học sinh thành công!', 'success');
        onStudentAdded(response.data.data);  // Gọi callback để cập nhật danh sách
        resetForm();                          // Xóa form
      }
    } catch (error) {
      // ===== XỬ LÝ LỖI =====
      console.error('Add student error:', error);
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi thêm học sinh';
      showNotification(errorMsg, 'error');
    } finally {
      // Kết thúc submit (enable lại form)
      setIsSubmitting(false);
    }
  };

  // ==================== INLINE STYLES ====================
  const formStyles = {
    container: {
      backgroundColor: '#ffffff',
      padding: '25px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '30px'
    },
    title: {
      color: '#333',
      marginBottom: '20px',
      fontSize: '24px'
    },
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px'
    },
    input: {
      padding: '12px',
      border: '2px solid #e0e0e0',
      borderRadius: '6px',
      fontSize: '14px',
      transition: 'border-color 0.3s'
    },
    button: {
      padding: '12px 24px',
      backgroundColor: isSubmitting ? '#ccc' : '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background-color 0.3s'
    }
  };

  // ==================== RENDER UI ====================
  return (
    <div style={formStyles.container}>
      {/* ===== TIÊU ĐỀ ===== */}
      <h2 style={formStyles.title}>➕ Thêm Học Sinh Mới</h2>
      
      {/* ===== THÔNG BÁO (hiển thị khi có) ===== */}
      {notification.show && (
        <div style={{
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '15px',
          backgroundColor: notification.type === 'success' ? '#d4edda' : '#f8d7da',
          color: notification.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${notification.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {notification.message}
        </div>
      )}
      
      {/* ===== FORM NHẬP LIỆU ===== */}
      <form onSubmit={handleFormSubmit} style={formStyles.form}>
        {/* Input 1: Tên học sinh */}
        <input 
          type="text" 
          placeholder="Họ và tên" 
          value={formData.name} 
          onChange={(e) => handleInputChange('name', e.target.value)} 
          required 
          style={formStyles.input}
          disabled={isSubmitting}  // Disable khi đang submit
        />
        
        {/* Input 2: Tuổi */}
        <input 
          type="number" 
          placeholder="Tuổi" 
          value={formData.age} 
          onChange={(e) => handleInputChange('age', e.target.value)} 
          required 
          min="5"
          max="100"
          style={formStyles.input}
          disabled={isSubmitting}
        />
        
        {/* Input 3: Lớp */}
        <input 
          type="text" 
          placeholder="Lớp" 
          value={formData.class} 
          onChange={(e) => handleInputChange('class', e.target.value)} 
          required 
          style={formStyles.input}
          disabled={isSubmitting}
        />
        
        {/* Nút Submit */}
        <button 
          type="submit"
          style={formStyles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? '⏳ Đang thêm...' : '✓ Thêm học sinh'}
        </button>
      </form>
    </div>
  );
};

export default AddStudentForm;
