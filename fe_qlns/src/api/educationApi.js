import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

export const fetchEducationLevels = () => {
  return axios.get(`${API_URL}/api/TrinhDo/DanhSachTD`);
};

export const getNewEducationCode = () => {
  return axios.get(`${API_URL}/api/TrinhDo/MaTD`);
};

export const createEducationLevel = (data) => {
  console.log("\u{1F4E6} Payload gửi:", data);
  return axios.post(`${API_URL}/api/TrinhDo/TaoTD`, data);
};

export const updateEducationLevel = (data) => {
  return axios.put(`${API_URL}/api/TrinhDo/CapNhatTD`, data);
};

export const deleteEducationLevel = (data) => {
  return axios.delete(`${API_URL}/api/TrinhDo/DeleteTD`, { data });
};