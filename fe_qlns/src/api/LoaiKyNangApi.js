import axios from "axios";

const API_BASE = "http://localhost:5077/api/LoaiKyNang";

// Lấy danh sách loại kỹ năng (nếu backend có endpoint GET /api/LoaiKyNang)
export const fetchSkillTypes = () => 
  axios.get(`${API_BASE}/DanhSachKyNangTheoLoai`);

// Lấy chi tiết một loại kỹ năng kèm kỹ năng & cấp độ
export const getSkillTypeDetails = (maLKN) => {
  return axios.get(`${API_BASE}/LoaiKyNang/${maLKN}`);
};

// Tạo mới loại kỹ năng + kỹ năng + cấp độ
export const createSkillTypeFull = (data) => {
  console.log("📦 Payload gửi:", data);
  return axios.post(`${API_BASE}/LoaiKyNang`, data);
};

// Cập nhật toàn bộ loại kỹ năng + kỹ năng + cấp độ
export const updateSkillTypeFull = (maLKN, data) => {
  console.log("📦 Payload cập nhật:", data);
  return axios.put(`${API_BASE}/CapNhatLoaiKyNangFull/${maLKN}`, data);
};

// Xóa mềm loại kỹ năng và các thông tin liên quan
export const deleteSkillType = (maLKN) => {
  return axios.delete(`${API_BASE}/XoaLoaiKyNang/${maLKN}`);
};

// Bổ sung thêm kỹ năng và cấp độ cho loại kỹ năng
export const supplementSkillsAndLevels = (data) => {
  console.log("📦 Payload bổ sung:", data);
  return axios.post(`${API_BASE}/BoSungKyNangVaCapDo`, data);
};
