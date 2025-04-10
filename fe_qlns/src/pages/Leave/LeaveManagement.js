import React, { useState } from "react";
import { Layout, Form, Input, Button, Select, Table, Space, message, DatePicker } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment"; // Để xử lý ngày tháng

const { Content } = Layout;
const { Option } = Select;

const LeaveRequestManagement = () => {
  const [form] = Form.useForm();
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]); // Danh sách yêu cầu nghỉ phép
  const [loading, setLoading] = useState(false);

  // Giả lập danh sách loại nghỉ phép (có thể lấy từ API hoặc state toàn cục)
  const leaveTypes = [
    { id: 1, leaveTypeName: "Nghỉ phép năm" },
    { id: 2, leaveTypeName: "Nghỉ ốm" },
    { id: 3, leaveTypeName: "Nghỉ không lương" },
  ];

  // Xử lý thêm yêu cầu nghỉ phép
  const handleAddLeaveRequest = (values) => {
    setLoading(true);
    setTimeout(() => {
      // Tính số ngày nghỉ
      const startDate = moment(values.startDate);
      const endDate = moment(values.endDate);
      const daysOff = endDate.diff(startDate, "days") + 1; // Bao gồm cả ngày bắt đầu và kết thúc

      const newLeaveRequest = {
        id: Date.now(),
        requestCode: values.requestCode,
        employeeName: values.employeeName,
        leaveType: values.leaveType,
        startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
        endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
        reason: values.reason,
        daysOff: daysOff > 0 ? daysOff : 0, // Số ngày nghỉ
        status: "Chờ duyệt", // Mặc định trạng thái là "Chờ duyệt"
      };
      setLeaveRequests([...leaveRequests, newLeaveRequest]);
      message.success("Thêm yêu cầu nghỉ phép thành công!");
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    const filtered = leaveRequests.filter(
      (request) =>
        request.requestCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setLeaveRequests(filtered);
    console.log("Tìm kiếm với:", searchTerm);
  };

  // Xử lý xóa yêu cầu nghỉ phép
  const handleDelete = (id) => {
    setLoading(true);
    setTimeout(() => {
      setLeaveRequests(leaveRequests.filter((request) => request.id !== id));
      message.success("Xóa yêu cầu nghỉ phép thành công!");
      setLoading(false);
    }, 1000);
  };

    // Xử lý lọc (giả lập)
    const handleFilter = (value) => {
      setFilter(value);
      console.log("Lọc với:", value);
    };
  
  // Xử lý chỉnh sửa yêu cầu nghỉ phép (giả lập)
  const handleEdit = (id) => {
    console.log("Chỉnh sửa yêu cầu nghỉ phép:", id);
  };

  // Xử lý phê duyệt yêu cầu nghỉ phép
  const handleApprove = (id) => {
    setLoading(true);
    setTimeout(() => {
      setLeaveRequests(
        leaveRequests.map((request) =>
          request.id === id ? { ...request, status: "Đã phê duyệt" } : request
        )
      );
      message.success("Phê duyệt yêu cầu nghỉ phép thành công!");
      setLoading(false);
    }, 1000);
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
      title: "Loại nghỉ phép",
      dataIndex: "leaveType",
      key: "leaveType",
    },
    {
      title: "Số ngày nghỉ",
      dataIndex: "daysOff",
      key: "daysOff",
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.status === "Chờ duyệt" && (
            <Button
              type="primary"
              style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
              onClick={() => handleApprove(record.id)}
            >
              Phê duyệt
            </Button>
          )}
          <Button
            type="primary"
            style={{ backgroundColor: "#ffc107", borderColor: "#ffc107" }}
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ backgroundColor: "white", margin: "0px", borderRadius: "8px" }}>
      {/* Nội dung chính */}
      <Content style={{ padding: "20px" }}>
        {/* Form nhập liệu */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddLeaveRequest}
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "10px",
          }}
        >
          {/* Hàng 1: Mã yêu cầu, Tên nhân viên, Loại nghỉ phép */}
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
            <Form.Item
              name="employeeName"
              label="Tên nhân viên"
              rules={[{ required: true, message: "Vui lòng nhập tên nhân viên!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Tên nhân viên" />
            </Form.Item>
            <Form.Item
              name="leaveType"
              label="Loại nghỉ phép"
              rules={[{ required: true, message: "Vui lòng chọn loại nghỉ phép!" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Chọn loại nghỉ phép">
                {leaveTypes.map((type) => (
                  <Option key={type.id} value={type.leaveTypeName}>
                    {type.leaveTypeName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Hàng 2: Ngày bắt đầu, Ngày kết thúc, Lý do */}
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
              style={{ flex: 1 }}
            >
              <DatePicker
                placeholder="Chọn ngày bắt đầu"
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
              />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="Ngày kết thúc"
              rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
              style={{ flex: 1 }}
            >
              <DatePicker
                placeholder="Chọn ngày kết thúc"
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
            <Form.Item
              name="reason"
              label="Lý do"
              rules={[{ required: true, message: "Vui lòng nhập lý do!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Lý do" />
            </Form.Item>
          </div>
          {/* Hàng 3: Nút Thêm (căn phải) */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-5px" }}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: "#3e0fe6", borderColor: "#3e0fe6" }}
                loading={loading}
              >
                Thêm
              </Button>
            </Form.Item>
          </div>
        </Form>

        {/* Thanh tìm kiếm */}
        <Space style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#007bff" }} />}
            style={{ width: "300px" }}
            onPressEnter={handleSearch}
          />
          <Select
                      placeholder="Lọc"
                      value={filter}
                      onChange={handleFilter}
                      style={{ width: "150px" }}
                    >
                      <Option value="">Chọn trình độ</Option>
                      <Option value="option1">Option 1</Option>
                      <Option value="option2">Option 2</Option>
                    </Select>
        </Space>

        {/* Bảng dữ liệu */}
        <Table
          columns={columns}
          dataSource={leaveRequests}
          rowKey="id"
          loading={loading}
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

export default LeaveRequestManagement;