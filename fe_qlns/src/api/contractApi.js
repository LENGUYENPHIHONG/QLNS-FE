import axios from "axios";

const BASE_URL = "http://localhost:5077/api/ChiTietHopDong";

export const fetchContracts = (params = {}) => {
  return axios.get(`${BASE_URL}/DanhSachHD`, { params });
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
  return axios.post(`${BASE_URL}/TuChoiHD/${id}`, { LYDOHUY: "Không phù hợp" });
};

export const getNewContractCode = () => {
  return axios.get(`${BASE_URL}/MaHD`);
};

export const endContract = (id, data) => {
  return axios.post(`${BASE_URL}/KetThucHD/${id}`, data);
};

// Upload file PDF cho hợp đồng
export const uploadContractFile = (formData) => {
  return axios.post(`${BASE_URL}/UploadFile`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Gia hạn hợp đồng
export const renewContracts = (hopDongIds) => {
  return axios.post(`${BASE_URL}/GiaHanHD`, { HopDongIds: hopDongIds });
};

// Lấy lịch sử gia hạn
export const getRenewHistory = (maHopDong) => {
  return axios.get(`${BASE_URL}/LichSuGiaHan`, { params: { maHopDong } });
};