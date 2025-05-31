// src/api/departmentTransferApi.js

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Lấy danh sách yêu cầu điều chuyển
export const getTransferRequests = () => axios.get(`/api/ChiTietPhongBan`);

// Gửi yêu cầu điều chuyển mới
export const submitTransferRequest = (data) => axios.post(`/api/ChiTietPhongBan/ChuyenPhongBan`, data);

// Phê duyệt yêu cầu điều chuyển (truyền id trong URL)
export const approveTransferRequest = (id) => axios.post(`/api/ChiTietPhongBan/PheDuyetChuyenPB/${id}`);

// Từ chối yêu cầu điều chuyển
export const rejectTransferRequest = (data) => axios.post(`/api/ChiTietPhongBan/TuChoiDieuChuyenPB`, data);

// Xóa yêu cầu điều chuyển (truyền id trong URL)
export const deleteTransferRequest = (id) => axios.delete(`/api/ChiTietPhongBan/${id}`);
export const getEmployeeDetail = (manv) =>
  axios.get(`/api/NhanVien/ThongTinNhanVien/${manv}`);