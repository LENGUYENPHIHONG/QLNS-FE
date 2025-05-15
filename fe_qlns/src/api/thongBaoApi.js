import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Lấy danh sách thông báo chưa đọc cho role hiện tại
export const fetchUnreadNotifications = () => {
  return axios.get(`${API_URL}/api/ThongBao/unread`, {
    withCredentials: true
  });
};

// (Tùy chọn) Lấy tất cả thông báo (đã đọc + chưa đọc)
export const fetchAllNotifications = () => {
  return axios.get(`${API_URL}/api/ThongBao`, {
    withCredentials: true
  });
};

// Đánh dấu 1 thông báo đã đọc
export const markNotificationAsRead = (notificationId) => {
  return axios.put(`${API_URL}/api/ThongBao/${notificationId}/read`, null, {
    withCredentials: true
  });
};

// (Tùy chọn) Đánh dấu tất cả thông báo là đã đọc
export const markAllAsRead = () => {
  return axios.put(`${API_URL}/api/ThongBao/read-all`, null, {
    withCredentials: true
  });
};
