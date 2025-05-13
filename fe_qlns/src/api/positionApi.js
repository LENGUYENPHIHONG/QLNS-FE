import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL

export const fetchPositions = () => axios.get(`${API_URL}/api/ChucVu/DanhSachCV`);
export const createPosition = (data) => axios.post(`${API_URL}/api/ChucVu/TaoCV`, data);
export const deletePosition = (data) => axios.delete(`${API_URL}/api/ChucVu/XoaCV/${data}`);
export const getNewCode = () => axios.get(`${API_URL}/api/ChucVu/MaCV`);
export const updatePosition = (data) => axios.put(`${API_URL}/api/ChucVu/CapNhatCV`, data);
