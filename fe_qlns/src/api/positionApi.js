import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5077/api/ChucVu', // thay đổi nếu backend khác port
});

export const fetchPositions = () => api.get('/DanhSachCV');
export const createPosition = (data) => api.post('/TaoCV', data);
export const deletePosition = (data) => api.delete(`/XoaCV/${data}`);
export const getNewCode = () => api.get('/MaCV');
export const updatePosition = (data) => api.put('/CapNhatCV', data);
