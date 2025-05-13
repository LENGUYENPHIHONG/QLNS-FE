// src/api/DashboardApi.js
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL

/** Tổng quan nhân sự, optionally compare=month|year */
export const getEmployeeOverview = (compare) => {
  const params = {};
  if (compare) params.compare = compare;
  return axios.get(`${API_URL}/api/BaoCaoThongKe/ThongKeTongQuan`, { params });
};

/** Thống kê hợp đồng, optionally compare */
export const getContractStatistics = (compare) => {
  const params = {};
  if (compare) params.compare = compare;
  return axios.get(`${API_URL}/api/BaoCaoThongKe/ThongKeHopDong`, { params });
};

/** Nghỉ phép, year + compare */
export const getLeaveStatistics = (year, compare) => {
  const params = { year };
  if (compare) params.compare = compare;
  return axios.get(`${API_URL}/api/BaoCaoThongKe/ThongKeNghiPhep`, { params });
};

/** Phòng ban, optionally compare */
export const getDepartmentStatistics = (compare) => {
  const params = {};
  if (compare) params.compare = compare;
  return axios.get(`${API_URL}/api/BaoCaoThongKe/ThongKeTheoPhongBan`, { params });
};
