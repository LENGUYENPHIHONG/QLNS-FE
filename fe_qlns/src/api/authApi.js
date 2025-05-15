import axios from "axios";

// Đường dẫn cơ bản đến AuthController
const API_URL = process.env.REACT_APP_API_URL

/**
 * Tạo tài khoản mới cho nhân viên
 * @param {{ tenDangNhap: string, matKhau: string, maNV?: string, email?: string, vaiTroId: number }} data
 */
export const createAccount = (data) => {
  return axios.post(`${API_URL}/api/Auth/tao-tai-khoan`, data);
};

/**
 * Lấy danh sách vai trò
 */
export const getRoles = () => {
  return axios.get(`${API_URL}/api/Auth/danh-sach-vai-tro`);
};

/**
 * Đăng nhập
 * @param {{ tenDangNhap: string, matKhau: string }} credentials
 */
export const login = (credentials) => {
  return axios.post(`${API_URL}/Auth/dang-nhap`, credentials);
};

/**
 * Refresh token
 * @param {{ refreshToken: string }} data
 */
export const refreshToken = (data) => {
  return axios.post(`${API_URL}/Auth/refresh-token`, data);
};

/**
 * Đăng xuất
 */
export const logout = () => {
  return axios.post(`${API_URL}/Auth/dang-xuat`);
};

/**
 * Lấy danh sách tất cả tài khoản
 */
export const getAccounts = (isDeleted) =>
  axios.get(`${API_URL}/api/Auth/danh-sach-tai-khoan`, { params: { isNhanVienDaXoa: isDeleted } });

/**
 * Cập nhật tài khoản
 * @param {{ Id: number, tenDangNhap?: string, email?: string, vaiTroIds?: number[] }} data
 */
export const updateAccount = (data) => {
  return axios.put(`${API_URL}/api/Auth/cap-nhat-tai-khoan`, data);
};

/**
 * Xóa tài khoản theo ID
 * @param {number} id
 */
export const deleteAccount = (id) => {
  return axios.delete(`${API_URL}/api/Auth/xoa-tai-khoan/${id}`);
};
