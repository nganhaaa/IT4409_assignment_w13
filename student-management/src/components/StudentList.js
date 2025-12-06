import { useNavigate } from 'react-router-dom';

const StudentList = ({ students, loading, error, onDelete }) => {
  const navigate = useNavigate();

  const navigateToEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const confirmAndDelete = (id, name) => {
    const confirmed = window.confirm(`Xác nhận xóa học sinh: ${name}?`);
    if (confirmed) {
      onDelete(id);
    }
  };

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
    editBtn: {
      padding: '6px 12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginRight: '8px',
      fontSize: '14px'
    },
    deleteBtn: {
      padding: '6px 12px',
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px'
    }
  };

  if (loading) {
    return (
      <div style={tableStyles.container}>
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>
          ⏳ Đang tải dữ liệu...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={tableStyles.container}>
        <p style={{ textAlign: 'center', color: '#dc3545', fontSize: '16px' }}>
          ❌ {error}
        </p>
      </div>
    );
  }

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
            {students.map((student, idx) => (
              <tr key={student._id} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f8f9fa' }}>
                <td style={{ ...tableStyles.td, textAlign: 'center' }}>{idx + 1}</td>
                <td style={tableStyles.td}>{student.name}</td>
                <td style={{ ...tableStyles.td, textAlign: 'center' }}>{student.age}</td>
                <td style={tableStyles.td}>{student.class}</td>
                <td style={{ ...tableStyles.td, textAlign: 'center' }}>
                  <button
                    onClick={() => navigateToEdit(student._id)}
                    style={tableStyles.editBtn}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                  >
                    ✏️ Sửa
                  </button>
                  
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
