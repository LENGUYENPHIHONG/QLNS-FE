import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

export const getDepartments = () => axios.get(`${API_URL}/api/PhongBan/DanhSachPB`);
export const getPositions = () => axios.get(`${API_URL}/api/ChucVu/DanhSachCV`);
export const getEducationLevels = () => axios.get(`${API_URL}/api/TrinhDo/DanhSachTD`);
export const getSpecializations = () => axios.get(`${API_URL}/api/ChuyenMon/DanhSachCM`);
export const getEmployeeTypes = () => axios.get(`${API_URL}/api/LoaiNhanVien/DanhSachLNV`);
