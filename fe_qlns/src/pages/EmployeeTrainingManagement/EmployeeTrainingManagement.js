import React, { useState, useEffect } from "react";
import {
    Layout, Form, Input, Button, Table, Space,
    Modal, Popconfirm, Select, DatePicker, Upload, Tag
} from "antd";
import {
    SearchOutlined, EditOutlined, DeleteOutlined,
    UploadOutlined, FilePdfOutlined, PlusOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from 'react-toastify';
import {
    fetchEmployeeTrainings,
    createEmployeeTraining,
    updateEmployeeTraining,
    deleteEmployeeTraining,
    uploadTrainingFile
} from "../../api/employeeTrainingApi";
import { fetchEmployees } from "../../api/employeeApi";
import { fetchTrainings } from "../../api/trainingApi"; // lấy API đúng cho loại đào tạo

const { Content } = Layout;
const { Option } = Select;

export default function EmployeeTrainingManagement() {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [emps, setEmps] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [uploadModal, setUploadModal] = useState(false);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [currentRecord, setCurrentRecord] = useState(null);


    useEffect(() => {
        loadData();
        loadRefs();
    }, []);

    async function loadRefs() {
        try {
            const [eRes, tRes] = await Promise.all([
                fetchEmployees(),
                fetchTrainings()
            ]);
            if (eRes.data?.Data) setEmps(eRes.data.Data);
            if (tRes.data?.Data) setTypes(tRes.data.Data);
            
        } catch {
            toast.error("Lỗi khi tải danh sách nhân viên/khóa đào tạo");
        }
    }

    async function loadData() {
        setLoading(true);
        try {
            const res = await fetchEmployeeTrainings();
            if (res.data?.Success) setData(res.data.Data);
        } catch {
            toast.error("Lỗi khi tải dữ liệu Đào tạo NV");
        } finally {
            setLoading(false);
        }
    }

    function openModal(record) {
        setEditingRecord(record || null);
        if (record) {
            form.setFieldsValue({
                MANV: record.MANV,
                MADT: record.MADT,
                NGAYHOANTHANH: record.NGAYHOANTHANH && dayjs(record.NGAYHOANTHANH),
                GHICHU: record.GHICHU
            });
        } else {
            form.resetFields();
        }
        setModalVisible(true);
    }

    async function onFinish(values) {
        setLoading(true);
        //console.log(values);
        try {
            const payload = {
                Id: editingRecord?.Id,
                MANV: values.MANV,
                MADT: values.MADT,
                NGAYHOANTHANH: values.NGAYHOANTHANH?.format("YYYY-MM-DD"),
                GHICHU: values.GHICHU,
                TRANGTHAI: ""
            };
             //console.log(payload);
            if (editingRecord) {
                var res = await updateEmployeeTraining(payload);
                toast.success(res.data?.Message);
            } else {
                var res = await createEmployeeTraining(payload);
                toast.success(res.data?.Message);
            }
            setModalVisible(false);
            await loadData();
        } catch (err) {
            toast.error(err.response?.data?.Message || "Lỗi lưu dữ liệu");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        setLoading(true);
        try {
            var res = await deleteEmployeeTraining(id);
            toast.success(res.data?.Message);
            await loadData();
        } catch {
            toast.error("Xóa thất bại");
        } finally {
            setLoading(false);
        }
    }

    function openUpload(record) {
        setCurrentRecord(record);
        setUploadFiles([]);
        setUploadModal(true);
    }

    async function handleUpload() {
    if (!uploadFiles.length) {
        toast.warning("Chọn file PDF");
        return;
    }

    const file = uploadFiles[0].originFileObj;
    if (file.type !== "application/pdf") {
        toast.error("Chỉ hỗ trợ file PDF");
        return;
    }

    const fd = new FormData();
    fd.append("AnhFile", file);

    setLoading(true);
    try {
       // Dùng đúng Id của record và chỉ truyền FormData có file
       const res = await uploadTrainingFile(currentRecord.Id, fd);

        toast.success(res.data?.Message);
        setUploadModal(false);
        await loadData();
    } catch {
        toast.error("Upload thất bại");
    } finally {
        setLoading(false);
    }
}

    const columns = [
        { title: "Mã CT", dataIndex: "Id", key: "Id" },
        { title: "Mã NV", dataIndex: "MANV", key: "MANV" },
        { title: "Tên NV", dataIndex: "TENNV", key: "TENNV" },
        { title: "Mã ĐT", dataIndex: "MADT", key: "MADT" },
        { title: "Tên ĐT", dataIndex: "TENDT", key: "TENDT" },
        {
            title: "Ngày HT",
            dataIndex: "NGAYHOANTHANH",
            key: "NGAYHOANTHANH",
            render: d => d ? dayjs(d).format("YYYY-MM-DD") : "—"
        },
        {
            title: "Trạng thái", dataIndex: "TRANGTHAI", key: "TRANGTHAI",
            render: st => <Tag color={st === "Hoàn thành" ? "green" : "default"}>{st}</Tag>
        },
        { title: "Ghi chú", dataIndex: "GHICHU", key: "GHICHU" },
        {
            title: "File PDF", dataIndex: "ANH", key: "ANH",
            render: url => url
                ? <a href={`${url}?t=${Date.now()}`} target="_blank" rel="noopener noreferrer"><FilePdfOutlined /></a>
                : "—"
        },
        {
            title: "Tùy chọn", key: "actions",
            render: (_, rec) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openModal(rec)}>Sửa</Button>
                    <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(rec.Id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
                    <Button icon={<UploadOutlined />} onClick={() => openUpload(rec)}>Upload PDF</Button>
                </Space>
            )
        }
    ];

    return (
        <Layout style={{ background: "#fff" }}>
            <Content style={{ padding: 20 }}>
                <Space style={{ marginBottom: 16 }}>
                    <Input
                        allowClear
                        placeholder="Tìm kiếm..."
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 240 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal(null)}>
                        Tạo mới
                    </Button>
                </Space>

                <Table
                    columns={columns}
                    dataSource={data.filter(i =>
                        Object.values(i).join(" ").toLowerCase().includes(search.toLowerCase())
                    )}
                    rowKey="Id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />

                {/* Modal Tạo / Sửa */}
                <Modal
                    title={editingRecord ? "Cập nhật đào tạo NV" : "Tạo đào tạo NV"}
                    visible={modalVisible}
                    footer={null}
                    onCancel={() => setModalVisible(false)}
                >
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            name="MANV"
                            label="Tên nhân viên"
                            rules={[{ required: true, message: "Chọn tên nhân viên" }]}
                        >
                            <Select
                                showSearch
                                placeholder="Chọn tên nhân viên"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                                style={{ width: "100%" }}
                            >
                                {emps.map(e => (
                                    <Option key={e.MANV} value={e.MANV}>
                                        {e.TENNV}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="MADT"
                            label="Khóa đào tạo"
                            rules={[{ required: true, message: "Chọn khóa đào tạo" }]}
                        >
                            <Select placeholder="Chọn khóa đào tạo">
                                {types.map(t => (
                                    <Option key={t.MADT} value={t.MADT}>
                                        {t.TENDAOTAO}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="NGAYHOANTHANH" label="Ngày hoàn thành">
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name="GHICHU" label="Ghi chú">
                            <Input.TextArea rows={3} />
                        </Form.Item>
                        <Form.Item style={{ textAlign: "right" }}>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingRecord ? "Cập nhật" : "Tạo mới"}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* Modal Upload PDF */}
                <Modal
                    title="Upload PDF đào tạo"
                    visible={uploadModal}
                    onCancel={() => setUploadModal(false)}
                    onOk={handleUpload}
                >
                    <Upload
                        fileList={uploadFiles}
                        beforeUpload={() => false}
                        onChange={({ fileList }) => setUploadFiles(fileList)}
                        accept=".pdf"
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>Chọn file PDF</Button>
                    </Upload>
                </Modal>
            </Content>
        </Layout>
    );
}