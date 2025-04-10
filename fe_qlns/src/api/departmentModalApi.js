import axios from "axios";

const API_BASE = "http://localhost:5077/api/PhongBan";

export const getNewDepartmentCode = () => axios.get(`${API_BASE}/MaPB`);
export const fetchDepartments = () => axios.get(`${API_BASE}/DanhSachPB`);
export const createDepartment = (data) => axios.post(`${API_BASE}/TaoPB`, data);
export const updateDepartment = (data) => axios.put(`${API_BASE}/CapNhatPB`, data);
export const deleteDepartment = (data) => axios.delete(`${API_BASE}/DeletePB`, { data });
