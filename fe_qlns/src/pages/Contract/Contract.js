import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./Contract.css";

const ContractManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContract, setNewContract] = useState({
    employeeName: "",
    contractType: "",
    effectiveDate: "",
  });

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = contracts.filter(
      (contract) =>
        contract.contractCode.toLowerCase().includes(term) ||
        contract.employeeName.toLowerCase().includes(term) ||
        contract.contractName.toLowerCase().includes(term)
    );
    setContracts(filtered);
  };

  const handleAddContract = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewContract({
      employeeName: "",
      contractType: "",
      effectiveDate: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContract((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddContractSubmit = (e) => {
    e.preventDefault();
    if (
      !newContract.employeeName ||
      !newContract.contractType ||
      !newContract.effectiveDate
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    const contract = {
      id: Date.now(),
      contractCode: `HD${Date.now().toString().slice(-6)}`,
      employeeName: newContract.employeeName,
      contractName: `${newContract.contractType} - ${newContract.employeeName}`,
      effectiveDate: newContract.effectiveDate,
      status: "Hiệu lực",
      endDate: "",
    };
    setContracts([...contracts, contract]);
    closeModal();
  };

  return (
    <div className="contract-management-container">
      <div className="search-container">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm hợp đồng"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <button className="add-btn" onClick={handleAddContract}>
          Thêm hợp đồng
        </button>
      </div>
      <div className="table-wrapper">
        <table className="contract-table">
          <thead>
            <tr>
              <th>Mã hợp đồng</th>
              <th>Tên nhân viên</th>
              <th>Tên hợp đồng</th>
              <th>Hiệu lực từ</th>
              <th>Trạng thái</th>
              <th>Ngày kết thúc</th>
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
            ) : contracts.length > 0 ? (
              contracts.map((contract) => (
                <tr key={contract.id}>
                  <td>{contract.contractCode}</td>
                  <td>{contract.employeeName}</td>
                  <td>{contract.contractName}</td>
                  <td>{contract.effectiveDate}</td>
                  <td>
                    <span
                      className={
                        contract.status === "Hiệu lực"
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {contract.status || "Hiệu lực"}
                    </span>
                  </td>
                  <td>{contract.endDate}</td>
                  <td>
                    <button className="edit-btn">Sửa</button>
                    <button className="delete-btn">Xóa</button>
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

      {isModalOpen && (
        <div className="contract-modal-overlay">
          <div className="contract-modal-content">
            <h2>Thêm hợp đồng mới</h2>
            <button className="contract-close-btn" onClick={closeModal}>
              ×
            </button>
            <form
              onSubmit={handleAddContractSubmit}
              className="contract-add-contract-form"
            >
              <div className="contract-form-grid">
                <div className="contract-form-group">
                  <label>Tên nhân viên</label>
                  <select
                    name="employeeName"
                    value={newContract.employeeName}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn nhân viên</option>
                    <option value="Nhân viên 1">Nhân viên 1</option>
                    <option value="Nhân viên 2">Nhân viên 2</option>
                    <option value="Nhân viên 3">Nhân viên 3</option>
                  </select>
                </div>
                <div className="contract-form-group">
                  <label>Loại hợp đồng</label>
                  <select
                    name="contractType"
                    value={newContract.contractType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn loại hợp đồng</option>
                    <option value="Hợp đồng lao động">Hợp đồng lao động</option>
                    <option value="Hợp đồng thử việc">Hợp đồng thử việc</option>
                    <option value="Hợp đồng thời vụ">Hợp đồng thời vụ</option>
                  </select>
                </div>
                <div className="contract-form-group contract-effective-date">
                  <label>Hiệu lực từ ngày</label>
                  <input
                    type="date"
                    name="effectiveDate"
                    value={newContract.effectiveDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="contract-modal-actions">
                <button type="submit" className="contract-save-btn">
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractManagement;