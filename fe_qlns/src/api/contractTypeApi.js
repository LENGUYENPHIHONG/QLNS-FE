// src/api/contractTypeApi.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

export const fetchContractTypes = () =>
  axios.get(`${API_URL}/api/LoaiHopDong/DanhSachLHD`);

export const createContractType = (data) =>
  axios.post(`${API_URL}/api/LoaiHopDong/TaoLHD`, data);

export const deleteContractType = (malhd) =>
  axios.delete(`${API_URL}/api/LoaiHopDong/DeleteLHD`, { data: { MALHD: malhd } });

export const updateContractType = (data) =>
  axios.put(`${API_URL}/api/LoaiHopDong/CapNhatLHD`, data);

export const getNewContractTypeCode = () =>
  axios.get(`${API_URL}/api/LoaiHopDong/MaLHD`);
