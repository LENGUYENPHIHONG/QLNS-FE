import axios from "axios";

const BASE_URL = "http://localhost:5077/api";

export const getDepartments = () => axios.get(`${BASE_URL}/PhongBan/DanhSachPB`);
export const getPositions = () => axios.get(`${BASE_URL}/ChucVu/DanhSachCV`);
export const getEducationLevels = () => axios.get(`${BASE_URL}/TrinhDo/DanhSachTD`);
export const getSpecializations = () => axios.get(`${BASE_URL}/ChuyenMon/DanhSachCM`);
export const getEmployeeTypes = () => axios.get(`${BASE_URL}/LoaiNhanVien/DanhSachLNV`);
