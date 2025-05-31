import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

export const getAutoCode = () => {
  return axios.get(`/api/LoaiNhanVien/MaLNV`);
};

export const getAllEmployeeTypes = () => {
  return axios.get(`/api/LoaiNhanVien/DanhSachLNV`);
};

export const createEmployeeType = (data) => {
  return axios.post(`/api/LoaiNhanVien/TaoLNV`, data);
};

export const updateEmployeeType = (data) => {
  return axios.put(`/api/LoaiNhanVien/CapNhatLNV`, data);
};

export const deleteEmployeeType = (data) => {
  return axios.delete(`/api/LoaiNhanVien/DeleteLNV`, { data });
};
