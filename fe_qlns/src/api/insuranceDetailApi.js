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
  axios.get(`/api/ChiTietBaoHiem/DanhSachBH`, {
    params: { page, pageSize, maNhanVien, maLoaiBaoHiem, trangThai, search }
  });

// CREATE
export const createInsurance = data =>
  axios.post(`/api/ChiTietBaoHiem/TaoBH`, data);

// UPDATE
export const updateInsurance = (id, data) =>
  axios.put(`/api/ChiTietBaoHiem/CapNhatBH/${id}`, data);

// DELETE expired
export const deleteInsurance = id =>
  axios.delete(`/api/ChiTietBaoHiem/XoaBH/${id}`);

// RENEW
export const renewInsurances = payload =>
  axios.post(`/api/ChiTietBaoHiem/GiaHanBaoHiem`, payload);

// LOOKUPS
export const getEmployees = () =>
  axios.get(`/api/NhanVien/DanhSachNV`);

export const getInsuranceTypes = () =>
  axios.get(`/api/LoaiBaoHiem/DanhSachLBH`);
