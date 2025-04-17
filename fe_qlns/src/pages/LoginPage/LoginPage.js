// src/pages/LoginPage/LoginPage.js
import React, { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Gọi API đăng nhập và cho phép gửi & nhận cookie
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/Auth/dang-nhap`,
        values,
        {
          withCredentials: true // 🔥 Bắt buộc để nhận HttpOnly cookie
        }
      );
      await axios.get(`${process.env.REACT_APP_API_URL}/api/Auth/me`, {
        
        withCredentials: true,
      });
      
      alert("Đăng nhập thành công!");
      //console.log("🔍 Kết quả đăng nhập:", res);
      window.location.href = "/dashboard";
      
    } catch (err) {
      alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 32, boxShadow: "0 0 10px #ccc", borderRadius: 8 }}>
      <Title level={3} style={{ textAlign: "center" }}>Đăng nhập hệ thống</Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Tên đăng nhập" name="tenDangNhap" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mật khẩu" name="matKhau" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}>Đăng nhập</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
