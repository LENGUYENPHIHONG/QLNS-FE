// src/api/specializationApi.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

export const fetchSpecializations = () => axios.get(`${API_URL}/api/ChuyenMon/DanhSachCM`);
export const createSpecialization = (data) => axios.post(`${API_URL}/api/ChuyenMon/TaoCM`, data);
export const updateSpecialization = (data) => axios.put(`${API_URL}/api/ChuyenMon/CapNhatCM`, data);
export const deleteSpecialization = (data) => axios.delete(`${API_URL}/api/ChuyenMon/XoaCM/${data}`);
export const getNewCode = () => axios.get(`${API_URL}/api/ChuyenMon/MaCM`);
