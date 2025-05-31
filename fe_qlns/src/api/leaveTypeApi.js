// src/api/leaveTypeApi.js
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL

export const getAutoCode = () => axios.get(`/api/LoaiPhep/MaLP`);
export const getAllLeaveTypes = () => axios.get(`/api/LoaiPhep/DanhSachLP`);
export const createLeaveType = (data) => axios.post(`/api/LoaiPhep/TaoLP`, data);
export const updateLeaveType = (id, data) => axios.put(`/api/LoaiPhep/CapNhatLP/${id}`, data);
export const deleteLeaveType = (id) => axios.delete(`/api/LoaiPhep/XoaLP/${id}`);
