import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Space, Table, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getNewDepartmentCode,
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../../api/departmentModalApi"; // Đảm bảo file này có các hàm API

import { toast } from 'react-toastify';

const DepartmentModal = ({ visible, onCancel }) => {
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState(null);

  // Load danh sách phòng ban khi mở modal
  useEffect(() => {
    if (visible) {
      loadDepartments();
      form.resetFields();
      getNewCode();
    }
  }, [visible]);

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const res = await fetchDepartments();
      setDepartments(res.data.Data);
    } catch (err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  const getNewCode = async () => {
    try {
      const res = await getNewDepartmentCode();
      form.setFieldsValue({ departmentCode: res.data.code });
    } catch {
      toast.warning("Không thể lấy mã phòng ban mới");
    }
  };

  // Thêm mới hoặc cập nhật
  const handleSubmit = async (values) => {
    setLoading(true);
    const data = {
      MAPB: values.departmentCode,
      TENPB: values.departmentName,
    };

    try {
      if (editingKey) {
        var res = await updateDepartment(data);
        toast.success(res.data?.Message);
      } else {
        var res = await createDepartment(data);
        toast.success(res.data?.Message);
      }
      await loadDepartments();
      form.resetFields();
      setEditingKey(null);
      getNewCode();
    } catch (err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingKey(record.MAPB);
    form.setFieldsValue({
      departmentCode: record.MAPB,
      departmentName: record.TENPB,
    });
  };

  const handleDelete = async (record) => {
    setLoading(true);
    try {
      var res = await deleteDepartment({ MAPB: record.MAPB });
      toast.success(res.data?.Message);
      await loadDepartments();
    } catch (err) {
      toast.error(err?.response?.data?.Message || "Lỗi khi xóa");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã phòng ban",
      dataIndex: "MAPB",
      key: "MAPB",
    },
    {
      title: "Tên phòng ban",
      dataIndex: "TENPB",
      key: "TENPB",
    },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Quản lý phòng ban"
      open={visible}
      onCancel={() => {
        onCancel();
        setEditingKey(null);
        form.resetFields();
      }}
      footer={null}
      width={900}
      style={{ left: 70 }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item
            name="departmentCode"
            label="Mã phòng ban"
            rules={[{ required: true, message: "Vui lòng nhập mã phòng ban!" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Mã phòng ban" disabled />
          </Form.Item>
          <Form.Item
            name="departmentName"
            label="Tên phòng ban"
            rules={[{ required: true, message: "Vui lòng nhập tên phòng ban!" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Tên phòng ban" />
          </Form.Item>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-8px" }}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#3e0fe6" }}
            >
              {editingKey ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </div>
      </Form>

      <Table
        columns={columns}
        dataSource={departments}
        rowKey="MAPB"
        loading={loading}
        pagination={false}
        scroll={{ x: true }}
        locale={{ emptyText: "Không có dữ liệu" }}
        style={{ marginTop: 20 }}
      />
    </Modal>
  );
};

export default DepartmentModal;
