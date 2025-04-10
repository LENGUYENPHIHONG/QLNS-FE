import React, { useState } from "react";
import { Layout, Form, Input, Button, Select, Table, Space, message, DatePicker } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment"; // Để xử lý ngày tháng

const { Content } = Layout;
const { Option } = Select;

const DegreeManagement = () => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [degrees, setDegrees] = useState([]); // Danh sách bằng cấp
  const [loading, setLoading] = useState(false);

  // Xử lý thêm bằng cấp
  const handleAddDegree = (values) => {
    setLoading(true);
    setTimeout(() => {
      const newDegree = {
        id: Date.now(),
        employeeName: values.employeeName,
        degreeName: values.degreeName,
        issuedBy: values.issuedBy,
        issuedDate: values.issuedDate ? values.issuedDate.format("YYYY-MM-DD") : null, // Định dạng ngày
        status: values.status,
      };
      setDegrees([...degrees, newDegree]);
      message.success("Thêm bằng cấp thành công!");
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    const filtered = degrees.filter(
      (degree) =>
        degree.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        degree.degreeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        degree.issuedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDegrees(filtered);
    console.log("Tìm kiếm với:", searchTerm);
  };

  // Xử lý lọc theo trạng thái
  const handleFilter = (value) => {
    setFilter(value);
    if (value) {
      const filtered = degrees.filter((degree) => degree.status === value);
      setDegrees(filtered);
    } else {
      setDegrees(degrees); // Reset lại danh sách nếu không lọc
    }
    console.log("Lọc với:", value);
  };

  // Xử lý xóa bằng cấp
  const handleDelete = (id) => {
    setLoading(true);
    setTimeout(() => {
      setDegrees(degrees.filter((degree) => degree.id !== id));
      message.success("Xóa bằng cấp thành công!");
      setLoading(false);
    }, 1000);
  };

  // Xử lý chỉnh sửa bằng cấp (giả lập)
  const handleEdit = (id) => {
    console.log("Chỉnh sửa bằng cấp:", id);
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Tên nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Tên bằng cấp",
      dataIndex: "degreeName",
      key: "degreeName",
    },
    {
      title: "Nơi cấp",
      dataIndex: "issuedBy",
      key: "issuedBy",
    },
    {
      title: "Ngày cấp",
      dataIndex: "issuedDate",
      key: "issuedDate",
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
          onFinish={handleAddDegree}
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            marginBottom: "10px",
          }}
        >
          {/* Hàng 1: Tên nhân viên và Bằng cấp */}
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
              name="degreeName"
              label="Bằng cấp"
              rules={[{ required: true, message: "Vui lòng nhập tên bằng cấp!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Tên bằng cấp" />
            </Form.Item>
          </div>

          {/* Hàng 2: Nơi cấp */}
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
            <Form.Item
              name="issuedBy"
              label="Nơi cấp"
              rules={[{ required: true, message: "Vui lòng nhập nơi cấp!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Nơi cấp" />
            </Form.Item>
          </div>

          {/* Hàng 3: Ngày cấp và Trạng thái */}
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
            <Form.Item
              name="issuedDate"
              label="Ngày cấp"
              rules={[{ required: true, message: "Vui lòng chọn ngày cấp!" }]}
              style={{ flex: 1 }}
            >
              <DatePicker
                placeholder="Chọn ngày cấp"
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
              />
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="Còn hiệu lực">Còn hiệu lực</Option>
                <Option value="Hết hiệu lực">Hết hiệu lực</Option>
              </Select>
            </Form.Item>
          </div>
          {/* Hàng 4: Nút Thêm (căn phải) */}
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
            placeholder="Lọc theo trạng thái"
            value={filter}
            onChange={handleFilter}
            style={{ width: "150px" }}
          >
            <Option value="">Tất cả</Option>
            <Option value="Còn hiệu lực">Còn hiệu lực</Option>
            <Option value="Hết hiệu lực">Hết hiệu lực</Option>
          </Select>
        </Space>

        {/* Bảng dữ liệu */}
        <Table
          columns={columns}
          dataSource={degrees}
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

export default DegreeManagement;