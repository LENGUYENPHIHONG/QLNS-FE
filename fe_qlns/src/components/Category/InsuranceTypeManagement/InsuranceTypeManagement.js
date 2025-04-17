import React, { useEffect, useState } from "react";
import {
    Layout, Form, Input, Button, Table, Space, Modal, message
} from "antd";
import {
    SearchOutlined, EditOutlined, DeleteOutlined
} from "@ant-design/icons";
import {
    fetchInsuranceTypes,
    createInsuranceType,
    updateInsuranceType,
    deleteInsuranceType,
    getNewInsuranceCode
} from "../../../api/insuranceApi"; // bạn cần tạo file này tương tự educationApi

const { Content } = Layout;

const InsuranceTypeManagement = () => {
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        loadData();
        generateNewCode();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredData(data);
            return;
        }
        const lower = searchTerm.toLowerCase();
        const filtered = data.filter(
            (item) =>
                item.insuranceCode.toLowerCase().includes(lower) ||
                item.insuranceName.toLowerCase().includes(lower)
        );
        setFilteredData(filtered);
    }, [searchTerm, data]);

    const generateNewCode = async () => {
        try {
            const res = await getNewInsuranceCode();
            if (res.data?.code) {
                form.setFieldsValue({ insuranceCode: res.data.code });
            }
        } catch {
            message.error("Không thể tạo mã mới.");
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetchInsuranceTypes();
            if (res.data?.Data && Array.isArray(res.data.Data)) {
                const list = res.data.Data.map((item) => ({
                    id: item.MALBH,
                    insuranceCode: item.MALBH,
                    insuranceName: item.TENLBH,
                }));
                setData(list);
                setFilteredData(list);
            } else {
                setData([]);
                setFilteredData([]);
                message.warning("Không có dữ liệu loại bảo hiểm.");
            }
        } catch {
            message.error("Lỗi khi tải dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (values) => {
        setLoading(true);
        try {
            const payload = {
                MALBH: values.insuranceCode,
                TENLBH: values.insuranceName,
            };
            const res = await createInsuranceType(payload);
            if (res.data?.Success) {
                message.success("Thêm thành công!");
                form.resetFields();
                await loadData();
                await generateNewCode();
            } else {
                message.error(res.data?.Message || "Thêm thất bại.");
            }
        } catch {
            message.error("Lỗi khi thêm.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setEditing(true);
        setEditingItem(record);
        editForm.setFieldsValue({
            insuranceCode: record.insuranceCode,
            insuranceName: record.insuranceName,
        });
    };

    const handleUpdate = async () => {
        try {
            const values = await editForm.validateFields();
            const payload = {
                MALBH: editingItem.id,
                TENLBH: values.insuranceName,
            };
            const res = await updateInsuranceType(payload);
            if (res.data?.Success) {
                message.success("Cập nhật thành công!");
                setEditing(false);
                await loadData();
            } else {
                message.error(res.data?.Message || "Cập nhật thất bại.");
            }
        } catch {
            message.error("Lỗi khi cập nhật.");
        }
    };

    const handleDelete = async (id) => {
        console.log("🔍 Gọi API xóa với id:", id);
        try {
            const res = await deleteInsuranceType(id);
            console.log("🔁 Kết quả xoá:", res.data);

            if (res.data?.Success) {
                message.success("Xóa thành công!");
                await loadData();
            } else {
                message.error(res.data?.Message || "Xóa thất bại.");
            }
        } catch (err) {
            console.error("❌ Lỗi xóa:", err);
            message.error("Lỗi khi xóa.");
        }
    };



    const columns = [
        {
            title: "Mã loại bảo hiểm",
            dataIndex: "insuranceCode",
            key: "insuranceCode",
        },
        {
            title: "Tên loại bảo hiểm",
            dataIndex: "insuranceName",
            key: "insuranceName",
        },
        {
            title: "Tùy chọn",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Sửa
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            console.log("✅ Đã nhấn XÓA, id:", record.id);
                            handleDelete(record.id);
                        }}
                    >
                        Xóa
                    </Button>

                </Space>
            ),
        },

    ];

    return (
        <Layout style={{ backgroundColor: "white", borderRadius: "8px" }}>
            <Content style={{ padding: "20px" }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAdd}
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
                            name="insuranceCode"
                            label="Mã loại bảo hiểm"
                            rules={[{ required: true, message: "Vui lòng nhập mã!" }]}
                            style={{ flex: 1 }}
                        >
                            <Input disabled placeholder="Mã loại bảo hiểm" />
                        </Form.Item>
                        <Form.Item
                            name="insuranceName"
                            label="Tên loại bảo hiểm"
                            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="Tên loại bảo hiểm" />
                        </Form.Item>
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

                <Space style={{ marginBottom: "20px", display: "flex" }}>
                    <Input
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        prefix={<SearchOutlined />}
                        style={{ width: "300px" }}
                    />
                </Space>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                />

                <Modal
                    title="Chỉnh sửa loại bảo hiểm"
                    open={editing}
                    onCancel={() => setEditing(false)}
                    onOk={handleUpdate}
                    okText="Cập nhật"
                >
                    <Form form={editForm} layout="vertical">
                        <Form.Item label="Mã loại bảo hiểm" name="insuranceCode">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label="Tên loại bảo hiểm"
                            name="insuranceName"
                            rules={[{ required: true, message: "Vui lòng nhập tên loại bảo hiểm!" }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};

export default InsuranceTypeManagement;
