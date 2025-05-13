// File: EmployeeSkillsApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const fetchEmployees = () =>
  axios.get(`${API_URL}/api/NhanVien/DanhSach`);

export const fetchSkillTypes = () =>
  axios.get(`${API_URL}/api/LoaiKyNang/DanhSachKyNangTheoLoai`);

export const getSkillTypeDetails = (maLKN) =>
  axios.get(`${API_URL}/api/LoaiKyNang/LoaiKyNang/${maLKN}`);

export const addSkillToEmployee = (data) =>
  axios.post(`${API_URL}/api/KyNangNhanVien/ThemKyNangChoNhanVien`, data);

export const fetchAssignedSkills = (maNV) =>
  axios.get(`${API_URL}/api/KyNangNhanVien/DanhSachKyNangNhanVien/${maNV}`);

export const deleteEmployeeSkill = (id) =>
  axios.delete(`${API_URL}/api/KyNangNhanVien/XoaKyNangNhanVien/${id}`);
