// src/api/employeeTrainingApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5077/api/DaoTaoNhanVien";

// Lấy danh sách đào tạo nhân viên
export const fetchEmployeeTrainings = (params = {}) => {
  return axios.get(`${BASE_URL}/DanhSachDaoTao`, { params });
};

// Tạo đào tạo nhân viên
export const createEmployeeTraining = (data) => {
  return axios.post(`${BASE_URL}/LuuDaoTao`, data);
};

// Cập nhật đào tạo nhân viên
export const updateEmployeeTraining = (data) => {
  return axios.put(`${BASE_URL}/CapNhatDaoTao`, data);
};

// Xóa đào tạo nhân viên (soft-delete)
export const deleteEmployeeTraining = (id) => {
  return axios.delete(`${BASE_URL}/XoaDaoTao/${id}`);
};

// Upload file PDF đào tạo nhân viên
export const uploadTrainingFile = (formData) => {
  return axios.post(`${BASE_URL}/UploadFile`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Lấy danh sách nhân viên để chọn
export const fetchEmployees = () => {
  return axios.get("http://localhost:5077/api/NhanVien/DanhSach");
};

// Lấy danh sách khóa đào tạo
export const fetchTrainingTypes = () => {
  return axios.get("http://localhost:5077/api/KhoaDaoTao/DanhSach");
};
