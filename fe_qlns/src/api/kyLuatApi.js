// src/api/kyLuatApi.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL 

export const getMaKL = async () => {
  const res = await axios.get(`/api/KyLuat/MaKL`);
  return res.data.code;
};


export const getDanhSachKL = async (params) => {
  const res = await axios.get(`/api/KyLuat/DanhSachKL`, {
    params: {
      maNhanVien: params.maNhanVien,
      year: params.year,
      trangThai: params.trangThai,
      search: params.search,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
  return res.data;
};

export const addKyLuat = async (data) => {
  const res = await axios.post(`/api/KyLuat/KyLuat`, data);
  return res.data;
};

export const updateKyLuat = async (ma, data) => {
  const res = await axios.put(`/api/KyLuat/CapNhatKL/${ma}`, data);
  return res.data;
};

export const deleteKyLuat = async (ma) => {
  const res = await axios.delete(`/api/KyLuat/XoaKL/${ma}`);
  return res.data;
};

export const approveKyLuat = async (ma) => {
  const res = await axios.post(`/api/KyLuat/PhepDuyetKL/${ma}`);
  return res.data;
};

export const rejectKyLuat = async (ma) => {
  const res = await axios.post(`/api/KyLuat/TuChoiKL/${ma}`);
  return res.data;
};

export const cancelKyLuat = async (ma, data) => {
  const res = await axios.post(`/api/KyLuat/HuyKL/${ma}`, data);
  return res.data;
};

export const importKyLuatFromExcel = async (formData) => {
  const res = await axios.post(
    `/api/KyLuat/ImportKyLuat`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return res.data;
};