import axios from 'axios';
const BASE_URL = "http://localhost:5077/api/ChiTietNghiPhep";

export const getAllLeaveRequests = () => axios.get(`${BASE_URL}/DanhSachNP`);
export const createLeaveRequest = (data) => axios.post(`${BASE_URL}/TaoNP`, data);
export const updateLeaveRequest = (id, data) => axios.put(`${BASE_URL}/CapNhatNP/${id}`, data);
export const deleteLeaveRequest = (id) => axios.delete(`${BASE_URL}/XoaNP/${id}`);
export const approveLeave = (id) => axios.post(`${BASE_URL}/PheDuyetNP/${id}`);
export const rejectLeave = (id) => axios.post(`${BASE_URL}/TuChoiNP/${id}`);
export const searchLeave = (keyword) => axios.get(`${BASE_URL}/TimKiemNP?keyword=${keyword}`);
export const getFilterSummary = () => axios.get(`${BASE_URL}/filter-summary`);
export const filterLeave = (params) => axios.get(`${BASE_URL}/filter`, { params });
export const getLeaveHistory = (params) => axios.get(`${BASE_URL}/LichSuNP`, { params });
export const getYears = () => axios.get(`${BASE_URL}/Nam`);
