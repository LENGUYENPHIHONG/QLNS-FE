import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/header';
import Dashboard from './page/dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Đường dẫn mặc định là Dashboard sau khi đăng nhập thành công */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/" element={<Header />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
