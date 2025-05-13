import React, { useState, useEffect } from "react";
import {
  Layout, Form, Input, Button, Table, Space, Modal, Popconfirm
} from "antd";
import {
  SearchOutlined, EditOutlined, DeleteOutlined
} from "@ant-design/icons";
import {
  fetchSpecializations,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization,
  getNewCode
} from "../../../api/specializationApi";
import { toast } from 'react-toastify';
const { Content } = Layout;

const SpecializationManagement = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [specializations, setSpecializations] = useState([]);
  const [filteredSpecializations, setFilteredSpecializations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadSpecializations();
    generateNewCode();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredSpecializations(specializations);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = specializations.filter(
      (item) =>
        item.specializationCode.toLowerCase().includes(lower) ||
        item.specializationName.toLowerCase().includes(lower)
    );
    setFilteredSpecializations(filtered);
  }, [searchTerm, specializations]);

  const generateNewCode = async () => {
    try {
      const codeRes = await getNewCode();
      if (codeRes.data?.code) {
        form.setFieldsValue({ specializationCode: codeRes.data.code });
      }
    } catch (err) {
      toast.error(err.response.data.Message);
    }
  };

  const loadSpecializations = async () => {
    setLoading(true);
    try {
      const res = await fetchSpecializations();
      if (res.data?.Data && Array.isArray(res.data.Data)) {
        const list = res.data.Data.map((item) => ({
          id: item.MACM,
          specializationCode: item.MACM,
          specializationName: item.TENCM,
        }));
        setSpecializations(list);
        setFilteredSpecializations(list);
      } else {
        setSpecializations([]);
        setFilteredSpecializations([]);
        toast.warning("Không có dữ liệu.");
      }
    } catch (err) {
      toast.error("Lỗi khi tải danh sách chuyên môn.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpecialization = async (values) => {
    setLoading(true);
    try {
      const data = {
        MACM: values.specializationCode,
        TENCM: values.specializationName,
      };
      const res = await createSpecialization(data);
      if (res.data?.Success) {
        toast.success(res.data?.Message);
        form.resetFields();
        await loadSpecializations();
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

  const handleEdit = (record) => {
    setEditing(true);
    setEditingItem(record);
    editForm.setFieldsValue({
      specializationCode: record.specializationCode,
      specializationName: record.specializationName,
    });
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      const payload = {
        MACM: editingItem.id,
        TENCM: values.specializationName,
      };
      const res = await updateSpecialization(payload);
      if (res.data?.Success || res.data?.MA) {
        toast.success(res.data?.Success);
        setEditing(false);
        await loadSpecializations();
      } else {
        toast.error(res.data?.Success || "Cập nhật thất bại.");
      }
    } catch (err) {
      toast.error("Lỗi khi cập nhật.");
    }
  };

  const handleDelete = async (id) => {
    const newList = specializations.filter((item) => item.id !== id);
    setSpecializations(newList);
    try {
      const res = await deleteSpecialization(id);
      if (res.data?.Success) {
        toast.success(res.data?.Message);
      } else {
        toast.error(res.data?.Message || "Xóa thất bại.");
        await loadSpecializations();
      }
    } catch (err) {
      toast.error("Lỗi khi xóa.");
      await loadSpecializations();
    }
  };

  const columns = [
    {
      title: "Mã chuyên môn",
      dataIndex: "specializationCode",
      key: "specializationCode",
    },
    {
      title: "Tên chuyên môn",
      dataIndex: "specializationName",
      key: "specializationName",
    },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
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
    <Layout style={{ backgroundColor: "white", borderRadius: "8px" }}>
      <Content style={{ padding: "20px" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddSpecialization}
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
              name="specializationCode"
              label="Mã chuyên môn"
              rules={[{ required: true, message: "Nhập mã chuyên môn!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Mã chuyên môn" readOnly />
            </Form.Item>
            <Form.Item
              name="specializationName"
              label="Tên chuyên môn"
              rules={[{ required: true, message: "Nhập tên chuyên môn!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Tên chuyên môn" />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-5px" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
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
          dataSource={filteredSpecializations}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: true }}
        />

        <Modal
          title="Chỉnh sửa chuyên môn"
          open={editing}
          onCancel={() => setEditing(false)}
          onOk={handleUpdate}
          okText="Cập nhật"
        >
          <Form form={editForm} layout="vertical">
            <Form.Item label="Mã chuyên môn" name="specializationCode">
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Tên chuyên môn"
              name="specializationName"
              rules={[{ required: true, message: "Vui lòng nhập tên chuyên môn!" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default SpecializationManagement;