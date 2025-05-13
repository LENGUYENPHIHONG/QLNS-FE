import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

// Lấy mã đào tạo mới
export const getNewTrainingCode = () => {
  return axios.get(`${API_URL}/api/KhoaDaoTao/MaDT`);
};

// Lấy danh sách đào tạo (có thể truyền search, page, pageSize)
export const fetchTrainings = (params) => {
  return axios.get(`${API_URL}/api/KhoaDaoTao/DanhSach`, { params });
};

// Tạo đào tạo
export const createTraining = (data) => {
  return axios.post(`${API_URL}/api/KhoaDaoTao/DaoTao`, data);
};

// Cập nhật đào tạo
export const updateTraining = (madt, data) => {
  return axios.put(`${API_URL}/api/KhoaDaoTao/CapNhat/${madt}`, data);
};

// Xóa đào tạo (xóa mềm)
export const deleteTraining = (madt) => {
  return axios.delete(`${API_URL}/api/KhoaDaoTao/Xoa/${madt}`);
};

