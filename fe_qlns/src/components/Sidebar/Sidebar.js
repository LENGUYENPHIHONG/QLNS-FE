import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  ScheduleOutlined,
  TrophyOutlined,
  SafetyOutlined,
  BookOutlined       
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";



const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);

  // Cập nhật trạng thái active dựa trên đường dẫn hiện tại
  useEffect(() => {
    const path = location.pathname;
    setSelectedKey(path);
    if (path.includes("/danhsachnhanvien") || path.includes("/kynangnhanvien") || path.includes("/dieuchuyenpb") ||path.includes("/taotaikhoannhanvien")) {
      setOpenKeys(["user"]);
    } else if (path.includes("/danhsachhopdong")) {
      setOpenKeys(["contract"]);
    } else if (path.includes("/danhsachbaohiem")) {
      setOpenKeys(["insurance"]);
    }else if (path.includes("/danhsachdaotao")) {
      setOpenKeys(["training"]);
    } else if (path.includes("/dangkinghiphep") || path.includes("/yeardetail")) {
      setOpenKeys(["leave"]);
    } else if (path.includes("/khenthuong") || path.includes("/kyluat")) {
      setOpenKeys(["reward"]);
    } else if (
      path.includes("/phongban") ||
      path.includes("/bangcap") ||
      path.includes("/chucvu") ||
      path.includes("/trinhdo") ||
      path.includes("/loainhanvien") ||
      path.includes("/loainghiphep") ||
      path.includes("/loaihopdong") ||
      path.includes("/loaibaohiem") ||
      path.includes("/loaichuyenmon") ||
      path.includes("/loaikynang") ||
      path.includes("/loaidaotao")
    ) {
      setOpenKeys(["category"]);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onToggle}
      width={220}
      style={{
        backgroundColor: "#fff",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 50,
        zIndex: 1001,
        overflowY: "auto",
        paddingTop: "25px", // Chừa khoảng trống cho header
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "11px",
          textAlign: "center",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {collapsed ? (
          <span style={{ fontSize: "18px", fontWeight: "bold", color: "#000" }}>
            HR
          </span>
        ) : (
          <span style={{ fontSize: "18px", fontWeight: "bold", color: "#000" }}>
            HR 
          </span>
        )}
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        style={{ borderRight: 0 }}
        className="custom-menu" // Thêm class để tùy chỉnh CSS
      >
        {/* Tổng quan */}
        <Menu.Item
          key="/dashboard"
          icon={<DashboardOutlined style={{ fontSize: "24px" }} />}
        >
          <Link to="/dashboard">Tổng quan</Link>
        </Menu.Item>

        {/* Nhân viên */}
        <SubMenu
          key="user"
          icon={<UserOutlined style={{ fontSize: "24px" }} />}
          title="Nhân viên"
        >
          <Menu.Item key="/danhsachnhanvien">
            <Link to="/danhsachnhanvien">Danh sách nhân viên</Link>
          </Menu.Item>
          <Menu.Item key="/kynangnhanvien">
            <Link to="/kynangnhanvien">Kỹ năng nhân viên</Link>
          </Menu.Item>
          <Menu.Item key="/dieuchuyenpb">
            <Link to="/dieuchuyenpb">Điều chuyển phòng ban</Link>
          </Menu.Item>
          <Menu.Item key="/taotaikhoannhanvien">
            <Link to="/taotaikhoannhanvien">Tạo tài khoản </Link>
          </Menu.Item>
        </SubMenu>

        {/* Hợp đồng */}
        <SubMenu
          key="contract"
          icon={<FileTextOutlined style={{ fontSize: "24px" }} />}
          title="Hợp đồng"
        >
          {/* <Menu.Item key="/themhopdong">
            <Link to="/themhopdong">Thêm hợp đồng</Link>
          </Menu.Item> */}
          <Menu.Item key="/danhsachhopdong">
            <Link to="/danhsachhopdong">Danh sách hợp đồng</Link>
          </Menu.Item>
        </SubMenu>
         
         {/* Bảo hiểm */}
        <SubMenu
          key="insurance"
          icon={<SafetyOutlined style={{ fontSize: "24px" }} />}
          title="Bảo hiểm"
        >
          <Menu.Item key="/danhsachbaohiem">
            <Link to="/danhsachbaohiem">Danh sách bảo hiểm</Link>
          </Menu.Item>
        </SubMenu>

         {/* Đào tạo */}
         <SubMenu
          key="training"
          icon={<BookOutlined  style={{ fontSize: "24px" }} />}
          title="Đào tạo"
        >
          <Menu.Item key="/danhsachdaotao">
            <Link to="/danhsachdaotao">Danh sách đào tạo</Link>
          </Menu.Item>
        </SubMenu>

        {/* Nghỉ phép */}
        <SubMenu
          key="leave"
          icon={<ScheduleOutlined style={{ fontSize: "24px" }} />}
          title="Nghỉ phép"
        >
          <Menu.Item key="/dangkinghiphep">
            <Link to="/dangkinghiphep">Đăng ký nghỉ phép</Link>
          </Menu.Item>
          <Menu.Item key="/yeardetail">
            <Link to="/yeardetail">Chi tiết phép</Link>
          </Menu.Item>
        </SubMenu>
        {/* Khen thưởng - Kỷ luật */}
        <SubMenu
          key="reward"
          icon={<TrophyOutlined style={{ fontSize: "24px" }} />}
          title="Khen thưởng"
        >
          <Menu.Item key="/khenthuong">
            <Link to="/khenthuong">Khen thưởng</Link>
          </Menu.Item>
          <Menu.Item key="/kyluat">
            <Link to="/kyluat">Kỷ luật</Link>
          </Menu.Item>
        </SubMenu>

        {/* Danh mục */}
        <SubMenu
          key="category"
          icon={<AppstoreOutlined style={{ fontSize: "24px" }} />}
          title="Danh mục"
        >
          <Menu.Item key="/phongban">
            <Link to="/phongban">Phòng ban</Link>
          </Menu.Item>
          <Menu.Item key="/bangcap">
            <Link to="/bangcap">Bằng cấp</Link>
          </Menu.Item>
          <Menu.Item key="/chucvu">
            <Link to="/chucvu">Chức vụ</Link>
          </Menu.Item>
          <Menu.Item key="/loaichuyenmon">
            <Link to="/loaichuyenmon">Chuyên môn</Link>
          </Menu.Item>
          <Menu.Item key="/trinhdo">
            <Link to="/trinhdo">Trình độ</Link>
          </Menu.Item>
          <Menu.Item key="/loainhanvien">
            <Link to="/loainhanvien">Loại nhân viên</Link>
          </Menu.Item>
          <Menu.Item key="/loainghiphep">
            <Link to="/loainghiphep">Loại nghỉ phép</Link>
          </Menu.Item>
          <Menu.Item key="/loaihopdong">
            <Link to="/loaihopdong">Loại hợp đồng</Link>
          </Menu.Item>
          <Menu.Item key="/loaibaohiem">
            <Link to="/loaibaohiem">Loại bảo hiểm</Link>
          </Menu.Item>
          <Menu.Item key="/loaikynang">
            <Link to="/loaikynang">Loại kỹ năng</Link>
          </Menu.Item>
          <Menu.Item key="/loaidaotao">
            <Link to="/loaidaotao">Loại đào tạo</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Sidebar;