// src/api/yearDetailApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5077/api/ChiTietNam/ChiTietNam";
const API_URL = process.env.REACT_APP_API_URL

export const getYearDetails = (year) => {
  return axios.get(`${API_URL}/api/ChiTietNam/ChiTietNam${year ? `?year=${year}` : ""}`);
};
