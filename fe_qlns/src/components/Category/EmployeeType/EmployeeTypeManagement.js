import React, { useState } from "react";
import { Layout, Form, Input, Button, InputNumber, Select, Table, Space, message, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Option } = Select;

const EmployeeTypeManagement = () => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddEmployeeType = (values) => {
    setLoading(true);
    setTimeout(() => {
      const newEmployeeType = {
        id: Date.now(),
        employeeTypeCode: values.employeeTypeCode,
        employeeTypeName: values.employeeTypeName,
        leaveDays: values.leaveDays,
      };
      setEmployeeTypes([...employeeTypes, newEmployeeType]);
      message.success("Thêm thành công!");
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  const handleSearch = () => {
    const filtered = employeeTypes.filter(
      (type) =>
        type.employeeTypeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.employeeTypeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setEmployeeTypes(filtered);
    console.log("Tìm kiếm với:", searchTerm);
  };

  const handleFilter = (value) => {
    setFilter(value);
    console.log("Lọc với:", value);
  };

  const handleDelete = (id) => {
    setLoading(true);
    setTimeout(() => {
      setEmployeeTypes(employeeTypes.filter((type) => type.id !== id));
      message.success("Xóa thành công!");
      setLoading(false);
    }, 1000);
  };

  const handleEdit = (id) => {
    console.log("Chỉnh sửa loại nhân viên:", id);
  };

  const columns = [
    {
      title: "Mã loại nhân viên",
      dataIndex: "employeeTypeCode",
      key: "employeeTypeCode",
    },
    {
      title: "Tên loại nhân viên",
      dataIndex: "employeeTypeName",
      key: "employeeTypeName",
    },
    {
      title: "Số ngày phép",
      dataIndex: "leaveDays",
      key: "leaveDays",
    },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" style={{ backgroundColor: "#ffc107", borderColor: "#ffc107" }} onClick={() => handleEdit(record.id)}>
            Sửa
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
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
          layout="vertical" // Đổi layout thành vertical để label nằm trên
          onFinish={handleAddEmployeeType}
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
            <Form.Item
              name="employeeTypeCode"
              label="Mã loại nhân viên"
              rules={[{ required: true, message: "Vui lòng nhập mã loại nhân viên!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Mã loại nhân viên" />
            </Form.Item>
            <Form.Item
              name="employeeTypeName"
              label="Tên loại nhân viên"
              rules={[{ required: true, message: "Vui lòng nhập tên loại nhân viên!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Tên loại nhân viên" />
            </Form.Item>
            <Form.Item
              name="leaveDays"
              label="Số ngày phép"
              rules={[{ required: true, message: "Vui lòng nhập số ngày phép!" }]}
              style={{ flex: 1 }}
            >
              <InputNumber placeholder="Số ngày phép" min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                //loading={loading}
                style={{ backgroundColor: "#3e0fe6", borderColor: "#3e0fe6" }}
              >
                Thêm
              </Button>
            </Form.Item>
          </div>
        </Form>

        {/* Thanh tìm kiếm và lọc */}
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
            <Option value="">Chọn loại nhân viên</Option>
            <Option value="option1">Option 1</Option>
            <Option value="option2">Option 2</Option>
          </Select>
        </Space>

        {/* Bảng dữ liệu */}
        <Table
          columns={columns}
          dataSource={employeeTypes}
          rowKey="id"
          loading={loading}
          locale={{ emptyText: <span style={{ color: "#dc3545" }}>Không có dữ liệu</span> }}
          pagination={false}
          style={{ backgroundColor: "#fff", borderRadius: "4px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}
          scroll={{ x: true }}
        />
      </Content>
    </Layout>
  );
};

export default EmployeeTypeManagement;