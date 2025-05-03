import axios from "axios";

const BASE = "http://localhost:5077/api/ChiTietBaoHiem";

// GET all
export const fetchInsurances = () =>
  axios.get(`${BASE}/DanhSachBH`);

// GET single detail
export const fetchInsuranceById = (id) =>
  axios.get(`${BASE}/DanhSachBH`, { params: { search: id } }); 
// ↑ if you had a real ChiTietBH/{id} route, switch to that

// CREATE
export const createInsurance = (data) =>
  axios.post(`${BASE}/TaoBH`, data);

// UPDATE (approve or edit)
export const updateInsurance = (id, data) =>
  axios.put(`${BASE}/CapNhatBH/${id}`, data);

// DELETE expired
export const deleteInsurance = (id) =>
  axios.delete(`${BASE}/XoaBH/${id}`);

// RENEW (Gia hạn)
export const renewInsurances = (payload) =>
  axios.post(`${BASE}/GiaHanBaoHiem`, payload);

// SUPPORTING LOOKUPS
export const getEmployees = () =>
  axios.get("http://localhost:5077/api/NhanVien/DanhSachNV");

export const getInsuranceTypes = () =>
  axios.get("http://localhost:5077/api/LoaiBaoHiem/DanhSachLBH");
