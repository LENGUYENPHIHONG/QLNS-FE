import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

// GET all
export const fetchInsurances = () =>
  axios.get(`${API_URL}/api/ChiTietBaoHiem/DanhSachBH`);

// GET single detail
export const fetchInsuranceById = (id) =>
  axios.get(`${API_URL}/api/ChiTietBaoHiem/DanhSachBH`, { params: { search: id } }); 
// ↑ if you had a real ChiTietBH/{id} route, switch to that

// CREATE
export const createInsurance = (data) =>
  axios.post(`${API_URL}/api/ChiTietBaoHiem/TaoBH`, data);

// UPDATE (approve or edit)
export const updateInsurance = (id, data) =>
  axios.put(`${API_URL}/api/ChiTietBaoHiem/CapNhatBH/${id}`, data);

// DELETE expired
export const deleteInsurance = (id) =>
  axios.delete(`${API_URL}/api/ChiTietBaoHiem/XoaBH/${id}`);

// RENEW (Gia hạn)
export const renewInsurances = (payload) =>
  axios.post(`${API_URL}/api/ChiTietBaoHiem/GiaHanBaoHiem`, payload);

// SUPPORTING LOOKUPS
export const getEmployees = () =>
  axios.get(`${API_URL}/api/NhanVien/DanhSachNV`);

export const getInsuranceTypes = () =>
  axios.get(`${API_URL}/api/LoaiBaoHiem/DanhSachLBH`);
