// src/api/DashboardApi.js
import axios from 'axios';
const BASE = 'http://localhost:5077/api/BaoCaoThongKe';

/** Tổng quan nhân sự, optionally compare=month|year */
export const getEmployeeOverview = (compare) => {
  const params = {};
  if (compare) params.compare = compare;
  return axios.get(`${BASE}/ThongKeTongQuan`, { params });
};

/** Thống kê hợp đồng, optionally compare */
export const getContractStatistics = (compare) => {
  const params = {};
  if (compare) params.compare = compare;
  return axios.get(`${BASE}/ThongKeHopDong`, { params });
};

/** Nghỉ phép, year + compare */
export const getLeaveStatistics = (year, compare) => {
  const params = { year };
  if (compare) params.compare = compare;
  return axios.get(`${BASE}/ThongKeNghiPhep`, { params });
};

/** Phòng ban, optionally compare */
export const getDepartmentStatistics = (compare) => {
  const params = {};
  if (compare) params.compare = compare;
  return axios.get(`${BASE}/ThongKeTheoPhongBan`, { params });
};
