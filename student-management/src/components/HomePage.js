// ==================== COMPONENT: TRANG CHỦ ====================
// Component chính quản lý toàn bộ chức năng CRUD học sinh
// Tích hợp: Form thêm học sinh, Danh sách, Tìm kiếm, Sắp xếp

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AddStudentForm from './AddStudentForm';
import StudentList from './StudentList';
import SearchBar from './SearchBar';
import SortButton from './SortButton';

const API_ENDPOINT = 'http://localhost:5000/api/students';

const HomePage = () => {
  // ===== STATE MANAGEMENT: Quản lý trạng thái dữ liệu =====
  const [studentData, setStudentData] = useState([]);       // Danh sách học sinh
  const [isLoading, setIsLoading] = useState(true);         // Trạng thái đang tải
  const [errorMsg, setErrorMsg] = useState(null);           // Thông báo lỗi
  const [searchQuery, setSearchQuery] = useState('');       // Từ khóa tìm kiếm
  const [sortDirection, setSortDirection] = useState(true); // true = A-Z, false = Z-A

  // ==================== CHỨC NĂNG: XEM DANH SÁCH HỌC SINH ====================
  // HÀM: Tải dữ liệu học sinh từ API
  // Sử dụng useCallback để tránh render lại không cần thiết
  const loadStudentData = useCallback(async () => {
    try {
      setIsLoading(true);  // Bật trạng thái loading
      const result = await axios.get(API_ENDPOINT);
      
      if (result.data.success) {
        setStudentData(result.data.data);  // Lưu dữ liệu học sinh
        setErrorMsg(null);
      } else {
        setStudentData(result.data);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      setErrorMsg('Không thể kết nối đến server. Vui lòng kiểm tra lại!');
    } finally {
      setIsLoading(false);  // Tắt trạng thái loading
    }
  }, []);

  // Hook: Tự động tải dữ liệu khi component được mount
  useEffect(() => {
    loadStudentData();
  }, [loadStudentData]);

  // ==================== CHỨC NĂNG: THÊM HỌC SINH ====================
  // HÀM: Xử lý sau khi thêm học sinh mới thành công
  // Thêm học sinh vào danh sách hiện tại (không cần reload)
  const handleNewStudent = (student) => {
    setStudentData(prevData => [...prevData, student]);
  };

  // ==================== CHỨC NĂNG: XÓA HỌC SINH ====================
  // HÀM: Xóa học sinh theo ID
  const handleRemoveStudent = async (studentId) => {
    try {
      const response = await axios.delete(`${API_ENDPOINT}/${studentId}`);
      
      if (response.data.success) {
        // Xóa học sinh khỏi danh sách hiện tại
        setStudentData(prevData => prevData.filter(s => s._id !== studentId));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Không thể xóa học sinh. Vui lòng thử lại!');
    }
  };

  // ==================== CHỨC NĂNG: TÌM KIẾM HỌC SINH ====================
  // HÀM: Lọc danh sách học sinh theo từ khóa (tên hoặc lớp)
  const filterStudents = (students, query) => {
    if (!query.trim()) return students;  // Không có từ khóa -> trả về tất cả
    
    const lowerQuery = query.toLowerCase();
    return students.filter(student =>
      student.name.toLowerCase().includes(lowerQuery) ||
      student.class.toLowerCase().includes(lowerQuery)
    );
  };

  // ==================== CHỨC NĂNG: SẮP XẾP HỌC SINH ====================
  // HÀM: Sắp xếp danh sách theo tên (A-Z hoặc Z-A)
  const sortStudents = (students, ascending) => {
    return [...students].sort((a, b) => {
      const compareResult = a.name.localeCompare(b.name, 'vi');  // So sánh tiếng Việt
      return ascending ? compareResult : -compareResult;
    });
  };

  // XỬ LÝ: Kết hợp tìm kiếm và sắp xếp
  const processedStudents = sortStudents(
    filterStudents(studentData, searchQuery),
    sortDirection
  );

  const pageStyles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    header: {
      textAlign: 'center',
      color: '#2c3e50',
      marginBottom: '30px',
      fontSize: '36px',
      fontWeight: '700'
    },
    statsBar: {
      backgroundColor: '#e3f2fd',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center',
      color: '#1976d2',
      fontSize: '16px'
    }
  };

  return (
    <div style={pageStyles.container}>
      <h1 style={pageStyles.header}>🎓 Hệ Thống Quản Lý Học Sinh</h1>
      
      <AddStudentForm onStudentAdded={handleNewStudent} />
      
      <SearchBar 
        searchTerm={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      <SortButton 
        sortAsc={sortDirection} 
        onSortToggle={() => setSortDirection(prev => !prev)} 
      />
      
      {searchQuery && (
        <div style={pageStyles.statsBar}>
          📊 Tìm thấy <strong>{processedStudents.length}</strong> học sinh
          {processedStudents.length !== studentData.length && 
            ` (trong tổng số ${studentData.length} học sinh)`}
        </div>
      )}
      
      <StudentList 
        students={processedStudents}
        loading={isLoading} 
        error={errorMsg} 
        onDelete={handleRemoveStudent} 
      />
    </div>
  );
};

export default HomePage;
