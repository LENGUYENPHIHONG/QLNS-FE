import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./LeaveManagement.css";

const LeaveManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({
    requestCode: "",
    employeeCode: "",
    employeeName: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = leaves.filter(
      (leave) =>
        leave.employeeName.toLowerCase().includes(term) ||
        leave.leaveType.toLowerCase().includes(term)
    );
    setLeaves(filtered);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    console.log("Lọc với:", e.target.value);
  };

  const handleApprove = (id) => {
    setLoading(true);
    setTimeout(() => {
      setLeaves(
        leaves.map((leave) =>
          leave.id === id ? { ...leave, status: "Đã phê duyệt" } : leave
        )
      );
      setMessage("Phê duyệt thành công!");
      setLoading(false);
    }, 1000);
  };

  const handleReject = (id) => {
    setLoading(true);
    setTimeout(() => {
      setLeaves(
        leaves.map((leave) =>
          leave.id === id ? { ...leave, status: "Từ chối" } : leave
        )
      );
      setMessage("Từ chối thành công!");
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeave((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLeave = (e) => {
    e.preventDefault();
    if (
      !newLeave.requestCode ||
      !newLeave.employeeCode ||
      !newLeave.employeeName ||
      !newLeave.leaveType ||
      !newLeave.startDate ||
      !newLeave.endDate ||
      !newLeave.reason
    ) {
      setMessage("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const leave = {
        id: Date.now(),
        requestCode: newLeave.requestCode,
        employeeCode: newLeave.employeeCode,
        employeeName: newLeave.employeeName,
        leaveType: newLeave.leaveType,
        startDate: newLeave.startDate,
        endDate: newLeave.endDate,
        reason: newLeave.reason,
        status: "Chờ duyệt",
      };
      setLeaves([...leaves, leave]);
      setMessage("Đăng ký nghỉ phép thành công!");
      setNewLeave({
        requestCode: "",
        employeeCode: "",
        employeeName: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
      setIsModalOpen(false);
      setLoading(false);
    }, 1000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewLeave({
      requestCode: "",
      employeeCode: "",
      employeeName: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
    });
  };

  return (
    <div className="leave-management-container">
      <div className="content">
        <div className="search-section">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Tìm kiếm..."
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <label>Lọc</label>
            <select value={filter} onChange={handleFilter} className="filter-select">
              <option value="">Chọn trạng thái</option>
              <option value="Chờ duyệt">Chờ duyệt</option>
              <option value="Đã phê duyệt">Đã phê duyệt</option>
              <option value="Từ chối">Từ chối</option>
            </select>
          </div>
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>
            Đăng ký nghỉ phép
          </button>
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
                <th>Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="loading-cell">
                    <div className="spinner"></div>
                    <span>Đang tải dữ liệu...</span>
                  </td>
                </tr>
              ) : leaves.length > 0 ? (
                leaves.map((leave) => (
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
                    <td>
                      {leave.status === "Chờ duyệt" && (
                        <>
                          <button
                            className="approve-btn"
                            onClick={() => handleApprove(leave.id)}
                          >
                            Phê duyệt
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleReject(leave.id)}
                          >
                            Từ chối
                          </button>
                        </>
                      )}
                    </td>
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
        {message && (
          <div className={`message ${message.includes("thành công") ? "success" : "error"}`}>
            {message}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Đăng ký nghỉ phép</h2>
            <button className="close-btn" onClick={closeModal}>
              ×
            </button>
            <form onSubmit={handleAddLeave} className="leave-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Mã yêu cầu</label>
                  <input
                    type="text"
                    name="requestCode"
                    value={newLeave.requestCode}
                    onChange={handleInputChange}
                    placeholder="Nhập mã yêu cầu"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mã nhân viên</label>
                  <input
                    type="text"
                    name="employeeCode"
                    value={newLeave.employeeCode}
                    onChange={handleInputChange}
                    placeholder="Nhập mã nhân viên"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tên nhân viên</label>
                  <input
                    type="text"
                    name="employeeName"
                    value={newLeave.employeeName}
                    onChange={handleInputChange}
                    placeholder="Nhập tên nhân viên"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Loại nghỉ phép</label>
                  <select
                    name="leaveType"
                    value={newLeave.leaveType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn loại nghỉ phép</option>
                    <option value="Nghỉ phép năm">Nghỉ phép năm</option>
                    <option value="Nghỉ ốm">Nghỉ ốm</option>
                    <option value="Nghỉ thai sản">Nghỉ thai sản</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Ngày bắt đầu</label>
                  <input
                    type="date"
                    name="startDate"
                    value={newLeave.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Ngày kết thúc</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newLeave.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label>Lý do</label>
                  <textarea
                    name="reason"
                    value={newLeave.reason}
                    onChange={handleInputChange}
                    placeholder="Nhập lý do nghỉ phép"
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? <div className="spinner"></div> : "Lưu"}
                </button>
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;