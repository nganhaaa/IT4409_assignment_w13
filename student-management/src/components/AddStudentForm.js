import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/students';

const AddStudentForm = ({ onStudentAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: ''
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', age: '', class: '' });
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(API_BASE_URL, {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        class: formData.class.trim()
      });

      if (response.data.success) {
        showNotification('✓ Đã thêm học sinh thành công!', 'success');
        onStudentAdded(response.data.data);
        resetForm();
      }
    } catch (error) {
      console.error('Add student error:', error);
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi thêm học sinh';
      showNotification(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div style={formStyles.container}>
      <h2 style={formStyles.title}>➕ Thêm Học Sinh Mới</h2>
      
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
      
      <form onSubmit={handleFormSubmit} style={formStyles.form}>
        <input 
          type="text" 
          placeholder="Họ và tên" 
          value={formData.name} 
          onChange={(e) => handleInputChange('name', e.target.value)} 
          required 
          style={formStyles.input}
          disabled={isSubmitting}
        />
        
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
        
        <input 
          type="text" 
          placeholder="Lớp" 
          value={formData.class} 
          onChange={(e) => handleInputChange('class', e.target.value)} 
          required 
          style={formStyles.input}
          disabled={isSubmitting}
        />
        
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
