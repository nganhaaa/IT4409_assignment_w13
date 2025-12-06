// ==================== COMPONENT: THANH TÌM KIẾM ====================
// Component input để tìm kiếm học sinh theo tên hoặc lớp
// CHỨC NĂNG: TÌM KIẾM HỌC SINH

import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const styles = {
    wrapper: {
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '25px'
    },
    label: {
      display: 'block',
      marginBottom: '10px',
      fontWeight: '600',
      color: '#495057',
      fontSize: '16px'
    },
    inputContainer: {
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '12px 12px 12px 40px',
      fontSize: '15px',
      border: '2px solid #dee2e6',
      borderRadius: '8px',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    icon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '18px',
      color: '#6c757d'
    },
    hint: {
      marginTop: '8px',
      fontSize: '13px',
      color: '#6c757d',
      fontStyle: 'italic'
    }
  };

  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>
        🔍 Tìm Kiếm Học Sinh
      </label>
      <div style={styles.inputContainer}>
        <span style={styles.icon}>🔎</span>
        <input
          type="text"
          placeholder="Nhập tên hoặc lớp để tìm kiếm..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#007bff'}
          onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
        />
      </div>
      {searchTerm && (
        <div style={styles.hint}>
          Từ khóa: "<strong>{searchTerm}</strong>"
        </div>
      )}
    </div>
  );
};

export default SearchBar;
