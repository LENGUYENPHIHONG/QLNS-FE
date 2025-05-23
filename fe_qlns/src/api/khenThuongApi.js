import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL ;

/**
 * Lấy mã Khen Thưởng mới
 */
export const getMaKT = async () => {
  const response = await axios.get(`${BASE_URL}/api/KhenThuong/MaKT`);
  return response.data.code;
};

/**
 * Lấy danh sách Khen Thưởng với phân trang và filter
 *{ maNhanVien, year, trangThai, search, page, pageSize }
 */
export const getDanhSachKT = async (params) => {
  const response = await axios.get(`${BASE_URL}/api/KhenThuong/DanhSachKT`, {
    params: {
      maNhanVien: params.maNhanVien,
      year: params.year,
      trangThai: params.trangThai,
      search: params.search,
      page: params.page,
      pageSize: params.pageSize,
    },
  });
  return response.data;
};

/**
 * Thêm Khen Thưởng
 * @param {Object} data - KhenThuongDTO
 */
export const addKhenThuong = async (data) => {
  const response = await axios.post(
    `${BASE_URL}/api/KhenThuong/KhenThuong`,
    data
  );
  return response.data;
};

/**
 * Cập nhật Khen Thưởng
 * @param {string} maKhenThuong
 * @param {Object} data - KhenThuongDTO
 */
export const updateKhenThuong = async (maKhenThuong, data) => {
  const response = await axios.put(
    `${BASE_URL}/api/KhenThuong/CapNhatKT/${maKhenThuong}`,
    data
  );
  return response.data;
};

/**
 * Xóa Khen Thưởng
 * @param {string} maKhenThuong
 */
export const deleteKhenThuong = async (maKhenThuong) => {
  const response = await axios.delete(
    `${BASE_URL}/api/KhenThuong/XoaKT/${maKhenThuong}`
  );
  return response.data;
};

/**
 * Phê duyệt Khen Thưởng
 * @param {string} maKhenThuong
 */
export const approveKhenThuong = async (maKhenThuong) => {
  const response = await axios.post(
    `${BASE_URL}/api/KhenThuong/PhepDuyetKT/${maKhenThuong}`
  );
  return response.data;
};

/**
 * Từ chối Khen Thưởng
 * @param {string} maKhenThuong
 */
export const rejectKhenThuong = async (maKhenThuong) => {
  const response = await axios.post(
    `${BASE_URL}/api/KhenThuong/TuChoiKT/${maKhenThuong}`
  );
  return response.data;
};

/**
 * Hủy Khen Thưởng đã duyệt
 * @param {string} maKhenThuong
 * @param {Object} data - { LYDOHUY }
 */
export const cancelKhenThuong = async (maKhenThuong, data) => {
  const response = await axios.post(
    `${BASE_URL}/api/KhenThuong/HuyKT/${maKhenThuong}`,
    data
  );
  return response.data;
};

export const importKhenThuongFromExcel = async (formData) => {
  const res = await axios.post(
    `${BASE_URL}/api/KhenThuong/ImportKhenThuong`, 
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  return res;
};