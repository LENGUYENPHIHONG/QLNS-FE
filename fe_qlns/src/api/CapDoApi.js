import axios from "axios";

const API_BASE = "http://localhost:5077/api/CapDo";

// Lấy mã mới cho cấp độ
export const getNewLevelCode = () => {
  return axios.get(`${API_BASE}/MaCD`);
};

// Xóa cấp độ theo mã
export const deleteLevel = (maCD) => {
  return axios.delete(`${API_BASE}/XoaCapDo/${maCD}`);
};
