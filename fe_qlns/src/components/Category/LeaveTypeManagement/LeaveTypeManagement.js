import React, { useState } from "react";
import { Layout, Form, Input, Button, Select, Table, Space, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Option } = Select;

const LeaveTypeManagement = () => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveTypes, setLeaveTypes] = useState([]); // Danh sách loại nghỉ phép
  const [loading, setLoading] = useState(false);

  // Xử lý thêm loại nghỉ phép
  const handleAddLeaveType = (values) => {
    setLoading(true);
    setTimeout(() => {
      const newLeaveType = {
        id: Date.now(),
        leaveTypeCode: values.leaveTypeCode,
        leaveTypeName: values.leaveTypeName,
        hasImpact: values.hasImpact === "Có" ? 1 : 0, // Chuyển đổi thành giá trị bit (1: Có, 0: Không)
      };
      setLeaveTypes([...leaveTypes, newLeaveType]);
      message.success("Thêm loại nghỉ phép thành công!");
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    const filtered = leaveTypes.filter(
      (leaveType) =>
        leaveType.leaveTypeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leaveType.leaveTypeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setLeaveTypes(filtered);
    console.log("Tìm kiếm với:", searchTerm);
  };

  // Xử lý xóa loại nghỉ phép
  const handleDelete = (id) => {
    setLoading(true);
    setTimeout(() => {
      setLeaveTypes(leaveTypes.filter((leaveType) => leaveType.id !== id));
      message.success("Xóa loại nghỉ phép thành công!");
      setLoading(false);
    }, 1000);
  };

  // Xử lý chỉnh sửa loại nghỉ phép (giả lập)
  const handleEdit = (id) => {
    console.log("Chỉnh sửa loại nghỉ phép:", id);
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Mã loại nghỉ phép",
      dataIndex: "leaveTypeCode",
      key: "leaveTypeCode",
    },
    {
      title: "Tên loại nghỉ phép",
      dataIndex: "leaveTypeName",
      key: "leaveTypeName",
    },
    {
      title: "Ảnh hưởng",
      dataIndex: "hasImpact",
      key: "hasImpact",
      render: (hasImpact) => (hasImpact === 1 ? "Có" : "Không"), // Hiển thị "Có" hoặc "Không" thay vì 1/0
    },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
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
          onFinish={handleAddLeaveType}
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "10px",
          }}
        >
          {/* Hàng 1: Mã loại nghỉ phép, Tên loại nghỉ phép, Ảnh hưởng */}
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
            <Form.Item
              name="leaveTypeCode"
              label="Mã loại nghỉ phép"
              rules={[{ required: true, message: "Vui lòng nhập mã loại nghỉ phép!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Mã loại nghỉ phép" />
            </Form.Item>
            <Form.Item
              name="leaveTypeName"
              label="Tên loại nghỉ phép"
              rules={[{ required: true, message: "Vui lòng nhập tên loại nghỉ phép!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Tên loại nghỉ phép" />
            </Form.Item>
            <Form.Item
              name="hasImpact"
              label="Ảnh hưởng"
              rules={[{ required: true, message: "Vui lòng chọn ảnh hưởng!" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Chọn ảnh hưởng">
                <Option value="Có">Có</Option>
                <Option value="Không">Không</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Hàng 2: Nút Thêm (căn phải) */}
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
        </Space>

        {/* Bảng dữ liệu */}
        <Table
          columns={columns}
          dataSource={leaveTypes}
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

export default LeaveTypeManagement;