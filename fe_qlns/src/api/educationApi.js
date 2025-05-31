import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

export const fetchEducationLevels = () => {
  return axios.get(`/api/TrinhDo/DanhSachTD`);
};

export const getNewEducationCode = () => {
  return axios.get(`/api/TrinhDo/MaTD`);
};

export const createEducationLevel = (data) => {
  console.log("\u{1F4E6} Payload gửi:", data);
  return axios.post(`/api/TrinhDo/TaoTD`, data);
};

export const updateEducationLevel = (data) => {
  return axios.put(`/api/TrinhDo/CapNhatTD`, data);
};

export const deleteEducationLevel = (data) => {
  return axios.delete(`/api/TrinhDo/DeleteTD`, { data });
};