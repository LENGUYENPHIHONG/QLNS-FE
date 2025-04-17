// src/api/contractTypeApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5077/api/LoaiHopDong";

export const fetchContractTypes = () =>
  axios.get(`${BASE_URL}/DanhSachLHD`);

export const createContractType = (data) =>
  axios.post(`${BASE_URL}/TaoLHD`, data);

export const deleteContractType = (malhd) =>
  axios.delete(`${BASE_URL}/DeleteLHD`, { data: { MALHD: malhd } });

export const updateContractType = (data) =>
  axios.put(`${BASE_URL}/CapNhatLHD`, data);

export const getNewContractTypeCode = () =>
  axios.get(`${BASE_URL}/MaLHD`);
