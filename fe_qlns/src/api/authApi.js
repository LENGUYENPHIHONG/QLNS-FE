import axios from "axios";

// Đường dẫn cơ bản đến AuthController
const BASE_URL = "http://localhost:5077/api/Auth";

/**
 * Tạo tài khoản mới cho nhân viên
 * @param {{ tenDangNhap: string, matKhau: string, maNV?: string, email?: string, vaiTroId: number }} data
 */
export const createAccount = (data) => {
  return axios.post(`${BASE_URL}/tao-tai-khoan`, data);
};

/**
 * Lấy danh sách vai trò
 */
export const getRoles = () => {
  return axios.get(`${BASE_URL}/danh-sach-vai-tro`);
};

/**
 * Đăng nhập
 * @param {{ tenDangNhap: string, matKhau: string }} credentials
 */
export const login = (credentials) => {
  return axios.post(`${BASE_URL}/dang-nhap`, credentials);
};

/**
 * Refresh token
 * @param {{ refreshToken: string }} data
 */
export const refreshToken = (data) => {
  return axios.post(`${BASE_URL}/refresh-token`, data);
};

/**
 * Đăng xuất
 */
export const logout = () => {
  return axios.post(`${BASE_URL}/dang-xuat`);
};

/**
 * Lấy danh sách tất cả tài khoản
 */
export const getAccounts = () => {
  return axios.get(`${BASE_URL}/danh-sach-tai-khoan`);
};

/**
 * Cập nhật tài khoản
 * @param {{ Id: number, tenDangNhap?: string, email?: string, vaiTroIds?: number[] }} data
 */
export const updateAccount = (data) => {
  return axios.put(`${BASE_URL}/cap-nhat-tai-khoan`, data);
};

/**
 * Xóa tài khoản theo ID
 * @param {number} id
 */
export const deleteAccount = (id) => {
  return axios.delete(`${BASE_URL}/xoa-tai-khoan/${id}`);
};
