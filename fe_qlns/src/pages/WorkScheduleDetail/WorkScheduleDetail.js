import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./WorkScheduleDetail.css";

const WorkScheduleDetail = () => {
  const { id } = useParams(); // Lấy id từ URL

  // Dữ liệu mẫu (thay bằng API sau)
  const schedules = {
    1: {
      name: "Standard 40 hours/week",
      startDay: "12/03/2025 03:28:04",
      timeZone: "Europe/Brussels",
      details: [
        { name: "Sáng Thứ Hai", day: "Thứ Hai", timeSlot: "Buổi sáng", startTime: "08:00", endTime: "12:00", duration: "0.50" },
        { name: "Buổi trưa thứ 2", day: "Thứ Hai", timeSlot: "Nghỉ", startTime: "12:00", endTime: "13:00", duration: "0.00" },
        { name: "Chiều Thứ Hai", day: "Thứ Hai", timeSlot: "Buổi chiều", startTime: "13:00", endTime: "17:00", duration: "0.50" },
        { name: "Sáng Thứ Ba", day: "Thứ Ba", timeSlot: "Buổi sáng", startTime: "08:00", endTime: "12:00", duration: "0.50" },
        { name: "Buổi trưa thứ 3", day: "Thứ Ba", timeSlot: "Nghỉ", startTime: "12:00", endTime: "13:00", duration: "0.00" },
      ],
    },
    2: {
      name: "Standard 35 hours/week",
      startDay: "12/03/2025 03:28:04",
      timeZone: "Europe/Brussels",
      details: [
        { name: "Sáng Thứ Hai", day: "Thứ Hai", timeSlot: "Buổi sáng", startTime: "09:00", endTime: "12:00", duration: "0.38" },
        { name: "Buổi trưa thứ 2", day: "Thứ Hai", timeSlot: "Nghỉ", startTime: "12:00", endTime: "13:00", duration: "0.00" },
        { name: "Chiều Thứ Hai", day: "Thứ Hai", timeSlot: "Buổi chiều", startTime: "13:00", endTime: "16:00", duration: "0.38" },
      ],
    },
    // Thêm dữ liệu cho các lịch khác...
  };

  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    // Tìm lịch theo id
    const selectedSchedule = schedules[id];
    if (selectedSchedule) {
      setSchedule(selectedSchedule);
    }
  }, [id]);

  if (!schedule) {
    return <div>Không tìm thấy lịch làm việc</div>;
  }

  return (
    <div className="work-schedule-detail-container">
      <div className="schedule-header">
        <h2>{schedule.name}</h2>
        <div className="schedule-info">
          <p>
            Ngày bắt đầu: <span>{schedule.startDay}</span>
          </p>
          <p>
            Múi giờ: <span>{schedule.timeZone}</span>
          </p>
        </div>
      </div>
      <div className="schedule-table-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Ngày trong tuần</th>
              <th>Thời gian trong ngày</th>
              <th>Làm việc từ</th>
              <th>Làm việc đến</th>
              <th>Khoảng thời gian (ngày)</th>
            </tr>
          </thead>
          <tbody>
            {schedule.details.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.day}</td>
                <td>{item.timeSlot}</td>
                <td>{item.startTime}</td>
                <td>{item.endTime}</td>
                <td>{item.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkScheduleDetail;