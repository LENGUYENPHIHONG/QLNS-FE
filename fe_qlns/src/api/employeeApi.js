// src/api/employeeApi.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

export const getEmployeeDetail = (manv) => 
  axios.get(`/api/NhanVien/ThongTinNhanVien/${manv}`);

export const getNewEmployeeCode = () => axios.get(`/api/NhanVien/MaNV`);

export const createEmployee = (data) => axios.post(`/api/NhanVien/TaoNV`, data);

export const fetchEmployees = (
  page = 1,
  pageSize = 10,
  search = null,
  status = null,
  showDeleted = false
) => {
  const params = { page, pageSize };
  if (search) params.search = search;
  if (status) params.trangThai = status;
  if (showDeleted) params.showDeleted = showDeleted;
  return axios.get(`/api/NhanVien/DanhSachNV`, { params });
};

export const deleteEmployee = (manv) => 
  axios.delete(`/api/NhanVien/XoaNV/${manv}`);
export const updateEmployee = (manv, data) =>
  axios.put(`/api/NhanVien/CapNhatNV/${manv}`, data);

// 1️⃣ Import danh sách nhân viên từ file .xlsx
export const importEmployees = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`/api/NhanVien/import`, formData);
};

// 2️⃣ Export danh sách nhân viên ra file Excel
//    truyền vào mảng MANVs cần xuất
export const exportEmployees = (manvs) =>
  axios.post(
    `/api/NhanVien/ExportExcel`,
    { MANVs: manvs },
    { responseType: 'blob' } // rất quan trọng để nhận về blob Excel
  );