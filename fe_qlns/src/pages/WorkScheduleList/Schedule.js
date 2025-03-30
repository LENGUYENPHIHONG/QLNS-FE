import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Schedule.css";

const WorkScheduleList = () => {
  const [schedules, setSchedules] = useState([
    { id: 1, name: "Standard 40 hours/week" },
    { id: 2, name: "Standard 35 hours/week" },
    { id: 3, name: "Standard 38 hours/week" },
    { id: 4, name: "Standard 45 hours/week" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="work-schedule-list-container">
      <div className="header">
        <h1>Thời gian làm việc</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>
      <div className="schedule-list">
        {filteredSchedules.map((schedule) => (
          <div key={schedule.id} className="schedule-item">
            <input type="checkbox" id={`schedule-${schedule.id}`} />
            <Link to={`/lich-lam-viec/${schedule.id}`} className="schedule-link">
              <label htmlFor={`schedule-${schedule.id}`}>{schedule.name}</label>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkScheduleList;