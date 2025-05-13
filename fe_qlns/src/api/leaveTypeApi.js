// src/api/leaveTypeApi.js
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL

export const getAutoCode = () => axios.get(`${API_URL}/api/LoaiPhep/MaLP`);
export const getAllLeaveTypes = () => axios.get(`${API_URL}/api/LoaiPhep/DanhSachLP`);
export const createLeaveType = (data) => axios.post(`${API_URL}/api/LoaiPhep/TaoLP`, data);
export const updateLeaveType = (id, data) => axios.put(`${API_URL}/api/LoaiPhep/CapNhatLP/${id}`, data);
export const deleteLeaveType = (id) => axios.delete(`${API_URL}/api/LoaiPhep/XoaLP/${id}`);
