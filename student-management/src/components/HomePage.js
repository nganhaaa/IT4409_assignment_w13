import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AddStudentForm from './AddStudentForm';
import StudentList from './StudentList';
import SearchBar from './SearchBar';
import SortButton from './SortButton';

const API_ENDPOINT = 'http://localhost:5000/api/students';

const HomePage = () => {
  const [studentData, setStudentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState(true); // true = ascending

  const loadStudentData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await axios.get(API_ENDPOINT);
      
      if (result.data.success) {
        setStudentData(result.data.data);
        setErrorMsg(null);
      } else {
        setStudentData(result.data);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
      setErrorMsg('Không thể kết nối đến server. Vui lòng kiểm tra lại!');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudentData();
  }, [loadStudentData]);

  const handleNewStudent = (student) => {
    setStudentData(prevData => [...prevData, student]);
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      const response = await axios.delete(`${API_ENDPOINT}/${studentId}`);
      
      if (response.data.success) {
        setStudentData(prevData => prevData.filter(s => s._id !== studentId));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Không thể xóa học sinh. Vui lòng thử lại!');
    }
  };

  const filterStudents = (students, query) => {
    if (!query.trim()) return students;
    
    const lowerQuery = query.toLowerCase();
    return students.filter(student =>
      student.name.toLowerCase().includes(lowerQuery) ||
      student.class.toLowerCase().includes(lowerQuery)
    );
  };

  const sortStudents = (students, ascending) => {
    return [...students].sort((a, b) => {
      const compareResult = a.name.localeCompare(b.name, 'vi');
      return ascending ? compareResult : -compareResult;
    });
  };

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
