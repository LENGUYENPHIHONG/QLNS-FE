import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./EmployeeListPage.css";

const EmployeeListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    name: "",
    avatar: "",
    birthDate: "",
    gender: "Nam",
    cccd: "",
    phone: "",
    nationality: "",
    ethnicity: "",
    religion: "",
    maritalStatus: "Độc thân",
    birthPlace: "",
    address: "",
    department: "",
    position: "",
    education: "",
    specialization: "",
    employeeType: "",
    joinDate: "",
    status: "Đang làm việc",
  });

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    console.log("Lọc với:", e.target.value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewEmployee({
      id: "",
      name: "",
      avatar: "",
      birthDate: "",
      gender: "Nam",
      cccd: "",
      phone: "",
      nationality: "",
      ethnicity: "",
      religion: "",
      maritalStatus: "Độc thân",
      birthPlace: "",
      address: "",
      department: "",
      position: "",
      education: "",
      specialization: "",
      employeeType: "",
      joinDate: "",
      status: "Đang làm việc",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    setEmployees((prev) => {
      const updatedEmployees = [
        ...prev,
        { ...newEmployee, status: newEmployee.status || "Đang làm việc" },
      ];
      setIsModalOpen(false);
      return updatedEmployees;
    });
  };

  return (
    <div className="employee-list-container">
      <div className="content">
        <div className="search-section">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <label>Lọc</label>
            <select value={filter} onChange={handleFilter} className="filter-select">
              <option value="">Chọn nhân viên</option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </div>
          <button className="add-btn" onClick={openModal}>
            Thêm nhân viên
          </button>
        </div>

        <div className="table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Mã NV</th>
                <th>Tên nhân viên</th>
                <th>Số điện thoại</th>
                <th>Phòng ban</th>
                <th>Chức vụ</th>
                <th>Ngày vào làm</th>
                <th>Trạng thái</th>
                <th>Tùy chọn</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.phone}</td>
                    <td>{employee.department}</td>
                    <td>{employee.position}</td>
                    <td>{employee.joinDate}</td>
                    <td>
                      <span
                        className={
                          employee.status === "Đang làm việc"
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {employee.status || "Đang làm việc"}
                      </span>
                    </td>
                    <td>
                      <button className="edit-btn">Sửa</button>
                      <button className="delete-btn">Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="employee-modal-overlay">
          <div className="employee-modal-content">
            <h2>Thêm nhân viên mới</h2>
            <form onSubmit={handleAddEmployee} className="employee-add-employee-form">
              <div className="employee-form-grid">
                <div className="employee-form-group">
                  <label>Mã nhân viên:</label>
                  <input
                    type="text"
                    name="id"
                    value={newEmployee.id}
                    onChange={handleInputChange}
                    placeholder="Nhập mã nhân viên"
                    required
                  />
                </div>
                <div className="employee-form-group">
                  <label>Tên nhân viên:</label>
                  <input
                    type="text"
                    name="name"
                    value={newEmployee.name}
                    onChange={handleInputChange}
                    placeholder="Nhập tên nhân viên"
                    required
                  />
                </div>
                <div className="employee-form-group">
                  <label>Link ảnh:</label>
                  <input
                    type="text"
                    name="avatar"
                    value={newEmployee.avatar}
                    onChange={handleInputChange}
                    placeholder="Nhập link ảnh"
                  />
                </div>
                <div className="employee-form-group">
                  <label>Ngày sinh:</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={newEmployee.birthDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="employee-form-group">
                  <label>Giới tính:</label>
                  <select
                    name="gender"
                    value={newEmployee.gender}
                    onChange={handleInputChange}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="employee-form-group">
                  <label>CCCD:</label>
                  <input
                    type="text"
                    name="cccd"
                    value={newEmployee.cccd}
                    onChange={handleInputChange}
                    placeholder="Nhập CCCD"
                    required
                  />
                </div>
                <div className="employee-form-group">
                  <label>Số điện thoại:</label>
                  <input
                    type="text"
                    name="phone"
                    value={newEmployee.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
                <div className="employee-form-group">
                  <label>Quốc tịch:</label>
                  <input
                    type="text"
                    name="nationality"
                    value={newEmployee.nationality}
                    onChange={handleInputChange}
                    placeholder="Nhập quốc tịch"
                    required
                  />
                </div>
                <div className="employee-form-group">
                  <label>Dân tộc:</label>
                  <input
                    type="text"
                    name="ethnicity"
                    value={newEmployee.ethnicity}
                    onChange={handleInputChange}
                    placeholder="Nhập dân tộc"
                    required
                  />
                </div>
                <div className="employee-form-group">
                  <label>Tôn giáo:</label>
                  <input
                    type="text"
                    name="religion"
                    value={newEmployee.religion}
                    onChange={handleInputChange}
                    placeholder="Nhập tôn giáo"
                  />
                </div>
                <div className="employee-form-group">
                  <label>Hôn nhân:</label>
                  <select
                    name="maritalStatus"
                    value={newEmployee.maritalStatus}
                    onChange={handleInputChange}
                  >
                    <option value="Độc thân">Độc thân</option>
                    <option value="Đã kết hôn">Đã kết hôn</option>
                  </select>
                </div>
                <div className="employee-form-group">
                  <label>Nơi sinh:</label>
                  <input
                    type="text"
                    name="birthPlace"
                    value={newEmployee.birthPlace}
                    onChange={handleInputChange}
                    placeholder="Nhập nơi sinh"
                    required
                  />
                </div>
                <div className="employee-form-group">
                  <label>Địa chỉ:</label>
                  <input
                    type="text"
                    name="address"
                    value={newEmployee.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ"
                    required
                  />
                </div>
                <div className="employee-form-group">
                  <label>Phòng ban:</label>
                  <input
                    type="text"
                    name="department"
                    value={newEmployee.department}
                    onChange={handleInputChange}
                    placeholder="Nhập phòng ban"
                    required
                  />
                </div>
                <div className="employee-form-group">
                  <label>Chức vụ:</label>
                  <input
                    type="text"
                    name="position"
                    value={newEmployee.position}
                    onChange={handleInputChange}
                    placeholder="Nhập chức vụ"
                    required
                  />
                </div>
                <div className="employee-form-group">
                  <label>Trình độ:</label>
                  <input
                    type="text"
                    name="education"
                    value={newEmployee.education}
                    onChange={handleInputChange}
                    placeholder="Nhập trình độ"
                    required
                  />
                </div>
                <div className="employee-form-group">
                  <label>Chuyên môn:</label>
                  <input
                    type="text"
                    name="specialization"
                    value={newEmployee.specialization}
                    onChange={handleInputChange}
                    placeholder="Nhập chuyên môn"
                    required
                  />
                </div>
                <div className="employee-form-group">
                  <label>Loại nhân viên:</label>
                  <input
                    type="text"
                    name="employeeType"
                    value={newEmployee.employeeType}
                    onChange={handleInputChange}
                    placeholder="Nhập loại nhân viên"
                    required
                  />
                </div>
                <div className="employee-form-group">
                  <label>Ngày vào làm:</label>
                  <input
                    type="date"
                    name="joinDate"
                    value={newEmployee.joinDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="employee-modal-actions">
                <button type="submit" className="employee-save-btn">
                  Lưu
                </button>
                <button
                  type="button"
                  className="employee-cancel-btn"
                  onClick={closeModal}
                >
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

export default EmployeeListPage;