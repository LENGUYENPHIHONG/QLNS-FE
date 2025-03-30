import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./PositionManagement.css";

const PositionManagement = () => {
  const [positionCode, setPositionCode] = useState("");
  const [positionName, setPositionName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState("");
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddPosition = (e) => {
    e.preventDefault();
    if (!positionCode || !positionName) {
      setMessage("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newPosition = { id: Date.now(), positionCode, positionName };
      setPositions([...positions, newPosition]);
      setMessage("Thêm thành công!");
      setPositionCode("");
      setPositionName("");
      setLoading(false);
    }, 1000);
  };

  const handleSearch = () => {
    const filtered = positions.filter(
      (position) =>
        position.positionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        position.positionName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPositions(filtered);
    console.log("Tìm kiếm với:", searchTerm);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    console.log("Lọc với:", e.target.value);
  };

  return (
    <div className="position-management-container">
      <div className="content">
        <form onSubmit={handleAddPosition} className="position-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Mã chức vụ</label>
              <input
                type="text"
                value={positionCode}
                onChange={(e) => setPositionCode(e.target.value)}
                placeholder="Nhập mã chức vụ"
              />
            </div>
            <div className="form-group">
              <label>Tên chức vụ</label>
              <input
                type="text"
                value={positionName}
                onChange={(e) => setPositionName(e.target.value)}
                placeholder="Nhập tên chức vụ"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="add-button" disabled={loading}>
              {loading ? <div className="spinner"></div> : "Thêm"}
            </button>
          </div>
        </form>
        <div className="search-section">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm..."
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <label>Lọc</label>
            <select value={filter} onChange={handleFilter} className="filter-select">
              <option value="">Chọn chức vụ</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </div>
        </div>
        <div className="position-table-wrapper">
          <table className="position-table">
            <thead>
              <tr>
                <th>Mã chức vụ</th>
                <th>Tên chức vụ</th>
                <th>Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {positions.length > 0 ? (
                positions.map((position) => (
                  <tr key={position.id}>
                    <td>{position.positionCode}</td>
                    <td>{position.positionName}</td>
                    <td>Tùy chọn</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {message && (
          <div className={`message ${message.includes("lỗi") ? "error" : "success"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default PositionManagement;