import axios from "axios";

const baseUrl = "http://localhost:5077/api/LoaiBaoHiem"; // Đổi lại nếu API của bạn chạy cổng khác

// Lấy danh sách loại bảo hiểm
export const fetchInsuranceTypes = () => {
  return axios.get(`${baseUrl}/DanhSachLBH`);
};

// Tạo loại bảo hiểm mới
export const createInsuranceType = (data) => {
  return axios.post(`${baseUrl}/TaoLBH`, data);
};

// Cập nhật loại bảo hiểm
export const updateInsuranceType = (data) => {
  return axios.put(`${baseUrl}/CapNhatLBH/${data.MALBH}`, data);
};

// Xóa loại bảo hiểm
export const deleteInsuranceType = (id) => {
    return axios.delete(`${baseUrl}/XoaLBH/${id}`);
  };
  

// Lấy mã loại bảo hiểm mới
export const getNewInsuranceCode = () => {
  return axios.get(`${baseUrl}/MaLBH`);
};
