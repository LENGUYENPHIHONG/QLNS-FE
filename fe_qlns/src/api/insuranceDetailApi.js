// File: src/api/insuranceDetailApi.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// GET with filters & paging
export const fetchInsurances = ({
  page = 1,
  pageSize = 10,
  maNhanVien,
  maLoaiBaoHiem,
  trangThai,
  search
} = {}) =>
  axios.get(`${API_URL}/api/ChiTietBaoHiem/DanhSachBH`, {
    params: { page, pageSize, maNhanVien, maLoaiBaoHiem, trangThai, search }
  });

// CREATE
export const createInsurance = data =>
  axios.post(`${API_URL}/api/ChiTietBaoHiem/TaoBH`, data);

// UPDATE
export const updateInsurance = (id, data) =>
  axios.put(`${API_URL}/api/ChiTietBaoHiem/CapNhatBH/${id}`, data);

// DELETE expired
export const deleteInsurance = id =>
  axios.delete(`${API_URL}/api/ChiTietBaoHiem/XoaBH/${id}`);

// RENEW
export const renewInsurances = payload =>
  axios.post(`${API_URL}/api/ChiTietBaoHiem/GiaHanBaoHiem`, payload);

// LOOKUPS
export const getEmployees = () =>
  axios.get(`${API_URL}/api/NhanVien/DanhSachNV`);

export const getInsuranceTypes = () =>
  axios.get(`${API_URL}/api/LoaiBaoHiem/DanhSachLBH`);
