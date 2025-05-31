import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL
// Lấy danh sách hợp đồng
export const fetchContracts = ({
  page = 1,
  pageSize = 10,
  malhd,
  manv,
  search,
  includeDeleted,
  onlyDeleted
} = {}) =>
  axios.get(`/api/ChiTietHopDong/DanhSachHD`, {
    params: { page, pageSize, malhd, manv, search, includeDeleted, onlyDeleted }
  });

// Tạo mới hợp đồng
export const createContract = (data) => {
  return axios.post(`/api/ChiTietHopDong/TaoHD`, data);
};

// Xóa (soft/hard) hợp đồng
export const deleteContract = (id) => {
  return axios.delete(`/api/ChiTietHopDong/DeleteHD/${id}`);
};

// Phê duyệt hợp đồng
export const approveContract = (id) => {
  return axios.post(`/api/ChiTietHopDong/PheDuyetHD/${id}`);
};

// Từ chối hợp đồng
export const rejectContract = (id, reason = "Không phù hợp") => {
  return axios.post(`/api/ChiTietHopDong/TuChoiHD/${id}`, { LYDOHUY: reason });
};

// Lấy mã hợp đồng mới
export const getNewContractCode = () => {
  return axios.get(`/api/ChiTietHopDong/MaHD`);
};

// Gửi yêu cầu kết thúc hợp đồng (Chờ xử lý)
export const requestEndContract = (id, data) => {
  return axios.post(`/api/ChiTietHopDong/KetThucHD/${id}`, data);
};

// Xác nhận kết thúc hợp đồng (Chờ xử lý → Hết hiệu lực)
export const confirmEndContract = (id) => {
  return axios.post(`/api/ChiTietHopDong/XacNhanKetThucHD/${id}`);
};

export const uploadContractFile = (id, formData) => {
  return axios.post(
    `/api/ChiTietHopDong/UploadFile/${id}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
};
// Gia hạn hợp đồng
export const renewContracts = (hopDongIds) => {
  return axios.post(`/api/ChiTietHopDong/GiaHanHD`, { HopDongIds: hopDongIds });
};
