// src/api/employeeTrainingApi.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

// Lấy danh sách đào tạo nhân viên
export const fetchEmployeeTrainings = (params = {}) => {
  return axios.get(`/api/DaoTaoNhanVien/DanhSachDaoTao`, { params });
};

// Tạo đào tạo nhân viên
export const createEmployeeTraining = (data) => {
  return axios.post(`/api/DaoTaoNhanVien/LuuDaoTao`, data);
};

// Cập nhật đào tạo nhân viên
export const updateEmployeeTraining = (data) => {
  return axios.put(`/api/DaoTaoNhanVien/CapNhatDaoTao`, data);
};

// Xóa đào tạo nhân viên (soft-delete)
export const deleteEmployeeTraining = (id) => {
  return axios.delete(`/api/DaoTaoNhanVien/XoaDaoTao/${id}`);
};

// Upload file PDF đào tạo nhân viên
export const uploadTrainingFile = (id, formData) => {
  return axios.post(
    `/api/DaoTaoNhanVien/UploadFile/${id}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};

// Lấy danh sách nhân viên để chọn
export const fetchEmployees = () => {
  return axios.get(`/api/NhanVien/DanhSach`);
};

// Lấy danh sách khóa đào tạo
export const fetchTrainingTypes = () => {
  return axios.get(`/api/KhoaDaoTao/DanhSach`);
};
