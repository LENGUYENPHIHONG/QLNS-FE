import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./EducationLevelManagement.css";

const EducationLevelManagement = () => {
  const [educationCode, setEducationCode] = useState("");
  const [educationName, setEducationName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState("");
  const [educationLevels, setEducationLevels] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddEducationLevel = (e) => {
    e.preventDefault();
    if (!educationCode || !educationName) {
      setMessage("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newEducationLevel = {
        id: Date.now(),
        educationCode,
        educationName,
      };
      setEducationLevels([...educationLevels, newEducationLevel]);
      setMessage("Thêm thành công!");
      setEducationCode("");
      setEducationName("");
      setLoading(false);
    }, 1000);
  };

  const handleSearch = () => {
    const filtered = educationLevels.filter(
      (level) =>
        level.educationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        level.educationName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setEducationLevels(filtered);
    console.log("Tìm kiếm với:", searchTerm);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    console.log("Lọc với:", e.target.value);
  };

  const handleDelete = (id) => {
    setLoading(true);
    setTimeout(() => {
      setEducationLevels(educationLevels.filter((level) => level.id !== id));
      setMessage("Xóa thành công!");
      setLoading(false);
    }, 1000);
  };

  const handleEdit = (id) => {
    console.log("Chỉnh sửa trình độ:", id);
  };

  return (
    <div className="education-level-management-container">
      <div className="content">
        <form onSubmit={handleAddEducationLevel} className="education-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Mã trình độ</label>
              <input
                type="text"
                value={educationCode}
                onChange={(e) => setEducationCode(e.target.value)}
                placeholder="Nhập mã trình độ"
              />
            </div>
            <div className="form-group">
              <label>Tên trình độ</label>
              <input
                type="text"
                value={educationName}
                onChange={(e) => setEducationName(e.target.value)}
                placeholder="Nhập tên trình độ"
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
              <option value="">Chọn trình độ</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </div>
        </div>
        <div className="education-table-wrapper">
          <table className="education-table">
            <thead>
              <tr>
                <th>Mã trình độ</th>
                <th>Tên trình độ</th>
                <th>Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {educationLevels.length > 0 ? (
                educationLevels.map((level) => (
                  <tr key={level.id}>
                    <td>{level.educationCode}</td>
                    <td>{level.educationName}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(level.id)}
                      >
                        Sửa
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(level.id)}
                      >
                        Xóa
                      </button>
                    </td>
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

export default EducationLevelManagement;