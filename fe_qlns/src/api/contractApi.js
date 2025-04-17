import axios from "axios";

const BASE_URL = "http://localhost:5077/api/ChiTietHopDong";

export const fetchContracts = () => {
  return axios.get(`${BASE_URL}/DanhSachHD`);
};

export const createContract = (data) => {
  return axios.post(`${BASE_URL}/TaoHD`, data);
};

export const deleteContract = (id) => {
  return axios.delete(`${BASE_URL}/DeleteHD/${id}`);
};

export const approveContract = (id) => {
  return axios.post(`${BASE_URL}/PheDuyetHD/${id}`);
};

export const rejectContract = (id) => {
  return axios.post(`${BASE_URL}/TuChoiHD/${id}`);
};

export const getNewContractCode = () => {
  return axios.get(`${BASE_URL}/MaHD`);
};

export const endContract = (id, data) => {
  return axios.post(`${BASE_URL}/KetThucHD/${id}`, data);
};