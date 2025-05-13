import React, { useState, useEffect } from "react";
import {
  Layout, Form, Input, Button, Table, Space, Modal, Popconfirm
} from "antd";
import {
  SearchOutlined, EditOutlined, DeleteOutlined
} from "@ant-design/icons";
import { toast } from 'react-toastify';

import {
  fetchEducationLevels,
  createEducationLevel,
  updateEducationLevel,
  deleteEducationLevel,
  getNewEducationCode
} from "../../../api/educationApi";

const { Content } = Layout;

const EducationLevelManagement = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [educationLevels, setEducationLevels] = useState([]);
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadLevels();
    generateNewCode();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredLevels(educationLevels);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = educationLevels.filter(
      (item) =>
        item.educationCode.toLowerCase().includes(lower) ||
        item.educationName.toLowerCase().includes(lower)
    );
    setFilteredLevels(filtered);
  }, [searchTerm, educationLevels]);

  const generateNewCode = async () => {
    try {
      const res = await getNewEducationCode();
      if (res.data?.code) {
        form.setFieldsValue({ educationCode: res.data.code });
      }
    } catch (err) {
      toast.error(err.response.data.Message);
    }
  };

  const loadLevels = async () => {
    setLoading(true);
    try {
      const res = await fetchEducationLevels();
      if (res.data?.Data && Array.isArray(res.data.Data)) {
        const list = res.data.Data.map((item) => ({
          id: item.MATD,
          educationCode: item.MATD,
          educationName: item.TENTD,
        }));
        setEducationLevels(list);
        setFilteredLevels(list);
      } else {
        setEducationLevels([]);
        setFilteredLevels([]);
        toast.warning("Không có dữ liệu trình độ.");
      }
    } catch (err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEducationLevel = async (values) => {
    setLoading(true);
    try {
      const data = {
        MATD: values.educationCode,
        TENTD: values.educationName,
      };
  
      const res = await createEducationLevel(data);
  
      if (res.data?.Success) {
        //alert("Thêm trình độ thành công!");
        form.resetFields();
        await loadLevels(); // reload danh sách
        await generateNewCode();
        toast.success(res.data?.Message); // tạo mã mới sau khi thêm
      } else {
        toast.success(res.data?.Message);
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
      educationCode: record.educationCode,
      educationName: record.educationName,
    });
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      const payload = {
        MATD: editingItem.id,
        TENTD: values.educationName,
      };
      const res = await updateEducationLevel(payload);
      if (res.data?.Success || res.data?.MA) {
        setEditing(false);
        await loadLevels();
        toast.success(res.data?.Success);
      } else {
        toast.error(res.data?.Message || "Cập nhật thất bại.");
      }
    } catch (err) {
      toast.error(err.response.data.Message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteEducationLevel({ MATD: id });
      if (res.data?.Success) {
        toast.success(res.data?.Success);
        await loadLevels();
      } else {
        toast.error(res.data?.Message || "Xóa thất bại.");
      }
    } catch (err) {
      toast.error(err.response.data.Message);
    }
  };

  const columns = [
    {
      title: "Mã trình độ",
      dataIndex: "educationCode",
      key: "educationCode",
    },
    {
      title: "Tên trình độ",
      dataIndex: "educationName",
      key: "educationName",
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
          onFinish={handleAddEducationLevel}
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
              name="educationCode"
              label="Mã trình độ"
              rules={[{ required: true, message: "Vui lòng nhập mã trình độ!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Mã trình độ" disabled />
            </Form.Item>
            <Form.Item
              name="educationName"
              label="Tên trình độ"
              rules={[{ required: true, message: "Vui lòng nhập tên trình độ!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Tên trình độ" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: "#3e0fe6", borderColor: "#3e0fe6" }}
                
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
          dataSource={filteredLevels}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: true }}
        />

        <Modal
          title="Chỉnh sửa trình độ"
          open={editing}
          onCancel={() => setEditing(false)}
          onOk={handleUpdate}
          okText="Cập nhật"
        >
          <Form form={editForm} layout="vertical">
            <Form.Item label="Mã trình độ" name="educationCode">
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Tên trình độ"
              name="educationName"
              rules={[{ required: true, message: "Vui lòng nhập tên trình độ!" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default EducationLevelManagement;
