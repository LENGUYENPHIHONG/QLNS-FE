import React, { useState } from "react";
import axios from "axios";
import { message } from "antd"; 
import { Layout, Button, Dropdown, Menu, Space, Avatar } from "antd";
import {
  MenuOutlined,
  MailOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import logo from "../../image/qlns.png"; // logo cục bộ nếu bạn dùng

const { Header } = Layout;

const HeaderComponent = ({  collapsed, userInfo }) => {
  const [open, setOpen] = useState(false);
  console.log("Thông tin user:", userInfo);

  const handleMenuClick = async ({ key }) => {
    setOpen(false);
  
    if (key === "2") {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/Auth/dang-xuat`, null, {
          withCredentials: true,
        });
  
        message.success("Đăng xuất thành công!");
  
        // Reload app về login
        window.location.href = "/login";
      } catch (error) {
        message.error("Lỗi khi đăng xuất!");
        console.error("Đăng xuất lỗi:", error);
      }
    }
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
      {/* Logo nếu có */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="Logo" style={{ height: "40px", marginRight: "10px" }} />
      </div>

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
              {userInfo?.TenNhanVien || "Null"}
            </span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default HeaderComponent;
