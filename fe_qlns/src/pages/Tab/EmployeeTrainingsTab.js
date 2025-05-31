// File: src/pages/EmployeePage/EmployeeTrainingsTab.js
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  Upload,
} from "antd";

import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  FilePdfOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  fetchEmployeeTrainings,
  createEmployeeTraining,
  updateEmployeeTraining,
  deleteEmployeeTraining,
  uploadTrainingFile,
} from "../../api/employeeTrainingApi";
import { fetchTrainings } from "../../api/trainingApi";

const { Option } = Select;

export default function EmployeeTrainingsTab({ employeeId }) {
  const [data, setData] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Modal create/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // Modal upload
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(null);

  useEffect(() => {
    fetchTrainings()
      .then(res => res.data?.Data && setTypes(res.data.Data))
      .catch(() => toast.error("Lỗi tải danh sách khóa đào tạo"));
  }, []);

  useEffect(() => {
    if (employeeId) loadData();
  }, [employeeId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchEmployeeTrainings({ manv: employeeId });
      if (res.data?.Success) setData(res.data.Data || []);
      else toast.error(res.data?.Message || "Lỗi tải dữ liệu đào tạo");
    } catch {
      toast.error("Lỗi tải dữ liệu đào tạo");
    } finally {
      setLoading(false);
    }
  };

  const openModal = record => {
    setEditingRecord(record || null);
    if (record) {
      form.setFieldsValue({
        MADT: record.MADT,
        NGAYHOANTHANH: record.NGAYHOANTHANH && dayjs(record.NGAYHOANTHANH),
        GHICHU: record.GHICHU,
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // Hàm onFinish theo đúng yêu cầu của bạn:
  async function onFinish(values) {
    setLoading(true);
    try {
      const payload = {
        Id: editingRecord?.Id,
        MANV: employeeId,
        MADT: values.MADT,
        NGAYHOANTHANH: values.NGAYHOANTHANH?.format("YYYY-MM-DD"),
        GHICHU: values.GHICHU,
        TRANGTHAI: ""
      };
      let res;
      if (editingRecord) {
        res = await updateEmployeeTraining(payload);
        toast.success(res.data?.Message);
      } else {
        res = await createEmployeeTraining(payload);
        toast.success(res.data?.Message);
      }
      // Đóng modal và load lại dữ liệu
      setIsModalOpen(false);
      setEditingRecord(null);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.Message || "Lỗi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async id => {
    setLoading(true);
    try {
      const res = await deleteEmployeeTraining(id);
      if (res.data?.Success) {
        toast.success(res.data.Message);
        await loadData();
      } else {
        toast.error(res.data.Message);
      }
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  const openUpload = record => {
    setCurrentRecord(record);
    setUploadFiles([]);
    setIsUploadOpen(true);
  };

  const handleUpload = async () => {
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
      const res = await uploadTrainingFile(currentRecord.Id, fd);
      toast.success(res.data.Message);
      setIsUploadOpen(false);
      setCurrentRecord(null);
      await loadData();
    } catch {
      toast.error("Upload thất bại");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Mã CT", dataIndex: "Id", key: "Id" },
    { title: "Khóa ĐT", dataIndex: "TENDT", key: "TENDT" },
    {
      title: "Ngày HT",
      dataIndex: "NGAYHOANTHANH",
      key: "NGAYHOANTHANH",
      render: d => (d ? dayjs(d).format("YYYY-MM-DD") : "—"),
    },
    {
      title: "File PDF",
      dataIndex: "ANH",
      key: "ANH",
      render: url =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            <FilePdfOutlined />
          </a>
        ) : (
          "—"
        ),
    },
    {
      title: "Tùy chọn",
      key: "actions",
      fixed: "right",
      width: 200,
      render: (_, rec) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(rec)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(rec.Id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger>
              Xóa
            </Button>
          </Popconfirm>
          <Button icon={<UploadOutlined />} onClick={() => openUpload(rec)}>
            Upload
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
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
          Thêm đào tạo
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data.filter(i =>
          Object.values(i)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        )}
        rowKey="Id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />

      {/* Modal tạo/sửa */}
      <Modal
        title={editingRecord ? "Cập nhật đào tạo" : "Thêm đào tạo"}
        visible={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingRecord ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal upload PDF */}
      <Modal
        title="Upload PDF đào tạo"
        visible={isUploadOpen}
        onCancel={() => {
          setIsUploadOpen(false);
          setCurrentRecord(null);
        }}
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
    </>
  );
}
