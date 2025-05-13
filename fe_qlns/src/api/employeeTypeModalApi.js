import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

export const getAutoCode = () => {
  return axios.get(`${API_URL}/api/LoaiNhanVien/MaLNV`);
};

export const getAllEmployeeTypes = () => {
  return axios.get(`${API_URL}/api/LoaiNhanVien/DanhSachLNV`);
};

export const createEmployeeType = (data) => {
  return axios.post(`${API_URL}/api/LoaiNhanVien/TaoLNV`, data);
};

export const updateEmployeeType = (data) => {
  return axios.put(`${API_URL}/api/LoaiNhanVien/CapNhatLNV`, data);
};

export const deleteEmployeeType = (data) => {
  return axios.delete(`${API_URL}/api/LoaiNhanVien/DeleteLNV`, { data });
};
