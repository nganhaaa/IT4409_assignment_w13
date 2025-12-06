// ==================== COMPONENT: DANH SÁCH HỌC SINH ====================
// Component hiển thị bảng danh sách học sinh
// Có nút SỬA và XÓA cho mỗi học sinh

import { useNavigate } from 'react-router-dom';

const StudentList = ({ students, loading, error, onDelete }) => {
  // ===== HOOK: Điều hướng giữa các trang =====
  const navigate = useNavigate();

  // ==================== HANDLER FUNCTIONS ====================
  
  // HÀM: Chuyển đến trang chỉnh sửa học sinh
  // CHỨC NĂNG: SỬA HỌC SINH
  const navigateToEdit = (id) => {
    navigate(`/edit/${id}`);  // Chuyển đến /edit/:id
  };

  // HÀM: Xác nhận và xóa học sinh
  // CHỨC NĂNG: XÓA HỌC SINH
  const confirmAndDelete = (id, name) => {
    // Hiển thị hộp thoại xác nhận
    const confirmed = window.confirm(`Xác nhận xóa học sinh: ${name}?`);
    if (confirmed) {
      onDelete(id);  // Gọi callback để xóa học sinh
    }
  };

  // ===== INLINE STYLES: Định dạng giao diện bảng =====
  const tableStyles = {
    container: {
      backgroundColor: '#ffffff',
      padding: '25px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    title: {
      color: '#333',
      marginBottom: '20px',
      fontSize: '24px'
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    th: {
      backgroundColor: '#f8f9fa',
      padding: '15px',
      textAlign: 'left',
      fontWeight: '600',
      color: '#495057',
      borderBottom: '2px solid #dee2e6'
    },
    td: {
      padding: '12px 15px',
      borderBottom: '1px solid #e0e0e0'
    },
    editBtn: {  // NÚT SỬA (màu xanh dương)
      padding: '6px 12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '8px',
      fontSize: '14px'
    },
    deleteBtn: {  // NÚT XÓA (màu đỏ)
      padding: '6px 12px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    }
  };

  // ==================== RENDER: Giao diện hiển thị ====================
  
  // TRẠNG THÁI: Đang tải dữ liệu
  if (loading) {
    return (
      <div style={tableStyles.container}>
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>
          ⏳ Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  // TRẠNG THÁI: Có lỗi xảy ra
  if (error) {
    return (
      <div style={tableStyles.container}>
        <p style={{ textAlign: 'center', color: '#dc3545', fontSize: '16px' }}>
          ❌ {error}
        </p>
      </div>
    );
  }

  // TRẠNG THÁI: Hiển thị bình thường
  // CHỨC NĂNG: XEM DANH SÁCH HỌC SINH
  return (
    <div style={tableStyles.container}>
      <h2 style={tableStyles.title}>📋 Danh Sách Học Sinh</h2>
      
      {students.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6c757d', fontSize: '16px' }}>
          Không có học sinh nào trong danh sách
        </p>
      ) : (
        <table style={tableStyles.table}>
          <thead>
            <tr>
              <th style={{ ...tableStyles.th, width: '60px' }}>STT</th>
              <th style={tableStyles.th}>Họ và Tên</th>
              <th style={{ ...tableStyles.th, width: '80px' }}>Tuổi</th>
              <th style={{ ...tableStyles.th, width: '120px' }}>Lớp</th>
              <th style={{ ...tableStyles.th, width: '180px', textAlign: 'center' }}>
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Lặp qua từng học sinh và hiển thị thông tin */}
            {students.map((student, idx) => (
              <tr key={student._id} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                <td style={{ ...tableStyles.td, textAlign: 'center' }}>{idx + 1}</td>
                <td style={tableStyles.td}>{student.name}</td>
                <td style={{ ...tableStyles.td, textAlign: 'center' }}>{student.age}</td>
                <td style={tableStyles.td}>{student.class}</td>
                <td style={{ ...tableStyles.td, textAlign: 'center' }}>
                  {/* NÚT SỬA - CHỨC NĂNG: SỬA HỌC SINH */}
                  <button
                    onClick={() => navigateToEdit(student._id)}
                    style={tableStyles.editBtn}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                  >
                    ✏️ Sửa
                  </button>
                  
                  {/* NÚT XÓA - CHỨC NĂNG: XÓA HỌC SINH */}
                  <button
                    onClick={() => confirmAndDelete(student._id, student.name)}
                    style={tableStyles.deleteBtn}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentList;
