// src/pages/EmployeeTypeManagement.js
import React, { useState } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Select,
  Table,
  Space,
  message,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import EmployeeTypeModal from "./EmployeeTypeModal"; // ✅ modal tách riêng

const { Content } = Layout;
const { Option } = Select;

const EmployeeTypeManagement = () => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddEmployee = (values) => {
    setLoading(true);
    setTimeout(() => {
      const newEmployee = {
        id: Date.now(),
        employeeName: values.employeeName,
        employeeType: values.employeeType,
      };
      setEmployees([...employees, newEmployee]);
      message.success("Thêm nhân viên thành công!");
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  const handleSearch = () => {
    const filtered = employees.filter(
      (e) =>
        e.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.employeeType.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setEmployees(filtered);
  };

  const handleFilter = (value) => {
    setFilter(value);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter((e) => e.id !== id));
    message.success("Đã xóa nhân viên");
  };

  const handleEdit = (id) => {
    message.info("Chức năng sửa chưa hỗ trợ");
  };

  const columns = [
    {
      title: "Tên nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Loại nhân viên",
      dataIndex: "employeeType",
      key: "employeeType",
    },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            style={{ backgroundColor: "#ffc107", borderColor: "#ffc107" }}
            onClick={() => handleEdit(record.id)}
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ backgroundColor: "white", margin: 0, borderRadius: "8px" }}>
      <Content style={{ padding: 20 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddEmployee}
          style={{ backgroundColor: "#fff", padding: 20, borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.1)", marginBottom: 20 }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
            <Form.Item
              name="employeeName"
              label="Tên nhân viên"
              rules={[{ required: true, message: "Hãy nhập tên nhân viên!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Tên nhân viên" />
            </Form.Item>
            <Form.Item
              name="employeeType"
              label={
                <span>
                  Loại nhân viên {" "}
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    onClick={() => setModalVisible(true)}
                    style={{ padding: 0, marginLeft: -5 }}
                  />
                </span>
              }
              rules={[{ required: true, message: "Hãy chọn loại nhân viên!" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Chọn loại nhân viên">
                {employeeTypes.map((type) => (
                  <Option key={type.id} value={type.employeeTypeName}>
                    {type.employeeTypeName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: "#3e0fe6" }}
                loading={loading}
              >
                Thêm
              </Button>
            </Form.Item>
          </div>
        </Form>

        <Space style={{ marginBottom: 20 }}>
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined style={{ color: "#007bff" }} />}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Lọc"
            value={filter}
            onChange={handleFilter}
            style={{ width: 150 }}
          >
            <Option value="">Tất cả</Option>
            {[...new Set(employees.map((e) => e.employeeType))].map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Space>

        <Table
          columns={columns}
          dataSource={employees}
          rowKey="id"
          pagination={false}
          scroll={{ x: true }}
          locale={{ emptyText: "Không có dữ liệu" }}
        />

        <EmployeeTypeModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          employeeTypes={employeeTypes}
          setEmployeeTypes={setEmployeeTypes}
          loading={loading}
          setLoading={setLoading}
        />
      </Content>
    </Layout>
  );
};

export default EmployeeTypeManagement;
