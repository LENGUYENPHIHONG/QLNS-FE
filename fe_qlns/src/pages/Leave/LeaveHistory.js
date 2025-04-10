
import React, { useState, useMemo } from "react";
import { Layout, Input, Select, Table, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Option } = Select;

const LeaveHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");
  const [leaveHistory, setLeaveHistory] = useState([]); // Mảng rỗng, sẽ lấy dữ liệu từ API sau

  // Lấy danh sách lý do duy nhất từ leaveHistory
  const uniqueReasons = useMemo(() => {
    const reasons = [...new Set(leaveHistory.map((leave) => leave.reason))];
    return ["Tất cả", ...reasons];
  }, [leaveHistory]);

  // Dữ liệu gốc để reset sau khi lọc
  const originalLeaveHistory = leaveHistory;

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterData(term, reasonFilter);
  };

  // Xử lý lọc theo lý do
  const handleReasonFilter = (value) => {
    setReasonFilter(value);
    filterData(searchTerm, value);
  };

  // Hàm lọc dữ liệu
  const filterData = (term, reason) => {
    let filtered = [...originalLeaveHistory]; // Sử dụng dữ liệu gốc để lọc

    // Lọc theo từ khóa tìm kiếm
    if (term) {
      filtered = filtered.filter(
        (leave) =>
          (leave.requestCode && leave.requestCode.toLowerCase().includes(term)) ||
          (leave.employeeName && leave.employeeName.toLowerCase().includes(term)) ||
          (leave.employeeCode && leave.employeeCode.toLowerCase().includes(term)) ||
          (leave.leaveType && leave.leaveType.toLowerCase().includes(term)) ||
          (leave.reason && leave.reason.toLowerCase().includes(term))
      );
    }

    // Lọc theo lý do
    if (reason && reason !== "Tất cả") {
      filtered = filtered.filter((leave) => leave.reason === reason);
    }

    setLeaveHistory(filtered);
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "requestCode",
      key: "requestCode",
    },
    {
      title: "Tên nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Mã nhân viên",
      dataIndex: "employeeCode",
      key: "employeeCode",
    },
    {
      title: "Loại nghỉ phép",
      dataIndex: "leaveType",
      key: "leaveType",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
  ];

  return (
    <Layout style={{ backgroundColor: "white", margin: "0px", borderRadius: "8px" }}>
      {/* Nội dung chính */}
      <Content style={{ padding: "20px" }}>

        {/* Thanh tìm kiếm và lọc */}
        <Space style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleSearch}
            prefix={<SearchOutlined style={{ color: "#007bff" }} />}
            style={{ width: "300px" }}
          />
          <Select
            placeholder="Lọc theo lý do"
            value={reasonFilter}
            onChange={handleReasonFilter}
            style={{ width: "150px" }}
          >
            {uniqueReasons.map((reason, index) => (
              <Option key={index} value={reason}>
                {reason}
              </Option>
            ))}
          </Select>
        </Space>

        {/* Bảng dữ liệu */}
        <Table
          columns={columns}
          dataSource={leaveHistory}
          rowKey="id"
          locale={{ emptyText: <span style={{ color: "#dc3545" }}>Không có dữ liệu</span> }}
          pagination={false}
          style={{
            backgroundColor: "#fff",
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
          scroll={{ x: true }}
        />
      </Content>
    </Layout>
  );
};

export default LeaveHistory;