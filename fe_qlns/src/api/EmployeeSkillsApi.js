// File: EmployeeSkillsApi.js
import axios from 'axios';

const API_BASE = 'http://localhost:5077';

export const fetchEmployees = () =>
  axios.get(`${API_BASE}/api/NhanVien/DanhSach`);

export const fetchSkillTypes = () =>
  axios.get(`${API_BASE}/api/LoaiKyNang/DanhSachKyNangTheoLoai`);

export const getSkillTypeDetails = (maLKN) =>
  axios.get(`${API_BASE}/api/LoaiKyNang/LoaiKyNang/${maLKN}`);

export const addSkillToEmployee = (data) =>
  axios.post(`${API_BASE}/api/KyNangNhanVien/ThemKyNangChoNhanVien`, data);

export const fetchAssignedSkills = (maNV) =>
  axios.get(`${API_BASE}/api/KyNangNhanVien/DanhSachKyNangNhanVien/${maNV}`);

export const deleteEmployeeSkill = (id) =>
  axios.delete(`${API_BASE}/api/KyNangNhanVien/XoaKyNangNhanVien/${id}`);
