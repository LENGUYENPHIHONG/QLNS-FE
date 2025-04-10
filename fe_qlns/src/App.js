import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/reset.css";
import "antd/dist/reset.css";
import "./App.css";
import Dashboard from "./pages/DashboardPage/Dashboard";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import EmployeeListPage from "./pages/EmployeePage/EmployeeListPage";
import WorkScheduleList from "./pages/WorkScheduleList/Schedule";
import WorkScheduleDetail from "./pages/WorkScheduleDetail/WorkScheduleDetail";
import PositionManagement from "./components/Category/PositionManagement/PositionManagement";
import DepartmentManagement from "./components/Category/Departments/departments";
import LeaveTypeManagement from "./components/Category/LeaveTypeManagement/LeaveTypeManagement";
import DegreeManagement from "./components/Category/DegreeManagement/DegreeManagement";
import ContractTypeManagement from "./components/Category/ContractTypeManagement/ContractTypeManagement";
import SpecializationManagement from "./components/Category/SpecializationManagement/SpecializationManagement";
import ContractManagement from "./pages/Contract/Contract";
import LeaveRequestManagement from "./pages/Leave/LeaveManagement";
import LeaveHistory from "./pages/Leave/LeaveHistory";
import EducationLevelManagement from "./components/Category/EducationLevel/EducationLevelManagement";
import EmployeeTypeManagement from "./components/Category/EmployeeType/EmployeeTypeManagement";

const { Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

        {/* Nội dung chính */}
        <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: "margin-left 0.2s" }}>
          {/* Header */}
          <Header onToggleSidebar={toggleSidebar} collapsed={collapsed} />

          {/* Content */}
          <Content
            style={{
              marginTop: 65,
              padding: "20px",
              backgroundColor: "#e9f0f7",
              minHeight: "calc(100vh - 65px)",
            }}
          >
            <Routes>
              <Route path="/" exact element={<Dashboard />} />
              <Route path="/dashboard" exact element={<Dashboard />} />
              <Route path="/danhsachnhanvien" exact element={<EmployeeListPage />} />
              <Route path="/chucvu" exact element={<PositionManagement />} />
              <Route path="/danhsachhopdong" exact element={<ContractManagement />} />
              <Route path="/dangkinghiphep" exact element={<LeaveRequestManagement />} />
              <Route path="/lichsunghiphep" exact element={<LeaveHistory />} />
              <Route path="/phongban" exact element={<DepartmentManagement />} />
              <Route path="/trinhdo" exact element={<EducationLevelManagement />} />
              <Route path="/bangcap" exact element={<DegreeManagement />} />
              <Route path="/loainhanvien" exact element={<EmployeeTypeManagement />} />
              <Route path="/loainghiphep" exact element={<LeaveTypeManagement />} />
              <Route path="/lichlamviec" exact element={<WorkScheduleList />} />
              <Route path="/loaihopdong" exact element={<ContractTypeManagement />} />
              <Route path="/loaichuyenmon" exact element={<SpecializationManagement />} />
              <Route path="/lichlamviec/id" exact element={<WorkScheduleDetail />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;