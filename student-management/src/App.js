// ==================== COMPONENT: APP (ROOT) ====================
// Component chính của ứng dụng
// Cấu hình routing cho toàn bộ ứng dụng

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import EditStudent from './components/EditStudent';

const App = () => {
  return (
    // ===== BROWSER ROUTER =====
    // Kích hoạt routing cho ứng dụng React
    <BrowserRouter>
      <div className="App">
        {/* ===== ĐỊNH NGHĨA ROUTES ===== */}
        <Routes>
          {/* Route 1: Trang chủ - Hiển thị danh sách và form thêm học sinh */}
          <Route path="/" element={<HomePage />} />
          
          {/* Route 2: Trang chỉnh sửa - Nhận ID từ URL parameter */}
          <Route path="/edit/:id" element={<EditStudent />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
