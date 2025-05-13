import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

// Lấy mã mới cho cấp độ
export const getNewLevelCode = () => {
  return axios.get(`${API_URL}/api/CapDo/MaCD`);
};

// Xóa cấp độ theo mã
export const deleteLevel = (maCD) => {
  return axios.delete(`${API_URL}/api/CapDo/XoaCapDo/${maCD}`);
};
