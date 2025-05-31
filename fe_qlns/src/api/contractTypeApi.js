// src/api/contractTypeApi.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

export const fetchContractTypes = () =>
  axios.get(`/api/LoaiHopDong/DanhSachLHD`);

export const createContractType = (data) =>
  axios.post(`/api/LoaiHopDong/TaoLHD`, data);

export const deleteContractType = (malhd) =>
  axios.delete(`/api/LoaiHopDong/DeleteLHD`, { data: { MALHD: malhd } });

export const updateContractType = (data) =>
  axios.put(`/api/LoaiHopDong/CapNhatLHD`, data);

export const getNewContractTypeCode = () =>
  axios.get(`/api/LoaiHopDong/MaLHD`);
