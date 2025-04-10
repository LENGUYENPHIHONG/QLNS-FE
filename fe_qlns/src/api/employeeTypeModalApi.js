import axios from "axios";

const BASE_URL = "http://localhost:5077/api/LoaiNhanVien"; // 🔁 Thay 'port' bằng cổng API thực tế

export const getAutoCode = () => {
  return axios.get(`${BASE_URL}/MaLNV`);
};

export const getAllEmployeeTypes = () => {
  return axios.get(`${BASE_URL}/DanhSachLNV`);
};

export const createEmployeeType = (data) => {
  return axios.post(`${BASE_URL}/TaoLNV`, data);
};

export const updateEmployeeType = (data) => {
  return axios.put(`${BASE_URL}/CapNhatLNV`, data);
};

export const deleteEmployeeType = (data) => {
  return axios.delete(`${BASE_URL}/DeleteLNV`, { data });
};
