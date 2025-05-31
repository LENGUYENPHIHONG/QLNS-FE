import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL

// Lấy danh sách loại bảo hiểm
export const fetchInsuranceTypes = () => {
  return axios.get(`/api/LoaiBaoHiem/DanhSachLBH`);
};

// Tạo loại bảo hiểm mới
export const createInsuranceType = (data) => {
  return axios.post(`/api/LoaiBaoHiem/TaoLBH`, data);
};

// Cập nhật loại bảo hiểm
export const updateInsuranceType = (data) => {
  return axios.put(`/api/LoaiBaoHiem/CapNhatLBH/${data.MALBH}`, data);
};

// Xóa loại bảo hiểm
export const deleteInsuranceType = (id) => {
    return axios.delete(`/api/LoaiBaoHiem/XoaLBH/${id}`);
  };
  

// Lấy mã loại bảo hiểm mới
export const getNewInsuranceCode = () => {
  return axios.get(`/api/LoaiBaoHiem/MaLBH`);
};
