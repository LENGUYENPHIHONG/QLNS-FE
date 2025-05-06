import axios from "axios";

const API_BASE = "http://localhost:5077/api/KyNang";

// Lấy mã mới cho kỹ năng
export const getNewSkillCode = () => {
  return axios.get(`${API_BASE}/MaKN`);
};

// Xóa kỹ năng theo mã
export const deleteSkill = (maKN) => {
  return axios.delete(`${API_BASE}/XoaKyNang/${maKN}`);
};
