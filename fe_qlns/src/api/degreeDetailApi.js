import axios from 'axios';

// Base URL cho API
const API_URL = process.env.REACT_APP_API_URL ;

/**
 * Lấy danh sách bằng cấp chi tiết
 * @param {{ manv?: string, malbc?: string, includeDeleted?: boolean, onlyDeleted?: boolean }} params
 */
export const fetchDegreeDetails = (params = {}) => {
  return axios.get(`${API_URL}/api/ChiTietBangCap/DanhSach`, { params });
};

/**
 * Tạo mới bản ghi bằng cấp cho nhân viên
 * @param {{ MANV: string, MALBC: string, TENBC: string, NOICAP: string, NGAYCAP: string }} data
 */
export const createDegreeDetail = (data) => {
  return axios.post(`${API_URL}/api/ChiTietBangCap/Them`, data);
};

/**
 * Cập nhật bản ghi bằng cấp
 * @param {string} id - Id của ChiTietBangCap
 * @param {{ MANV: string, MALBC: string, TENBC: string, NOICAP: string, NGAYCAP: string }} data
 */
export const updateDegreeDetail = (id, data) => {
  return axios.put(`${API_URL}/api/ChiTietBangCap/CapNhat/${id}`, data);
};

/**
 * Xóa mềm bản ghi bằng cấp
 * @param {string} id - Id của ChiTietBangCap
 */
export const deleteDegreeDetail = (id) => {
  return axios.delete(`${API_URL}/api/ChiTietBangCap/Xoa/${id}`);
};

// Lấy danh sách nhân viên để chọn
export const fetchEmployees = () => {
    return axios.get(`${API_URL}/api/NhanVien/DanhSach`);
  };
  
