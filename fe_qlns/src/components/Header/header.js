// src/components/HeaderComponent.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd"; 
import { Layout, Button, Dropdown, Menu, Space, Avatar, Badge, Spin } from "antd";
import {
  MenuOutlined,
  MailOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import logo from "../../image/qlns.png"; // logo cục bộ nếu bạn dùng

const { Header } = Layout;

const HeaderComponent = ({ collapsed, userInfo }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // console.log("Thông tin user:", userInfo);

  // 1. Load notifications chưa đọc
  const loadNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ThongBao/unread`,
        { withCredentials: true }
      );
      //console.log("Thông báo chưa đọc:", data.Items);
      setNotifications(data.Items);
      //console.log("Số thông báo chưa đọc:", notifications);
    } catch (err) {
      console.error("Lỗi fetch thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
    // nếu cần auto-refresh định kỳ thì dùng setInterval ở đây
  }, []);

  // 2. Click vào từng thông báo: đánh dấu đã đọc và điều hướng
  const handleNotificationClick = async (item) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/ThongBao/${item.MaThongBao}/read`,
        null,
        { withCredentials: true }
      );
      // remove khỏi danh sách
      setNotifications((prev) =>
        prev.filter(n => n.MaThongBao !== item.MaThongBao)
      );
      // điều hướng nếu có
      if (item.bang_lien_quan && item.id_lien_quan) {
        window.location.href = `/${item.bang_lien_quan}/${item.id_lien_quan}`;
      }
    } catch (err) {
      console.error("Đánh dấu thông báo đã đọc thất bại:", err);
    }
  };

  // 3. Menu dropdown thông báo
  const notificationMenu = (
  <Menu>
    {loading
      ? <Menu.Item key="loading"><Spin size="small" /></Menu.Item>
      : notifications.length === 0
        ? <Menu.Item key="empty">Không có thông báo mới</Menu.Item>
        : notifications.map(item => (
            <Menu.Item
              key={item.MaThongBao}
              onClick={() => handleNotificationClick(item)}
            >
              <div style={{ maxWidth: 250, whiteSpace: "normal" }}>
                <strong>{item.TieuDe}</strong>
                <div style={{ fontSize: 12, color: "#666", margin: 4 }}>
                  {item.NoiDung}
                </div>
                <div style={{ fontSize: 10, color: "#999", textAlign: "right" }}>
                  { item.ThoiGianTao
                    ? new Date(item.ThoiGianTao).toLocaleString("vi-VN")
                    : "" }
                </div>
              </div>
            </Menu.Item>
          ))
    }
  </Menu>
);
  // menu user (unchanged)
  const handleMenuClick = async ({ key }) => {
    setOpen(false);
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
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={logo}
          alt="Logo"
          style={{ height: "40px", marginRight: "10px" }}
        />
      </div>

      <Space
        style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
      >
        {/* Mail */}
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

        {/* Notification */}
        <Dropdown
          overlay={notificationMenu}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Badge
            count={notifications.length}
            overflowCount={99}
            offset={[0, 0]}
          >
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
          </Badge>
        </Dropdown>

        {/* User avatar + name */}
        <Dropdown
          overlay={userMenu}
          trigger={["click"]}
          onOpenChange={(visible) => setOpen(visible)}
          open={open}
        >
          <Space style={{ cursor: "pointer" }}>
            <Avatar
              src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
              size="large"
              style={{ border: "1px solid #0858f7" }}
            />
            <span style={{ fontSize: "18px", fontWeight: "600", color: "#000" }}>
              {userInfo?.TenNhanVien || "Null"}
            </span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default HeaderComponent;
