import React, { useState } from "react";
import { Layout, Form, Input, Button, Select, Table, Space, message, DatePicker, Modal } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Option } = Select;

const ContractManagement = () => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [contracts, setContracts] = useState([]); // Mảng rỗng, sẽ lấy dữ liệu từ API sau
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterData(term, filter);
  };

  // Xử lý lọc theo loại hợp đồng
  const handleFilter = (value) => {
    setFilter(value);
    filterData(searchTerm, value);
  };

  // Hàm lọc dữ liệu
  const filterData = (term, contractType) => {
    let filtered = [...contracts]; // Sử dụng dữ liệu gốc để lọc

    // Lọc theo từ khóa tìm kiếm
    if (term) {
      filtered = filtered.filter(
        (contract) =>
          (contract.contractCode && contract.contractCode.toLowerCase().includes(term)) ||
          (contract.employeeName && contract.employeeName.toLowerCase().includes(term)) ||
          (contract.contractName && contract.contractName.toLowerCase().includes(term))
      );
    }

    // Lọc theo loại hợp đồng
    if (contractType) {
      filtered = filtered.filter((contract) => contract.contractType === contractType);
    }

    setContracts(filtered);
  };

  // Mở/đóng modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Xử lý thêm hợp đồng
  const handleAddContract = (values) => {
    setLoading(true);
    setTimeout(() => {
      const newContract = {
        id: Date.now(),
        contractCode: `HD${Date.now().toString().slice(-6)}`,
        employeeName: values.employeeName,
        contractType: values.contractType,
        contractName: `${values.contractType} - ${values.employeeName}`,
        effectiveDate: values.effectiveDate ? values.effectiveDate.format("YYYY-MM-DD") : null,
        status: "Hiệu lực",
        endDate: "",
      };
      setContracts([...contracts, newContract]);
      message.success("Thêm hợp đồng thành công!");
      closeModal();
      setLoading(false);
    }, 1000);
  };

  // Xử lý xóa hợp đồng
  const handleDelete = (id) => {
    setLoading(true);
    setTimeout(() => {
      setContracts(contracts.filter((contract) => contract.id !== id));
      message.success("Xóa hợp đồng thành công!");
      setLoading(false);
    }, 1000);
  };

  // Xử lý chỉnh sửa hợp đồng (giả lập)
  const handleEdit = (id) => {
    console.log("Chỉnh sửa hợp đồng:", id);
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Mã hợp đồng",
      dataIndex: "contractCode",
      key: "contractCode",
    },
    {
      title: "Tên nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Tên hợp đồng",
      dataIndex: "contractName",
      key: "contractName",
    },
    {
      title: "Hiệu lực từ",
      dataIndex: "effectiveDate",
      key: "effectiveDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
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

  // Danh sách loại hợp đồng duy nhất để lọc
  const uniqueContractTypes = [...new Set(contracts.map((contract) => contract.contractType))];

  // Danh sách nhân viên giả lập (sẽ thay bằng API sau)
  const employees = [
    { id: 1, name: "Nhân viên 1" },
    { id: 2, name: "Nhân viên 2" },
    { id: 3, name: "Nhân viên 3" },
  ];

  // Danh sách loại hợp đồng giả lập (sẽ thay bằng API sau)
  const contractTypes = [
    "Hợp đồng lao động",
    "Hợp đồng thử việc",
    "Hợp đồng thời vụ",
  ];

  return (
    <Layout style={{ backgroundColor: "white", margin: "0px", borderRadius: "8px" }}>
      {/* Nội dung chính */}
      <Content style={{ padding: "20px" }}>
        {/* Thanh tìm kiếm, lọc và nút Thêm */}
        <Space style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
          <Input
            placeholder="Tìm kiếm hợp đồng"
            value={searchTerm}
            onChange={handleSearch}
            prefix={<SearchOutlined style={{ color: "#007bff" }} />}
            style={{ width: "300px" }}
          />
          <Select
            placeholder="Lọc theo loại hợp đồng"
            value={filter}
            onChange={handleFilter}
            style={{ width: "150px" }}
          >
            <Option value="">Tất cả</Option>
            {uniqueContractTypes.map((type, index) => (
              <Option key={index} value={type}>
                {type}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            style={{ backgroundColor: "#3e0fe6", borderColor: "#3e0fe6" }}
            onClick={openModal}
          >
            Thêm hợp đồng
          </Button>
        </Space>

        {/* Bảng dữ liệu */}
        <Table
          columns={columns}
          dataSource={contracts}
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

        {/* Modal thêm hợp đồng */}
        <Modal
          title="Thêm hợp đồng mới"
          visible={isModalOpen}
          onCancel={closeModal}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddContract}
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Hàng 1: Tên nhân viên, Loại hợp đồng, Hiệu lực từ ngày */}
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
              <Form.Item
                name="employeeName"
                label="Tên nhân viên"
                rules={[{ required: true, message: "Vui lòng chọn nhân viên!" }]}
                style={{ flex: 1 }}
              >
                <Select placeholder="Chọn nhân viên">
                  {employees.map((employee) => (
                    <Option key={employee.id} value={employee.name}>
                      {employee.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="contractType"
                label="Loại hợp đồng"
                rules={[{ required: true, message: "Vui lòng chọn loại hợp đồng!" }]}
                style={{ flex: 1 }}
              >
                <Select placeholder="Chọn loại hợp đồng">
                  {contractTypes.map((type, index) => (
                    <Option key={index} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="effectiveDate"
                label="Hiệu lực từ ngày"
                rules={[{ required: true, message: "Vui lòng chọn ngày hiệu lực!" }]}
                style={{ flex: 1 }}
              >
                <DatePicker
                  placeholder="Chọn ngày hiệu lực"
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </div>

            {/* Nút Thêm */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: "#3e0fe6", borderColor: "#3e0fe6" }}
                  loading={loading}
                >
                  Thêm
                </Button>
                <Button onClick={closeModal}>Hủy</Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ContractManagement;