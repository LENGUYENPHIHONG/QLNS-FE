// src/App.js
import React, { useState, useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useLocation,
} from "react-router-dom";
import { Layout } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "antd/dist/reset.css";
import "./styles/reset.css";
import "./App.css";
import axios from "axios";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Component layout
import Header from "./components/Header/header";
import Sidebar from "./components/Sidebar/Sidebar";
// Pages
import LoginPage from "./pages/LoginPage/LoginPage.js";
import Dashboard from "./pages/DashboardPage/Dashboard";
import EmployeeListPage from "./pages/EmployeePage/EmployeeListPage";
import EmployeeSkillsPage from "./pages/EmployeePage/EmployeeSkillsPage";
import PositionManagement from "./components/Category/PositionManagement/PositionManagement";
import DepartmentManagement from "./components/Category/Departments/departments";
import LeaveTypeManagement from "./components/Category/LeaveTypeManagement/LeaveTypeManagement";
import DegreeManagement from "./components/Category/DegreeManagement/DegreeManagement";
import TrainingTypeManagement from "./components/Category/TrainingTypeManagement/TrainingTypeManagement";
import ContractTypeManagement from "./components/Category/ContractTypeManagement/ContractTypeManagement";
import SpecializationManagement from "./components/Category/SpecializationManagement/SpecializationManagement";
import SkillsManagement from "./components/Category/SkillsManagement/SkillsManagement";
import ContractManagement from "./pages/Contract/Contract";
import EmployeeTrainingManagement from "./pages/EmployeeTrainingManagement/EmployeeTrainingManagement";
import KhenThuongPage from "./pages/KhenThuongKiLuat/KhenThuongPage.js";
import DepartmentTransferPage from "./pages/EmployeePage/DepartmentTransferPage.js";
import KyLuatPage from "./pages/KhenThuongKiLuat/KyLuatPage.js";
import EmployeeAccountPage from "./pages/EmployeePage/EmployeeAccountPage.js";
import InsuranceManagement from "./pages/InsurancePage/InsurancePage";
import InsuranceTypeManagement from "./components/Category/InsuranceTypeManagement/InsuranceTypeManagement";
import LeaveRequestManagement from "./pages/Leave/LeaveManagement";
import LeaveYearDetail from "./pages/Leave/LeaveYearDetail";
import EducationLevelManagement from "./components/Category/EducationLevel/EducationLevelManagement";
import EmployeeTypeManagement from "./components/Category/EmployeeType/EmployeeTypeManagement";

axios.defaults.withCredentials = true;

const { Content } = Layout;

// Component bọc Layout + Routes
const AppLayout = ({ collapsed, toggleSidebar }) => {
    const location = useLocation();
    const [authenticated, setAuthenticated] = useState(null); // null = loading
    const [userInfo, setUserInfo] = useState(null);

    // Chưa đăng nhập → redirect login
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/Auth/me`, {
                    withCredentials: true,
                });
                setAuthenticated(true);
                setUserInfo(res.data);

                console.log("🔍 Kết quả đăng nhập:", res);
            } catch (err) {
                setAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    // Hiển thị loading hoặc trắng khi đang kiểm tra login
    if (authenticated === null) return null;

    if (!authenticated && location.pathname !== "/login") {
        return <Navigate to="/login" replace />;
    }

    if (authenticated && location.pathname === "/login") {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            <Layout style={{ minHeight: "100vh" }}>
                {/* Sidebar chỉ hiển thị khi đã đăng nhập */}
                {authenticated && (
                    <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
                )}

                <Layout
                    style={{
                        marginLeft: authenticated ? (collapsed ? 80 : 220) : 0,
                        transition: "margin-left 0.2s",
                    }}
                >
                    {/* Header cũng chỉ hiển thị khi đã đăng nhập */}
                    {authenticated && (
                        <Header
                            collapsed={collapsed}
                            onToggleSidebar={toggleSidebar}
                            userInfo={userInfo}
                        />
                    )}
                    <Content
                        style={{
                            marginTop: authenticated ? 65 : 0,
                            padding: authenticated ? "20px" : 0,
                            backgroundColor: "#e9f0f7",
                            minHeight: "calc(100vh - 65px)",
                        }}
                    >
                        <Routes>
                            {/* Route đăng nhập */}
                            <Route path="/login" element={<LoginPage />} />
                            {/* Routes sau khi đã đăng nhập */}
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route
                                path="/danhsachnhanvien"
                                element={<EmployeeListPage />}
                            />
                            <Route
                                path="/kynangnhanvien"
                                element={<EmployeeSkillsPage />}
                            />
                            <Route
                                path="/taotaikhoannhanvien"
                                element={<EmployeeAccountPage />}
                            />
                            <Route
                                path="/chucvu"
                                element={<PositionManagement />}
                            />
                            <Route
                            
                                path="/danhsachhopdong"
                                element={<ContractManagement />}
                            />
                            <Route
                                path="/dieuchuyenpb"
                                element={<DepartmentTransferPage />}
                            />
                            <Route
                                path="/danhsachbaohiem"
                                element={<InsuranceManagement />}
                            />
                            <Route
                                path="/dangkinghiphep"
                                element={<LeaveRequestManagement />}
                            />
                            <Route
                                path="/danhsachdaotao"
                                element={<EmployeeTrainingManagement />}
                            />
                            <Route
                                path="/yeardetail"
                                element={<LeaveYearDetail />}
                            />
                            <Route
                                path="/khenthuong"
                                element={<KhenThuongPage />}
                            />
                            <Route path="/kyluat" element={<KyLuatPage />} />
                            <Route
                                path="/phongban"
                                element={<DepartmentManagement />}
                            />
                            <Route
                                path="/trinhdo"
                                element={<EducationLevelManagement />}
                            />
                            <Route
                                path="/bangcap"
                                element={<DegreeManagement />}
                            />
                            <Route
                                path="/loainhanvien"
                                element={<EmployeeTypeManagement />}
                            />
                            <Route
                                path="/loainghiphep"
                                element={<LeaveTypeManagement />}
                            />
                            <Route
                                path="/loaihopdong"
                                element={<ContractTypeManagement />}
                            />
                            <Route
                                path="/loaibaohiem"
                                element={<InsuranceTypeManagement />}
                            />
                            <Route
                                path="/loaichuyenmon"
                                element={<SpecializationManagement />}
                            />{" "}
                            <Route
                                path="/loaikynang"
                                element={<SkillsManagement />}
                            />
                            <Route
                                path="/loaidaotao"
                                element={<TrainingTypeManagement />}
                            />
                            {/* Mặc định redirect */}
                            <Route
                                path="*"
                                element={<Navigate to="/dashboard" />}
                            />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnHover
                draggable
            />
        </>
    );
};

export default function App() {
    const [collapsed, setCollapsed] = useState(false);
    const toggleSidebar = () => setCollapsed(!collapsed);

    return (
        <BrowserRouter>
            <AppLayout collapsed={collapsed} toggleSidebar={toggleSidebar} />
        </BrowserRouter>
    );
}
