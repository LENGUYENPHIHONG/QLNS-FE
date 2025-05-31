import axios from 'axios';

// Đường dẫn API chính
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5077';

// Lấy mã loại bằng cấp mới
export const getNewDegreeTypeCode = () => {
  return axios.get(`/api/LoaiBangCap/MaLBC`);
};

// Lấy danh sách loại bằng cấp, hỗ trợ query params: search, page, pageSize, includeDeleted, onlyDeleted
export const fetchDegreeTypes = (params = {}) => {
  return axios.get(`/api/LoaiBangCap/DanhSach`, { params });
};

// Tạo mới loại bằng cấp
export const createDegreeType = (data) => {
  return axios.post(`/api/LoaiBangCap/TaoLBC`, data);
};

// Cập nhật loại bằng cấp
export const updateDegreeType = (data) => {
  return axios.put(`/api/LoaiBangCap/CapNhatLBC`, data);
};

// Xóa (soft delete) loại bằng cấp theo mã
export const deleteDegreeType = (code) => {
  return axios.delete(`/api/LoaiBangCap/Xoa/${code}`);
};
