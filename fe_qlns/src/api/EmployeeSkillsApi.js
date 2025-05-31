// File: EmployeeSkillsApi.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const fetchEmployees = () =>
  axios.get(`/api/NhanVien/DanhSach`);

export const fetchSkillTypes = () =>
  axios.get(`/api/LoaiKyNang/DanhSachKyNangTheoLoai`);

export const getSkillTypeDetails = (maLKN) =>
  axios.get(`/api/LoaiKyNang/LoaiKyNang/${maLKN}`);

export const addSkillToEmployee = (data) =>
  axios.post(`/api/KyNangNhanVien/ThemKyNangChoNhanVien`, data);

export const fetchAssignedSkills = (maNV) =>
  axios.get(`/api/KyNangNhanVien/DanhSachKyNangNhanVien/${maNV}`);

export const deleteEmployeeSkill = (id) =>
  axios.delete(`/api/KyNangNhanVien/XoaKyNangNhanVien/${id}`);
