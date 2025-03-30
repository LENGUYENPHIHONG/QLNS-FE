import React, { useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import "./LeaveHistory.css";

const LeaveHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonFilter, setReasonFilter] = useState(""); // State để lưu lý do được chọn
  const [leaveHistory, setLeaveHistory] = useState([
    {
      id: 1,
      requestCode: "REQ001",
      employeeName: "Nguyễn Văn A",
      leaveType: "Nghỉ phép năm",
      startDate: "2025-03-01",
      endDate: "2025-03-03",
      status: "Đã phê duyệt",
      reason: "Nghỉ để đi du lịch",
    },
    {
      id: 2,
      requestCode: "REQ002",
      employeeName: "Trần Thị B",
      leaveType: "Nghỉ ốm",
      startDate: "2025-02-15",
      endDate: "2025-02-16",
      status: "Đã phê duyệt",
      reason: "Ốm sốt",
    },
    {
      id: 3,
      requestCode: "REQ003",
      employeeName: "Lê Văn C",
      leaveType: "Nghỉ thai sản",
      startDate: "2025-01-10",
      endDate: "2025-04-10",
      status: "Đã phê duyệt",
      reason: "Sinh con",
    },
    {
      id: 4,
      requestCode: "REQ004",
      employeeName: "Phạm Thị D",
      leaveType: "Nghỉ phép năm",
      startDate: "2025-03-05",
      endDate: "2025-03-07",
      status: "Từ chối",
      reason: "Không đủ số ngày phép",
    },
  ]);

  // Lấy danh sách lý do duy nhất từ leaveHistory
  const uniqueReasons = useMemo(() => {
    const reasons = [...new Set(leaveHistory.map((leave) => leave.reason))];
    return ["Tất cả", ...reasons];
  }, [leaveHistory]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterData(term, reasonFilter);
  };

  const handleReasonFilter = (e) => {
    const reason = e.target.value;
    setReasonFilter(reason);
    filterData(searchTerm, reason);
  };

  const filterData = (term, reason) => {
    let filtered = leaveHistory;

    // Lọc theo từ khóa tìm kiếm
    if (term) {
      filtered = filtered.filter(
        (leave) =>
          leave.employeeName.toLowerCase().includes(term) ||
          leave.leaveType.toLowerCase().includes(term) ||
          leave.status.toLowerCase().includes(term)
      );
    }

    // Lọc theo lý do
    if (reason && reason !== "Tất cả") {
      filtered = filtered.filter((leave) => leave.reason === reason);
    }

    setLeaveHistory(filtered);
  };

  return (
    <div className="leave-history-container">
      <h1>Quản lý nghỉ phép</h1>
      <div className="search-section">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm theo tên..."
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <label>Lọc theo lý do:</label>
          <select
            value={reasonFilter}
            onChange={handleReasonFilter}
            className="reason-filter"
          >
            {uniqueReasons.map((reason, index) => (
              <option key={index} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="leave-table-wrapper">
        <table className="leave-table">
          <thead>
            <tr>
              <th>Mã yêu cầu</th>
              <th>Tên nhân viên</th>
              <th>Loại nghỉ phép</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Lý do</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.length > 0 ? (
              leaveHistory.map((leave) => (
                <tr key={leave.id}>
                  <td>{leave.requestCode}</td>
                  <td>{leave.employeeName}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.startDate}</td>
                  <td>{leave.endDate}</td>
                  <td>
                    <span
                      className={
                        leave.status === "Đã phê duyệt"
                          ? "status-approved"
                          : leave.status === "Từ chối"
                          ? "status-rejected"
                          : "status-pending"
                      }
                    >
                      {leave.status || "Chờ duyệt"}
                    </span>
                  </td>
                  <td>{leave.reason}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveHistory;