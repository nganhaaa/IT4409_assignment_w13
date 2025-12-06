// ==================== COMPONENT: CHỈNH SỬA HỌC SINH ====================
// Component dùng để sửa thông tin học sinh đã tồn tại
// CHỨC NĂNG: SỬA HỌC SINH

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/students';

const EditStudent = () => {
  // ===== HOOKS: Lấy tham số và điều hướng =====
  const { id } = useParams();           // Lấy ID học sinh từ URL
  const navigate = useNavigate();       // Hàm điều hướng về trang chủ
  
  // ===== STATE MANAGEMENT: Quản lý trạng thái =====
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    age: '',
    class: ''
  });
  const [isLoading, setIsLoading] = useState(true);           // Đang tải dữ liệu
  const [errorMessage, setErrorMessage] = useState(null);     // Thông báo lỗi
  const [isSubmitting, setIsSubmitting] = useState(false);    // Đang gửi form

  // ==================== CHỨC NĂNG: XEM THÔNG TIN HỌC SINH ====================
  // Hook: Tự động tải thông tin học sinh khi component được mount
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        
        // Lấy dữ liệu từ response (hỗ trợ 2 định dạng)
        const data = response.data.success ? response.data.data : response.data;
        setStudentInfo({
          name: data.name,
          age: data.age.toString(),
          class: data.class
        });
        setErrorMessage(null);
      } catch (err) {
        console.error('Error loading student:', err);
        setErrorMessage('Không thể tải thông tin học sinh');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);  // Chạy lại khi ID thay đổi

  // ==================== HANDLER FUNCTIONS ====================
  
  // HÀM: Cập nhật giá trị input khi người dùng nhập
  const handleInputUpdate = (field, value) => {
    setStudentInfo(prev => ({ ...prev, [field]: value }));
  };

  // ==================== CHỨC NĂNG: SỬA HỌC SINH ====================
  // HÀM: Xử lý khi submit form cập nhật
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);  // Bật trạng thái đang gửi

    try {
      // Gửi request PUT để cập nhật thông tin học sinh
      await axios.put(`${API_BASE_URL}/${id}`, {
        name: studentInfo.name.trim(),
        age: parseInt(studentInfo.age),
        class: studentInfo.class.trim()
      });

      // Chuyển về trang chủ kèm thông báo thành công
      navigate('/', { state: { message: 'Cập nhật thành công!' } });
    } catch (err) {
      console.error('Update error:', err);
      alert('Không thể cập nhật thông tin. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);  // Tắt trạng thái đang gửi
    }
  };

  // HÀM: Quay về trang chủ
  const goBack = () => navigate('/');

  const pageStyles = {
    container: {
      maxWidth: '700px',
      margin: '40px auto',
      padding: '30px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      textAlign: 'center',
      color: '#2c3e50',
      marginBottom: '30px',
      fontSize: '28px',
      fontWeight: '700'
    },
    formCard: {
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    fieldGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#495057',
      fontSize: '15px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '15px',
      transition: 'border-color 0.3s',
      boxSizing: 'border-box'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '25px'
    },
    submitBtn: {
      flex: 1,
      padding: '14px',
      backgroundColor: isSubmitting ? '#95a5a6' : '#27ae60',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background-color 0.3s'
    },
    cancelBtn: {
      flex: 1,
      padding: '14px',
      backgroundColor: '#95a5a6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background-color 0.3s'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '60px 20px',
      fontSize: '18px',
      color: '#7f8c8d'
    },
    errorContainer: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#e74c3c'
    }
  };

  if (isLoading) {
    return (
      <div style={pageStyles.container}>
        <div style={pageStyles.loadingContainer}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <p>Đang tải thông tin học sinh...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={pageStyles.container}>
        <div style={pageStyles.errorContainer}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>{errorMessage}</p>
          <button onClick={goBack} style={{ ...pageStyles.cancelBtn, maxWidth: '200px' }}>
            ← Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyles.container}>
      <h1 style={pageStyles.header}>✏️ Chỉnh Sửa Thông Tin Học Sinh</h1>
      
      <div style={pageStyles.formCard}>
        <form onSubmit={handleFormSubmit}>
          <div style={pageStyles.fieldGroup}>
            <label style={pageStyles.label}>Họ và Tên:</label>
            <input 
              type="text" 
              value={studentInfo.name} 
              onChange={(e) => handleInputUpdate('name', e.target.value)} 
              required 
              style={pageStyles.input}
              disabled={isSubmitting}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={pageStyles.fieldGroup}>
            <label style={pageStyles.label}>Tuổi:</label>
            <input 
              type="number" 
              value={studentInfo.age} 
              onChange={(e) => handleInputUpdate('age', e.target.value)} 
              required 
              min="5"
              max="100"
              style={pageStyles.input}
              disabled={isSubmitting}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={pageStyles.fieldGroup}>
            <label style={pageStyles.label}>Lớp:</label>
            <input 
              type="text" 
              value={studentInfo.class} 
              onChange={(e) => handleInputUpdate('class', e.target.value)} 
              required 
              style={pageStyles.input}
              disabled={isSubmitting}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={pageStyles.buttonGroup}>
            <button 
              type="submit"
              style={pageStyles.submitBtn}
              disabled={isSubmitting}
              onMouseOver={(e) => !isSubmitting && (e.target.style.backgroundColor = '#229954')}
              onMouseOut={(e) => !isSubmitting && (e.target.style.backgroundColor = '#27ae60')}
            >
              {isSubmitting ? '⏳ Đang cập nhật...' : '✓ Cập nhật'}
            </button>
            
            <button 
              type="button"
              onClick={goBack}
              style={pageStyles.cancelBtn}
              disabled={isSubmitting}
              onMouseOver={(e) => e.target.style.backgroundColor = '#7f8c8d'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#95a5a6'}
            >
              ✕ Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
