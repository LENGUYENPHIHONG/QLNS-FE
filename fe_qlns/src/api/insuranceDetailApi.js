import axios from "axios";

const BASE_URL = "http://localhost:5077/api/ChiTietBaoHiem";

// Lấy danh sách bảo hiểm
export const fetchInsurances = () => {
  return axios.get(`${BASE_URL}/DanhSachBH`);
};

// Lấy chi tiết bảo hiểm theo ID
export const fetchInsuranceById = (id) => {
  return axios.get(`${BASE_URL}/ChiTietBH/${id}`);
};

// Tạo mới bảo hiểm
export const createInsurance = (data) => {
  return axios.post(`${BASE_URL}/TaoBH`, data);
};

// Phê duyệt bảo hiểm
export const approveInsurance = (id, data) => {
  return axios.put(`${BASE_URL}/PheDuyetBH/${id}`, data);
};

// Gia hạn bảo hiểm
export const renewInsurance = (id) => {
  return axios.post(`${BASE_URL}/GiaHanBH/${id}`);
};

// Kết thúc (xoá) bảo hiểm
export const endInsurance = (id) => {
  return axios.delete(`${BASE_URL}/XoaBH/${id}`);
};

// Lấy mã bảo hiểm mới
export const getNewInsuranceCode = () => {
  return axios.get(`${BASE_URL}/MaBH`);
};

// Tìm kiếm, lọc nâng cao
export const filterInsurances = (params) => {
  return axios.get(`${BASE_URL}/TimVaLocBH`, { params });
};

// Lấy danh sách nhân viên
export const getEmployees = () => {
  return axios.get("http://localhost:5077/api/NhanVien/DanhSachNV");
};

// Lấy danh sách loại bảo hiểm
export const getInsuranceTypes = () => {
  return axios.get("http://localhost:5077/api/LoaiBaoHiem/DanhSachLBH");
};
