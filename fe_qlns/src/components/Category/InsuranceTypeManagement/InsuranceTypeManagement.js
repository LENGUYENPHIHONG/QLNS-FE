import React, { useEffect, useState } from "react";
import {
    Layout, Form, Input, Button, Table, Space, Modal,Popconfirm, InputNumber, Row, Col
} from "antd";
import { toast } from 'react-toastify';
import {
    SearchOutlined, EditOutlined, DeleteOutlined
} from "@ant-design/icons";
import {
    fetchInsuranceTypes,
    createInsuranceType,
    updateInsuranceType,
    deleteInsuranceType,
    getNewInsuranceCode
} from "../../../api/insuranceApi"; // adjust path as needed

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
        } else {
            const lower = searchTerm.toLowerCase();
            setFilteredData(
                data.filter(item =>
                    item.insuranceCode.toLowerCase().includes(lower) ||
                    item.insuranceName.toLowerCase().includes(lower)
                )
            );
        }
    }, [searchTerm, data]);

    const generateNewCode = async () => {
        try {
            const res = await getNewInsuranceCode();
            if (res.data?.code) {
                form.setFieldsValue({ insuranceCode: res.data.code });
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response.data.Message);
        }
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetchInsuranceTypes();
            if (res.data?.Data) {
                const list = res.data.Data.map(item => ({
                    id: item.MALBH,
                    insuranceCode: item.MALBH,
                    insuranceName: item.TENLBH,
                    nvRate: item.NVDONG,
                    ctyRate: item.CTYDONG,
                    total: item.TONG
                }));
                setData(list);
                setFilteredData(list);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response.data.Message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async values => {
        setLoading(true);
        try {
            const payload = {
                MALBH: values.insuranceCode,
                TENLBH: values.insuranceName,
                NVDONG: values.nvRate,
                CTYDONG: values.ctyRate
            };
            const res = await createInsuranceType(payload);
            if (res.data?.Success) {
                toast.success(res.data?.Message);
                form.resetFields();
                await loadData();
                await generateNewCode();
            } else {
                toast.error(res.data?.Message || "Thêm thất bại.");
            }
        } catch (err) {
            toast.error(err.response.data.Message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = record => {
        setEditing(true);
        setEditingItem(record);
        editForm.setFieldsValue({
            insuranceCode: record.insuranceCode,
            insuranceName: record.insuranceName,
            nvRate: record.nvRate,
            ctyRate: record.ctyRate
        });
    };

    const handleUpdate = async () => {
        try {
            const values = await editForm.validateFields();
            const payload = {
                MALBH: editingItem.id,
                TENLBH: values.insuranceName,
                NVDONG: values.nvRate,
                CTYDONG: values.ctyRate
            };
            const res = await updateInsuranceType(payload);
            if (res.data?.Success) {
                toast.success(res.data?.Message);
                setEditing(false);
                await loadData();
            } else {
                toast.error(res.data?.Message || "Cập nhật thất bại.");
            }
        } catch (err) {
            toast.error(err.response.data.Message);
        }
    };

    const handleDelete = async id => {
        setLoading(true);
        try {
            const res = await deleteInsuranceType(id);
            if (res.data?.Success) {
                 toast.success(res.data?.Message);
                await loadData();
            } else {
                toast.error(res.data?.Message || "Xóa thất bại.");
            }
        } catch (err) {
            toast.error(err.response.data.Message);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: "Mã BH", dataIndex: "insuranceCode", key: "insuranceCode" },
        { title: "Tên BH", dataIndex: "insuranceName", key: "insuranceName" },
        { title: "NV đóng (%)", dataIndex: "nvRate", key: "nvRate" },
        { title: "CTY đóng (%)", dataIndex: "ctyRate", key: "ctyRate" },
        { title: "Tổng (%)", dataIndex: "total", key: "total" },
        {
            title: "Tùy chọn", key: "action",
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Layout style={{ background: "white", borderRadius: 8 }}>
            <Content style={{ padding: 20 }}>
                <Form form={form} layout="vertical" onFinish={handleAdd} onValuesChange={(changed, all) => {
                    if (changed.nvRate != null || changed.ctyRate != null) {
                        const nv = all.nvRate || 0;
                        const ct = all.ctyRate || 0;
                        form.setFieldsValue({ total: nv + ct });
                    }
                }}>
                    <Row gutter={16}>
                        <Col span={12}>
                        <Form.Item name="insuranceCode" label="Mã loại bảo hiểm" rules={[{ required: true }]}>
                            <Input disabled />
                        </Form.Item>
                        </Col>
                        <Col span={12}>
                        <Form.Item name="insuranceName" label="Tên loại bảo hiểm" rules={[{ required: true }]}>  
                            <Input />
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={6}>
                        <Form.Item name="nvRate" label="NV đóng (%)" rules={[{ required: true }]}>  
                            <InputNumber min={0} max={100} />
                        </Form.Item>
                        </Col>
                        <Col span={6}>
                        <Form.Item name="ctyRate" label="CTY đóng (%)" rules={[{ required: true }]}>  
                            <InputNumber min={0} max={100} />
                        </Form.Item>
                        </Col>
                        <Col span={6}>
                        <Form.Item name="total" label="Tổng (%)">
                            <InputNumber disabled />
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'right' }}>
                            <Button type="primary" htmlType="submit">
                                Thêm
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <Space style={{ marginBottom: 16 }}>
                    <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)} style={{ width: 300 }} />
                </Space>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                />

                <Modal title="Chỉnh sửa loại bảo hiểm" visible={editing} onCancel={() => setEditing(false)} onOk={handleUpdate} okText="Cập nhật">
                    <Form form={editForm} layout="vertical" onValuesChange={(changed, all) => {
                        if (changed.nvRate != null || changed.ctyRate != null) {
                            const nv = all.nvRate || 0;
                            const ct = all.ctyRate || 0;
                            editForm.setFieldsValue({ total: nv + ct });
                        }
                    }}>
                        <Form.Item name="insuranceCode" label="Mã loại bảo hiểm">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="insuranceName" label="Tên loại bảo hiểm" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="nvRate" label="NV đóng (%)" rules={[{ required: true }]}>  
                            <InputNumber min={0} max={100} />
                        </Form.Item>
                        <Form.Item name="ctyRate" label="CTY đóng (%)" rules={[{ required: true }]}>  
                            <InputNumber min={0} max={100} />
                        </Form.Item>
                        <Form.Item name="total" label="Tổng (%)">
                            <InputNumber disabled />
                        </Form.Item>
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};
export default InsuranceTypeManagement;