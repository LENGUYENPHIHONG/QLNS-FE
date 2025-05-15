// src/api/employeeApi.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

export const getEmployeeDetail = (manv) => 
  axios.get(`${API_URL}/api/NhanVien/ThongTinNhanVien/${manv}`);

export const getNewEmployeeCode = () => axios.get(`${API_URL}/api/NhanVien/MaNV`);

export const createEmployee = (data) => axios.post(`${API_URL}/api/NhanVien/TaoNV`, data);

export const fetchEmployees = (page = 1, pageSize = 20) =>
  axios.get(`${API_URL}/api/NhanVien/DanhSachNV`, {
    params: { page, pageSize },
  });

export const deleteEmployee = (manv) => axios.delete(`${API_URL}/api/NhanVien/DeleteNV/${manv}`);
export const updateEmployee = (manv, data) =>
  axios.put(`${API_URL}/api/NhanVien/CapNhatNV/${manv}`, data);

