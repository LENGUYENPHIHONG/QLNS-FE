import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

export const getNewDepartmentCode = () => axios.get(`${API_URL}/api/PhongBan/MaPB`);
export const fetchDepartments = () => axios.get(`${API_URL}/api/PhongBan/DanhSachPB`);
export const createDepartment = (data) => axios.post(`${API_URL}/api/PhongBan/TaoPB`, data);
export const updateDepartment = (data) => axios.put(`${API_URL}/api/PhongBan/CapNhatPB`, data);
export const deleteDepartment = (data) => axios.delete(`${API_URL}/api/PhongBan/DeletePB`, { data });
