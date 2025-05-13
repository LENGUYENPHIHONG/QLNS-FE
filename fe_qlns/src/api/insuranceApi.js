import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

// Lấy danh sách loại bảo hiểm
export const fetchInsuranceTypes = () => {
  return axios.get(`${API_URL}/api/LoaiBaoHiem/DanhSachLBH`);
};

// Tạo loại bảo hiểm mới
export const createInsuranceType = (data) => {
  return axios.post(`${API_URL}/api/LoaiBaoHiem/TaoLBH`, data);
};

// Cập nhật loại bảo hiểm
export const updateInsuranceType = (data) => {
  return axios.put(`${API_URL}/api/LoaiBaoHiem/CapNhatLBH/${data.MALBH}`, data);
};

// Xóa loại bảo hiểm
export const deleteInsuranceType = (id) => {
    return axios.delete(`${API_URL}/api/LoaiBaoHiem/XoaLBH/${id}`);
  };
  

// Lấy mã loại bảo hiểm mới
export const getNewInsuranceCode = () => {
  return axios.get(`${API_URL}/api/LoaiBaoHiem/MaLBH`);
};
