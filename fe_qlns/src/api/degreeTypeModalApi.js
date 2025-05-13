import axios from 'axios';

// Đường dẫn API chính
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5077';

// Lấy mã loại bằng cấp mới
export const getNewDegreeTypeCode = () => {
  return axios.get(`${API_URL}/api/LoaiBangCap/MaLBC`);
};

// Lấy danh sách loại bằng cấp, hỗ trợ query params: search, page, pageSize, includeDeleted, onlyDeleted
export const fetchDegreeTypes = (params = {}) => {
  return axios.get(`${API_URL}/api/LoaiBangCap/DanhSach`, { params });
};

// Tạo mới loại bằng cấp
export const createDegreeType = (data) => {
  return axios.post(`${API_URL}/api/LoaiBangCap/TaoLBC`, data);
};

// Cập nhật loại bằng cấp
export const updateDegreeType = (data) => {
  return axios.put(`${API_URL}/api/LoaiBangCap/CapNhatLBC`, data);
};

// Xóa (soft delete) loại bằng cấp theo mã
export const deleteDegreeType = (code) => {
  return axios.delete(`${API_URL}/api/LoaiBangCap/Xoa/${code}`);
};
