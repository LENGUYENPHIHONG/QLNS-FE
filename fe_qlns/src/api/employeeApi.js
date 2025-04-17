// src/api/employeeApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5077/api/NhanVien";

export const getEmployeeDetail = (manv) => 
  axios.get(`http://localhost:5077/api/NhanVien/ThongTinNhanVien/${manv}`);

export const getNewEmployeeCode = () => axios.get(`${BASE_URL}/MaNV`);

export const createEmployee = (data) => axios.post(`${BASE_URL}/TaoNV`, data);

export const fetchEmployees = (page = 1, pageSize = 20) =>
  axios.get(`${BASE_URL}/DanhSachNV`, {
    params: { page, pageSize },
  });

export const deleteEmployee = (manv) => axios.delete(`${BASE_URL}/DeleteNV/${manv}`);
export const updateEmployee = (manv, data) =>
  axios.put(`http://localhost:5077/api/NhanVien/CapNhatNV/${manv}`, data);

