import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL

export const getAllLeaveRequests = (params = {}) =>
  axios.get(`${API_URL}/api/ChiTietNghiPhep/DanhSachNP`, { params });
export const createLeaveRequest = (data) => axios.post(`${API_URL}/api/ChiTietNghiPhep/TaoNP`, data);
export const updateLeaveRequest = (id, data) => axios.put(`${API_URL}/api/ChiTietNghiPhep/CapNhatNP/${id}`, data);
export const deleteLeaveRequest = (id) => axios.delete(`${API_URL}/api/ChiTietNghiPhep/XoaNP/${id}`);
export const approveLeave = (id) => axios.post(`${API_URL}/api/ChiTietNghiPhep/PheDuyetNP/${id}`);
export const rejectLeave = (id) => axios.post(`${API_URL}/api/ChiTietNghiPhep/TuChoiNP/${id}`);
export const searchLeave = (keyword) => axios.get(`${API_URL}/api/ChiTietNghiPhep/TimKiemNP?keyword=${keyword}`);
export const getFilterSummary = () => axios.get(`${API_URL}/api/ChiTietNghiPhep/filter-summary`);
export const filterLeave = (params) => axios.get(`${API_URL}/api/ChiTietNghiPhep/filter`, { params });
export const getLeaveHistory = (params) => axios.get(`${API_URL}/api/ChiTietNghiPhep/LichSuNP`, { params });
export const getYears = () => axios.get(`${API_URL}/api/ChiTietNghiPhep/Nam`);
