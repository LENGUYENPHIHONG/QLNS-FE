// src/components/HeaderComponent.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Button,
  Space,
  Avatar,
  Dropdown,
  Menu,
  message,
} from "antd";
import {
  MailOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import logo from "../../image/qlns.png";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";

const { Header } = Layout;

export default function HeaderComponent({ collapsed, userInfo }) {
  const navigate = useNavigate();
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const handleMenuClick = async ({ key }) => {
    setOpenUserMenu(false);
    if (key === "2") {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/Auth/dang-xuat`,
          null,
          { withCredentials: true }
        );
        message.success("Đăng xuất thành công!");
        window.location.href = "/login";
      } catch (error) {
        message.error("Lỗi khi đăng xuất!");
        console.error("Đăng xuất lỗi:", error);
      }
    }
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<SettingOutlined />}>
        Cài đặt
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
         backgroundColor: "#fff",
        padding: "0 24px",
        height: 65,
        position: "fixed",
        top: 0,
        left: collapsed ? 80 : 220,
        right: 0,
        zIndex: 1001,
        display: "flex",
        alignItems: "center",
        boxShadow: "0 1px 4px rgba(0,21,41,.08)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="Logo" style={{ height: 40, marginRight: 16 }} />
      </div>

      {/* Actions */}
      <Space style={{ marginLeft: "auto", alignItems: "center", gap: 16 }}>

        {/* Notification */}
        <NotificationDropdown />

        {/* User */}
        <Dropdown
          overlay={userMenu}
          trigger={["click"]}
          onOpenChange={(v) => setOpenUserMenu(v)}
          open={openUserMenu}
        >
          <Space style={{ cursor: "pointer" }}>
            <Avatar
              icon={<UserOutlined />}
                size="large"
                style={{ border: "1px solid #0858f7" }}
            />
            <span style={{ fontSize: 18, fontWeight: 600, marginLeft: 8 }}>
              {userInfo?.TenNhanVien || "User"}
            </span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
}
