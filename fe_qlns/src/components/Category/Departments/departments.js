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
    DatePicker,
  } from "antd";
  import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
  } from "@ant-design/icons";
  import DepartmentModal from "./DepartmentModal"; // 👈 Import modal tách riêng

  const { Content } = Layout;
  const { Option } = Select;

  const DepartmentManagement = () => {
    const [form] = Form.useForm();
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("");
    const [departments, setDepartments] = useState([]); // Danh sách phòng ban
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleAddDepartment = (values) => {
      setLoading(true);
      setTimeout(() => {
        const newDepartment = {
          id: Date.now(),
          employeeName: values.employeeName,
          departmentName: values.departmentName,
          position: values.position,
          startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
        };
        setDepartments([...departments, newDepartment]);
        message.success("Thêm phòng ban thành công!");
        form.resetFields();
        setLoading(false);
      }, 1000);
    };

    const handleSearch = () => {
      const filtered = departments.filter(
        (dept) =>
          dept.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dept.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDepartments(filtered);
      console.log("Tìm kiếm với:", searchTerm);
    };

    const handleFilter = (value) => {
      setFilter(value);
      if (value) {
        const filtered = departments.filter((dept) => dept.departmentName === value);
        setDepartments(filtered);
      } else {
        setDepartments(departments);
      }
      console.log("Lọc với:", value);
    };

    const handleDelete = (id) => {
      setLoading(true);
      setTimeout(() => {
        setDepartments(departments.filter((dept) => dept.id !== id));
        message.success("Xóa phòng ban thành công!");
        setLoading(false);
      }, 1000);
    };

    const handleEdit = (id) => {
      console.log("Chỉnh sửa phòng ban:", id);
    };

    const columns = [
      {
        title: "Tên nhân viên",
        dataIndex: "employeeName",
        key: "employeeName",
      },
      {
        title: "Phòng ban",
        dataIndex: "departmentName",
        key: "departmentName",
      },
      {
        title: "Chức vụ",
        dataIndex: "position",
        key: "position",
      },
      {
        title: "Ngày bắt đầu",
        dataIndex: "startDate",
        key: "startDate",
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
        <Content style={{ padding: "20px" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddDepartment}
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              marginBottom: "10px",
            }}
          >
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
                name="departmentName"
                label={
                  <span>
                    Phòng ban {" "}
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      onClick={() => setModalVisible(true)}
                      style={{ padding: 0, marginLeft: -5 }}
                    />
                  </span>
                }
                rules={[{ required: true, message: "Vui lòng chọn phòng ban!" }]}
                style={{ flex: 1 }}
              >
                <Select placeholder="Chọn phòng ban">
                  {departments.map((dept) => (
                    <Option key={dept.id} value={dept.departmentName}>
                      {dept.departmentName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
              <Form.Item
                name="position"
                label="Chức vụ"
                rules={[{ required: true, message: "Vui lòng nhập chức vụ!" }]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Chức vụ" />
              </Form.Item>
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
            </div>

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
              placeholder="Lọc theo phòng ban"
              value={filter}
              onChange={handleFilter}
              style={{ width: "150px" }}
            >
              <Option value="">Tất cả</Option>
              {[...new Set(departments.map((dept) => dept.departmentName))].map((deptName) => (
                <Option key={deptName} value={deptName}>
                  {deptName}
                </Option>
              ))}
            </Select>
          </Space>

          <Table
            columns={columns}
            dataSource={departments}
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

        
              <DepartmentModal
              visible={modalVisible}
              onCancel={() => setModalVisible(false)}
              departments={departments}
              setDepartments={setDepartments}
              loading={loading}
              setLoading={setLoading}
            />
          
        </Content>
      </Layout>
    );
  };

  export default DepartmentManagement;