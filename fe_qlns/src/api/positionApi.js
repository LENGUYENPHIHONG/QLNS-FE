import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const fetchPositions = () => axios.get(`/api/ChucVu/DanhSachCV`);
export const createPosition = (data) => axios.post(`/api/ChucVu/TaoCV`, data);
export const deletePosition = (data) => axios.delete(`/api/ChucVu/XoaCV/${data}`);
export const getNewCode = () => axios.get(`/api/ChucVu/MaCV`);
export const updatePosition = (data) => axios.put(`/api/ChucVu/CapNhatCV`, data);
