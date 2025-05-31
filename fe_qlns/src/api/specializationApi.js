// src/api/specializationApi.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

export const fetchSpecializations = () => axios.get(`/api/ChuyenMon/DanhSachCM`);
export const createSpecialization = (data) => axios.post(`/api/ChuyenMon/TaoCM`, data);
export const updateSpecialization = (data) => axios.put(`/api/ChuyenMon/CapNhatCM`, data);
export const deleteSpecialization = (data) => axios.delete(`/api/ChuyenMon/XoaCM/${data}`);
export const getNewCode = () => axios.get(`/api/ChuyenMon/MaCM`);
