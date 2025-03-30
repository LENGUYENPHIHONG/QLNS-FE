import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./departments.css";

const DepartmentManagement = () => {
  const [departmentCode, setDepartmentCode] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState("");
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (!departmentCode || !departmentName) {
      setMessage("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const newDepartment = {
        id: Date.now(),
        departmentCode,
        departmentName,
        employeeCount: 0, // Số lượng nhân viên mặc định là 0
      };
      setDepartments([...departments, newDepartment]);
      setMessage("Thêm thành công!");
      setDepartmentCode("");
      setDepartmentName("");
      setLoading(false);
    }, 1000);
  };

  const handleSearch = () => {
    const filtered = departments.filter(
      (department) =>
        department.departmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        department.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDepartments(filtered);
    console.log("Tìm kiếm với:", searchTerm);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    console.log("Lọc với:", e.target.value);
  };

  const handleDelete = (id) => {
    setLoading(true);
    setTimeout(() => {
      setDepartments(departments.filter((department) => department.id !== id));
      setMessage("Xóa thành công!");
      setLoading(false);
    }, 1000);
  };

  const handleEdit = (id) => {
    console.log("Chỉnh sửa phòng ban:", id);
  };

  return (
    <div className="department-management-container">
      <div className="content">
        <form onSubmit={handleAddDepartment} className="department-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Mã phòng ban</label>
              <input
                type="text"
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value)}
                placeholder="Nhập mã phòng ban"
              />
            </div>
            <div className="form-group">
              <label>Tên phòng ban</label>
              <input
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="Nhập tên phòng ban"
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
              <option value="">Chọn phòng ban</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </div>
        </div>
        <div className="department-table-wrapper">
          <table className="department-table">
            <thead>
              <tr>
                <th>Mã phòng ban</th>
                <th>Tên phòng ban</th>
                <th>Số lượng nhân viên</th>
                <th>Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((department) => (
                  <tr key={department.id}>
                    <td>{department.departmentCode}</td>
                    <td>{department.departmentName}</td>
                    <td>{department.employeeCount}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(department.id)}
                      >
                        Sửa
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(department.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
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

export default DepartmentManagement;