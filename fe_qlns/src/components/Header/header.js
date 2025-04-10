import React, { useState } from "react";
import { Layout, Button, Dropdown, Menu, Space, Avatar } from "antd";
import { Link } from "react-router-dom";
import {
  MenuOutlined,
  MailOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

// Import ảnh logo từ file cục bộ
import logo from "../../image/qlns.png"; // Sử dụng logo đã có, hoặc thay bằng header-logo.png nếu muốn

const { Header } = Layout;

const HeaderComponent = ({ onToggleSidebar, collapsed }) => {
  const [open, setOpen] = useState(false);

  const handleMenuClick = () => {
    setOpen(false);
  };

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          key: "1",
          label: "Cài đặt",
          icon: <SettingOutlined />,
        },
        {
          key: "2",
          label: "Đăng xuất",
          icon: <LogoutOutlined />,
        },
      ]}
    />
  );

  return (
    <Header
      style={{
        backgroundColor: "#ffffffe6",
        backdropFilter: "blur(5px)",
        padding: "0 20px",
        height: "65px",
        position: "fixed",
        top: 0,
        left: collapsed ? 80 : 220,
        right: 0,
        zIndex: 1001,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Left section: Logo and Toggle button */}
     
      {/* Right section: Email, Bell, User */}
      <Space style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
        <Button
          type="text"
          icon={<MailOutlined style={{ fontSize: "20px", color: "#000" }} />}
          style={{
            width: "40px",
            height: "40px",
            background: "#f0f5ff",
            borderRadius: "50%",
          }}
        />
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: "20px", color: "#000" }} />}
          style={{
            width: "40px",
            height: "40px",
            background: "#f0f5ff",
            borderRadius: "50%",
          }}
        />
        <Dropdown overlay={menu} trigger={["click"]} onOpenChange={(visible) => setOpen(visible)} open={open}>
          <Space style={{ cursor: "pointer" }}>
            <Avatar
              src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
              size="large"
              style={{ border: "1px solid #0858f7" }}
            />
            <span style={{ fontSize: "18px", fontWeight: "600", color: "#000" }}>
              Phi Hồng
            </span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default HeaderComponent;