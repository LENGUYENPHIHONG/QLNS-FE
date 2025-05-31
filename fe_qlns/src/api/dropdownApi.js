import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

export const getDepartments = () => axios.get(`/api/PhongBan/DanhSachPB`);
export const getPositions = () => axios.get(`/api/ChucVu/DanhSachCV`);
export const getEducationLevels = () => axios.get(`/api/TrinhDo/DanhSachTD`);
export const getSpecializations = () => axios.get(`/api/ChuyenMon/DanhSachCM`);
export const getEmployeeTypes = () => axios.get(`/api/LoaiNhanVien/DanhSachLNV`);
