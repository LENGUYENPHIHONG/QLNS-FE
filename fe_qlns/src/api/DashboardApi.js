import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

/**
 * Tổng quan nhân sự
 * @param {number} year - Năm cần thống kê
 * @param {number} month - Tháng cần thống kê
 * @param {string} compare - Có thể 'month' hoặc 'year' để so sánh với kỳ trước
 */
export const getEmployeeOverview = (year, month, compare = '') => {
  const params = {};
  if (year != null) params.year = year;
  if (month != null) params.month = month;
  if (compare) params.compare = compare;
  return axios.get(`${API_URL}/api/BaoCaoThongKe/ThongKeTongQuan`, { params });
};

/**
 * Thống kê hợp đồng
 * @param {number} year
 * @param {number} month
 * @param {string} compare
 */
export const getContractStatistics = (year, month, compare = '') => {
  const params = {};
  if (year != null) params.year = year;
  if (month != null) params.month = month;
  if (compare) params.compare = compare;
  return axios.get(`${API_URL}/api/BaoCaoThongKe/ThongKeHopDong`, { params });
};

/**
 * Thống kê nghỉ phép
 * @param {number} year
 * @param {number} month
 * @param {string} compare
 */
export const getLeaveStatistics = (year, month, compare = '') => {
  const params = {};
  if (year != null) params.year = year;
  if (month != null) params.month = month;
  if (compare) params.compare = compare;
  return axios.get(`${API_URL}/api/BaoCaoThongKe/ThongKeNghiPhep`, { params });
};

/**
 * Thống kê phòng ban
 * @param {number} year
 * @param {number} month
 * @param {string} compare
 */
export const getDepartmentStatistics = (year, month, compare = '') => {
  const params = {};
  if (year != null) params.year = year;
  if (month != null) params.month = month;
  if (compare) params.compare = compare;
  return axios.get(`${API_URL}/api/BaoCaoThongKe/ThongKeTheoPhongBan`, { params });
};