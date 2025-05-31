import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

export const getNewDepartmentCode = () => axios.get(`/api/PhongBan/MaPB`);
export const fetchDepartments = () => axios.get(`/api/PhongBan/DanhSachPB`);
export const createDepartment = (data) => axios.post(`/api/PhongBan/TaoPB`, data);
export const updateDepartment = (data) => axios.put(`/api/PhongBan/CapNhatPB`, data);
export const deleteDepartment = (data) => axios.delete(`/api/PhongBan/DeletePB`, { data });
