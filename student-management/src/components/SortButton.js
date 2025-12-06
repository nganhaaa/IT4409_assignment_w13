// ==================== COMPONENT: NÚT SẮP XẾP ====================
// Component nút để chuyển đổi sắp xếp A-Z hoặc Z-A
// CHỨC NĂNG: SẮP XẾP HỌC SINH

import React from 'react';

const SortButton = ({ sortAsc, onSortToggle }) => {
  // ===== CONFIGURATION: Cấu hình màu sắc và icon cho 2 trạng thái =====
  const buttonConfig = {
    ascending: {     // Sắp xếp A → Z (tăng dần)
      bg: '#6f42c1',
      hoverBg: '#5a32a3',
      icon: '⬆️',
      text: 'A → Z'
    },
    descending: {    // Sắp xếp Z → A (giảm dần)
      bg: '#fd7e14',
      hoverBg: '#e8590c',
      icon: '⬇️',
      text: 'Z → A'
    }
  };

  // Chọn cấu hình tương ứng với trạng thái hiện tại
  const config = sortAsc ? buttonConfig.ascending : buttonConfig.descending;

  const styles = {
    container: {
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '25px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '15px'
    },
    label: {
      fontWeight: '600',
      color: '#495057',
      fontSize: '16px'
    },
    button: {
      padding: '12px 24px',
      backgroundColor: config.bg,
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '15px',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    },
    status: {
      color: '#6c757d',
      fontSize: '14px',
      fontStyle: 'italic'
    }
  };

  return (
    <div style={styles.container}>
      <span style={styles.label}>
        🔀 Sắp Xếp Danh Sách
      </span>
      
      <button
        onClick={onSortToggle}
        style={styles.button}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = config.hoverBg}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = config.bg}
      >
        <span>{config.icon}</span>
        <span>Tên: {config.text}</span>
      </button>
      
      <span style={styles.status}>
        {sortAsc ? 'Sắp xếp tăng dần' : 'Sắp xếp giảm dần'}
      </span>
    </div>
  );
};

export default SortButton;
