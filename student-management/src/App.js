import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import EditStudent from './components/EditStudent';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/edit/:id" element={<EditStudent />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
