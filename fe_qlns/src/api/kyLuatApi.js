// src/api/kyLuatApi.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5077';
const KL_ENDPOINT = '/api/KyLuat';

export const getMaKL = async () => {
  const res = await axios.get(`${BASE_URL}${KL_ENDPOINT}/MaKL`);
  return res.data.code;
};

export const getDanhSachKL = async (params) => {
  const res = await axios.get(`${BASE_URL}${KL_ENDPOINT}/DanhSachKL`, {
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
  const res = await axios.post(`${BASE_URL}${KL_ENDPOINT}/KyLuat`, data);
  return res.data;
};

export const updateKyLuat = async (ma, data) => {
  const res = await axios.put(`${BASE_URL}${KL_ENDPOINT}/CapNhatKL/${ma}`, data);
  return res.data;
};

export const deleteKyLuat = async (ma) => {
  const res = await axios.delete(`${BASE_URL}${KL_ENDPOINT}/XoaKL/${ma}`);
  return res.data;
};

export const approveKyLuat = async (ma) => {
  const res = await axios.post(`${BASE_URL}${KL_ENDPOINT}/PhepDuyetKL/${ma}`);
  return res.data;
};

export const rejectKyLuat = async (ma) => {
  const res = await axios.post(`${BASE_URL}${KL_ENDPOINT}/TuChoiKL/${ma}`);
  return res.data;
};

export const cancelKyLuat = async (ma, data) => {
  const res = await axios.post(`${BASE_URL}${KL_ENDPOINT}/HuyKL/${ma}`, data);
  return res.data;
};

export const importKyLuatFromExcel = async (formData) => {
  const res = await axios.post(
    `${BASE_URL}${KL_ENDPOINT}/ImportKyLuat`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  return res.data;
};