// src/api/thongBaoApi.js

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Lấy danh sách thông báo chưa đọc cho role hiện tại
export const fetchUnreadNotifications = () => {
  return axios.get(`${API_URL}/api/ThongBao/unread`, {
    withCredentials: true,
  });
};

// Lấy tất cả thông báo (đã đọc + chưa đọc)
export const fetchAllNotifications = () => {
  return axios.get(`${API_URL}/api/ThongBao`, {
    withCredentials: true,
  });
};

// Đánh dấu 1 thông báo đã đọc
export const markNotificationAsRead = (notificationId) => {
  return axios.put(
    `${API_URL}/api/ThongBao/${notificationId}/read`,
    null,
    { withCredentials: true }
  );
};

// Xoá 1 thông báo
export const deleteNotification = (notificationId) => {
  return axios.delete(`${API_URL}/api/ThongBao/${notificationId}`, {
    withCredentials: true,
  });
};

// Xoá tất cả các thông báo đã đọc
export const deleteReadNotifications = () => {
  return axios.delete(`${API_URL}/api/ThongBao/read`, {
    withCredentials: true,
  });
};
