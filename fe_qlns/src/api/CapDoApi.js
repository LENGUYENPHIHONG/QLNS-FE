import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

// Lấy mã mới cho cấp độ
export const getNewLevelCode = () => {
  return axios.get(`/api/CapDo/MaCD`);
};

// Xóa cấp độ theo mã
export const deleteLevel = (maCD) => {
  return axios.delete(`/api/CapDo/XoaCapDo/${maCD}`);
};
