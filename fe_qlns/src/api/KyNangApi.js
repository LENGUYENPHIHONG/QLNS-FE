import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

// Lấy mã mới cho kỹ năng
export const getNewSkillCode = () => {
  return axios.get(`${API_URL}/api/KyNang/MaKN`);
};

// Xóa kỹ năng theo mã
export const deleteSkill = (maKN) => {
  return axios.delete(`${API_URL}/api/KyNang/XoaKyNang/${maKN}`);
};
