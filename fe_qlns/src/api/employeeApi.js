// src/api/employeeApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5077/api/NhanVien";

export const getEmployeeDetail = (manv) =>
  axios.get(`http://localhost:5077/api/NhanVien/ThongTinNhanVien/${manv}`);

export const getNewEmployeeCode = () => axios.get(`${BASE_URL}/MaNV`);

export const createEmployee = (data) => axios.post(`${BASE_URL}/TaoNV`, data);

export const fetchEmployees = () => axios.get(`${BASE_URL}/DanhSachNV`);

export const deleteEmployee = (manv) => axios.delete(`${BASE_URL}/DeleteNV/${manv}`);
