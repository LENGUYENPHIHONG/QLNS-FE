import axios from "axios";

const BASE_URL = "http://localhost:5077/api/ChiTietHopDong";

// Lấy danh sách hợp đồng
export const fetchContracts = (params = {}) => {
  return axios.get(`${BASE_URL}/DanhSachHD`, { params });
};

// Tạo mới hợp đồng
export const createContract = (data) => {
  return axios.post(`${BASE_URL}/TaoHD`, data);
};

// Xóa (soft/hard) hợp đồng
export const deleteContract = (id) => {
  return axios.delete(`${BASE_URL}/DeleteHD/${id}`);
};

// Phê duyệt hợp đồng
export const approveContract = (id) => {
  return axios.post(`${BASE_URL}/PheDuyetHD/${id}`);
};

// Từ chối hợp đồng
export const rejectContract = (id, reason = "Không phù hợp") => {
  return axios.post(`${BASE_URL}/TuChoiHD/${id}`, { LYDOHUY: reason });
};

// Lấy mã hợp đồng mới
export const getNewContractCode = () => {
  return axios.get(`${BASE_URL}/MaHD`);
};

// Gửi yêu cầu kết thúc hợp đồng (Chờ xử lý)
export const requestEndContract = (id, data) => {
  return axios.post(`${BASE_URL}/KetThucHD/${id}`, data);
};

// Xác nhận kết thúc hợp đồng (Chờ xử lý → Hết hiệu lực)
export const confirmEndContract = (id) => {
  return axios.post(`${BASE_URL}/XacNhanKetThucHD/${id}`);
};

// Upload PDF hợp đồng
export const uploadContractFile = (formData) => {
  return axios.post(`${BASE_URL}/UploadFile`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

// Gia hạn hợp đồng
export const renewContracts = (hopDongIds) => {
  return axios.post(`${BASE_URL}/GiaHanHD`, { HopDongIds: hopDongIds });
};
