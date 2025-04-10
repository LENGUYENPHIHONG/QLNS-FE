import axios from "axios";

const API_BASE = "http://localhost:5077/api/TrinhDo";

export const fetchEducationLevels = () => {
  return axios.get(`${API_BASE}/DanhSachTD`);
};

export const getNewEducationCode = () => {
  return axios.get(`${API_BASE}/MaTD`);
};

export const createEducationLevel = (data) => {
  console.log("\u{1F4E6} Payload gửi:", data);
  return axios.post(`${API_BASE}/TaoTD`, data);
};

export const updateEducationLevel = (data) => {
  return axios.put(`${API_BASE}/CapNhatTD`, data);
};

export const deleteEducationLevel = (data) => {
  return axios.delete(`${API_BASE}/DeleteTD`, { data });
};