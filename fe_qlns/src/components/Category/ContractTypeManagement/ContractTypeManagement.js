import React, { useState } from "react";
import { Layout, Form, Input, Button, Select, Table, Space, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Option } = Select;

const ContractTypeManagement = () => {
    const [form] = Form.useForm();
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("");
    const [contractTypes, setContractTypes] = useState([]); // Mảng rỗng, sẽ lấy dữ liệu từ API sau
    const [loading, setLoading] = useState(false);

    // Xử lý tìm kiếm
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        filterData(term, filter);
    };

    // Xử lý lọc theo thời hạn hợp đồng
    const handleFilter = (value) => {
        setFilter(value);
        filterData(searchTerm, value);
    };

    // Hàm lọc dữ liệu
    const filterData = (term, duration) => {
        let filtered = [...contractTypes]; // Sử dụng dữ liệu gốc để lọc

        // Lọc theo từ khóa tìm kiếm
        if (term) {
            filtered = filtered.filter(
                (contractType) =>
                    (contractType.contractTypeCode && contractType.contractTypeCode.toLowerCase().includes(term)) ||
                    (contractType.contractTypeName && contractType.contractTypeName.toLowerCase().includes(term))
            );
        }

        // Lọc theo thời hạn hợp đồng
        if (duration) {
            filtered = filtered.filter((contractType) => contractType.duration === duration);
        }

        setContractTypes(filtered);
    };

    // Xử lý thêm loại hợp đồng
    const handleAddContractType = (values) => {
        setLoading(true);
        setTimeout(() => {
            const newContractType = {
                id: Date.now(),
                contractTypeCode: values.contractTypeCode,
                contractTypeName: values.contractTypeName,
                duration: values.duration,
            };
            setContractTypes([...contractTypes, newContractType]);
            message.success("Thêm loại hợp đồng thành công!");
            form.resetFields(); // Reset form sau khi thêm
            setLoading(false);
        }, 1000);
    };

    // Xử lý xóa loại hợp đồng
    const handleDelete = (id) => {
        setLoading(true);
        setTimeout(() => {
            setContractTypes(contractTypes.filter((contractType) => contractType.id !== id));
            message.success("Xóa loại hợp đồng thành công!");
            setLoading(false);
        }, 1000);
    };

    // Xử lý chỉnh sửa loại hợp đồng (giả lập)
    const handleEdit = (id) => {
        console.log("Chỉnh sửa loại hợp đồng:", id);
    };

    // Cấu hình cột cho bảng
    const columns = [
        {
            title: "Mã loại hợp đồng",
            dataIndex: "contractTypeCode",
            key: "contractTypeCode",
        },
        {
            title: "Tên loại hợp đồng",
            dataIndex: "contractTypeName",
            key: "contractTypeName",
        },
        {
            title: "Thời hạn hợp đồng",
            dataIndex: "duration",
            key: "duration",
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

    // Danh sách thời hạn hợp đồng duy nhất để lọc
    const uniqueDurations = [...new Set(contractTypes.map((contractType) => contractType.duration))];

    return (
        <Layout style={{ backgroundColor: "white", margin: "0px", borderRadius: "8px" }}>
            {/* Nội dung chính */}
            <Content style={{ padding: "20px" }}>
                {/* Thanh tìm kiếm và lọc */}

                {/* Form thêm loại hợp đồng */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddContractType}
                    style={{
                        backgroundColor: "#fff",
                        padding: "20px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        marginBottom: "20px",
                    }}
                >
                    {/* Hàng 1: Mã loại hợp đồng, Tên loại hợp đồng */}
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
                        <Form.Item
                            name="contractTypeCode"
                            label="Mã loại hợp đồng"
                            rules={[{ required: true, message: "Vui lòng nhập mã loại hợp đồng!" }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Nhập mã loại hợp đồng" />
                        </Form.Item>
                        <Form.Item
                            name="contractTypeName"
                            label="Tên loại hợp đồng"
                            rules={[{ required: true, message: "Vui lòng nhập tên loại hợp đồng!" }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Nhập tên loại hợp đồng" />
                        </Form.Item>
                    </div>

                    {/* Hàng 2: Thời hạn hợp đồng và Nút Thêm */}
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-end", width: "30%" }}>
                        <Form.Item
                            name="duration"
                            label="Thời hạn hợp đồng"
                            rules={[{ required: true, message: "Vui lòng nhập thời hạn hợp đồng!" }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Nhập thời hạn hợp đồng (ví dụ: 1 năm)" />
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
                        placeholder="Tìm kiếm loại hợp đồng"
                        value={searchTerm}
                        onChange={handleSearch}
                        prefix={<SearchOutlined style={{ color: "#007bff" }} />}
                        style={{ width: "300px" }}
                    />
                    <Select
                        placeholder="Lọc theo thời hạn hợp đồng"
                        value={filter}
                        onChange={handleFilter}
                        style={{ width: "150px" }}
                    >
                        <Option value="">Tất cả</Option>
                        {uniqueDurations.map((duration, index) => (
                            <Option key={index} value={duration}>
                                {duration}
                            </Option>
                        ))}
                    </Select>
                </Space>
                {/* Bảng dữ liệu */}
                <Table
                    columns={columns}
                    dataSource={contractTypes}
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

export default ContractTypeManagement;