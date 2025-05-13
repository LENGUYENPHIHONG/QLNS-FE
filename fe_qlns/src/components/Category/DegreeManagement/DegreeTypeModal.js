import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Table, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
// API
import {
  getNewDegreeTypeCode,
  fetchDegreeTypes,
  createDegreeType,
  updateDegreeType,
  deleteDegreeType
} from "../../../api/degreeTypeModalApi";
import { toast } from 'react-toastify';
const DegreeTypeModal = ({ visible, onCancel, onTypesChange }) => {
  const [form] = Form.useForm();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState(null);

  useEffect(() => {
    if (visible) {
      loadTypes();
      form.resetFields();
      getNewCode();
    }
  }, [visible]);

  const loadTypes = async () => {
    setLoading(true);
    try {
      const res = await fetchDegreeTypes();
      setTypes(res.data.Data);
      onTypesChange(res.data.Data);
    } catch {
      toast.error("Không thể tải loại bằng cấp");
    } finally {
      setLoading(false);
    }
  };

  const getNewCode = async () => {
    try {
      const res = await getNewDegreeTypeCode();
      form.setFieldsValue({ degreeTypeCode: res.data.code });
    } catch {
      toast.warning("Lấy mã mới thất bại");
    }
  };

  const handleSubmit = async values => {
    setLoading(true);
    const payload = { MALBC: values.degreeTypeCode, LOAIBC: values.degreeTypeName };
    try {
      if (editingKey) {
        var res = await updateDegreeType(payload);
        toast.success(res.data?.Message);
      } else {
        var res = await createDegreeType(payload);
        toast.success(res.data?.Message);
      }
      loadTypes();
      form.resetFields();
      setEditingKey(null);
      getNewCode();
    } catch(err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = record => {
    setEditingKey(record.MALBC);
    form.setFieldsValue({
      degreeTypeCode: record.MALBC,
      degreeTypeName: record.LOAIBC
    });
  };

  const handleDelete = async record => {
    setLoading(true);
    try {
      var res = await deleteDegreeType(record.MALBC);
      toast.success(res.data?.Message);
      loadTypes();
    } catch(err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Mã loại bằng cấp", dataIndex: "MALBC", key: "MALBC" },
    { title: "Tên loại bằng cấp", dataIndex: "LOAIBC", key: "LOAIBC" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Có"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Modal
      title="Quản lý loại bằng cấp"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form form={form} layout="inline" onFinish={handleSubmit} style={{ marginBottom: 16 }}>
        <Form.Item name="degreeTypeCode" label="Mã LBC">
          <Input disabled style={{ width: 150 }} />
        </Form.Item>
        <Form.Item name="degreeTypeName" label="Tên LBC" rules={[{ required: true }]}
          style={{ flex: 1 }}>
          <Input placeholder="Tên loại bằng cấp" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editingKey ? "Cập nhật" : "Thêm"}
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={types} rowKey="MALBC" loading={loading} pagination={false} />
    </Modal>
  );
};

export default DegreeTypeModal;
