import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL

export const getAllLeaveRequests = (params = {}) =>
  axios.get(`/api/ChiTietNghiPhep/DanhSachNP`, { params });
export const createLeaveRequest = (data) => axios.post(`/api/ChiTietNghiPhep/TaoNP`, data);
export const updateLeaveRequest = (id, data) => axios.put(`/api/ChiTietNghiPhep/CapNhatNP/${id}`, data);
export const deleteLeaveRequest = (id) => axios.delete(`/api/ChiTietNghiPhep/XoaNP/${id}`);
export const approveLeave = (id) => axios.post(`/api/ChiTietNghiPhep/PheDuyetNP/${id}`);
export const rejectLeave = (id) => axios.post(`/api/ChiTietNghiPhep/TuChoiNP/${id}`);
export const searchLeave = (keyword) => axios.get(`/api/ChiTietNghiPhep/TimKiemNP?keyword=${keyword}`);
export const getFilterSummary = () => axios.get(`/api/ChiTietNghiPhep/filter-summary`);
export const filterLeave = (params) => axios.get(`/api/ChiTietNghiPhep/filter`, { params });
export const getLeaveHistory = (params) => axios.get(`/api/ChiTietNghiPhep/LichSuNP`, { params });
export const getYears = () => axios.get(`/api/ChiTietNghiPhep/Nam`);
