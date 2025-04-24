// src/api/leaveTypeApi.js
import axios from "axios";
const BASE_URL = "http://localhost:5077/api/LoaiPhep";

export const getAutoCode = () => axios.get(`${BASE_URL}/MaLP`);
export const getAllLeaveTypes = () => axios.get(`${BASE_URL}/DanhSachLP`);
export const createLeaveType = (data) => axios.post(`${BASE_URL}/TaoLP`, data);
export const updateLeaveType = (id, data) => axios.put(`${BASE_URL}/CapNhatLP/${id}`, data);
export const deleteLeaveType = (id) => axios.delete(`${BASE_URL}/XoaLP/${id}`);
