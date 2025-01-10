// src/components/Header.js
import React from 'react';
import '../Header/header.css'; // Tạo file CSS để tùy chỉnh phong cách nếu cần
import { FaUserCircle } from 'react-icons/fa'; // Icon người dùng
import logo from '../../assets/logoqlns.jpg';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt='logo' className='logo-img'/>
        <h1>Quản Lý Nhân Sự</h1>
      </div>
      <div className="nav-links">
        <div className="user-info">
          <FaUserCircle size={28} />
          <span className="username">Xin chào, Pink</span>
        </div>
        <button className="logout-btn">Log Out</button>
      </div>
    </header>
  );
};

export default Header;
