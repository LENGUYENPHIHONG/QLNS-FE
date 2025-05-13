import axios from "axios";

const BASE_URL = "http://localhost:5077/api/KhoaDaoTao";

// Lấy mã đào tạo mới
export const getNewTrainingCode = () => {
  return axios.get(`${BASE_URL}/MaDT`);
};

// Lấy danh sách đào tạo (có thể truyền search, page, pageSize)
export const fetchTrainings = (params) => {
  return axios.get(`${BASE_URL}/DanhSach`, { params });
};

// Tạo đào tạo
export const createTraining = (data) => {
  return axios.post(`${BASE_URL}/DaoTao`, data);
};

// Cập nhật đào tạo
export const updateTraining = (madt, data) => {
  return axios.put(`${BASE_URL}/CapNhat/${madt}`, data);
};

// Xóa đào tạo (xóa mềm)
export const deleteTraining = (madt) => {
  return axios.delete(`${BASE_URL}/Xoa/${madt}`);
};

