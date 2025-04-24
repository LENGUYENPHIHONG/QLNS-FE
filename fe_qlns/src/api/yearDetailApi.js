// src/api/yearDetailApi.js
import axios from "axios";

const BASE_URL = "http://localhost:5077/api/ChiTietNam/ChiTietNam";

export const getYearDetails = (year) => {
  return axios.get(`${BASE_URL}${year ? `?year=${year}` : ""}`);
};
