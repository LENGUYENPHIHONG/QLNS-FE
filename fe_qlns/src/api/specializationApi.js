// src/api/specializationApi.js
import axios from "axios";

const API = "http://localhost:5077/api/ChuyenMon";

export const fetchSpecializations = () => axios.get(`${API}/DanhSachCM`);
export const createSpecialization = (data) => axios.post(`${API}/TaoCM`, data);
export const updateSpecialization = (data) => axios.put(`${API}/CapNhatCM`, data);
export const deleteSpecialization = (data) => axios.delete(`${API}/DeleteCM`, { data });
export const getNewCode = () => axios.get(`${API}/MaCM`);
