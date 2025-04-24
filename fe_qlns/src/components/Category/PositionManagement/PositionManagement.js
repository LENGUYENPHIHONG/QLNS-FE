import React, { useState, useEffect } from "react";
import {
  Layout, Form, Input, Button, Table, Space, Modal, message
} from "antd";
import {
  SearchOutlined, EditOutlined, DeleteOutlined
} from "@ant-design/icons";
import {
  fetchPositions,
  createPosition,
  deletePosition,
  getNewCode,
  updatePosition
} from "../../../api/positionApi";

const { Content } = Layout;

const PositionManagement = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [positions, setPositions] = useState([]);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadPositions();
    generateNewCode(); // Gọi sinh mã khi trang vừa mở
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPositions(positions);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = positions.filter(
      (item) =>
        item.positionCode.toLowerCase().includes(lower) ||
        item.positionName.toLowerCase().includes(lower)
    );
    setFilteredPositions(filtered);
  }, [searchTerm, positions]);

  const generateNewCode = async () => {
    try {
      const codeRes = await getNewCode();
      console.log("📦 Mã mới:", codeRes.data?.code);
      if (codeRes.data?.code) {
        form.setFieldsValue({ positionCode: codeRes.data.code });
      }
    } catch (err) {
      console.error("❌ Lỗi lấy mã chức vụ:", err);
    }
  };

  const loadPositions = async () => {
    setLoading(true);
    try {
      const res = await fetchPositions();
      if (res.data?.Data && Array.isArray(res.data.Data)) {
        const list = res.data.Data.map((item) => ({
          id: item.MACV,
          positionCode: item.MACV,
          positionName: item.TENCV,
        }));
        setPositions(list);
        setFilteredPositions(list);
      } else {
        setPositions([]);
        setFilteredPositions([]);
        message.warning("Không có dữ liệu.");
      }
    } catch (err) {
      console.error("❌ Lỗi API:", err);
      message.error("Lỗi khi tải danh sách.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPosition = async (values) => {
    setLoading(true);
    try {
      const data = {
        MACV: values.positionCode,
        TENCV: values.positionName,
      };
      const res = await createPosition(data);
      if (res.data?.Success) {
        message.success("Thêm thành công!");
        form.resetFields();
        await loadPositions();
        await generateNewCode(); // Sinh mã mới sau khi thêm
      } else {
        message.error(res.data?.Message || "Thêm thất bại.");
      }
    } catch (err) {
      message.error("Lỗi khi thêm chức vụ.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const newList = positions.filter((item) => item.id !== id);
    setPositions(newList);
    try {
      const res = await deletePosition(id);
      if (res.data?.Success) {
        message.success("Xóa thành công!");
      } else {
        message.error(res.data?.Message || "Xóa thất bại.");
        await loadPositions();
      }
    } catch (err) {
      message.error("Lỗi khi xóa.");
      await loadPositions();
    }
  };

  const handleEdit = (record) => {
    setEditing(true);
    setEditingItem(record);
    editForm.setFieldsValue({
      positionCode: record.positionCode,
      positionName: record.positionName,
    });
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      const payload = {
        MACV: editingItem.id,
        TENCV: values.positionName,
      };
      const res = await updatePosition(payload);
      if (res.data?.Success || res.data?.MA) {
        message.success("Cập nhật thành công!");
        setEditing(false);
        await loadPositions();
      } else {
        message.error(res.data?.Message || "Cập nhật thất bại.");
      }
    } catch (err) {
      message.error("Lỗi khi cập nhật.");
    }
  };

  const columns = [
    {
      title: "Mã chức vụ",
      dataIndex: "positionCode",
      key: "positionCode",
    },
    {
      title: "Tên chức vụ",
      dataIndex: "positionName",
      key: "positionName",
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
            onClick={() => handleDelete(record.id)}
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
          onFinish={handleAddPosition}
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
              name="positionCode"
              label="Mã chức vụ"
              rules={[{ required: true, message: "Nhập mã chức vụ!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Mã chức vụ" readOnly />
            </Form.Item>
            <Form.Item
              name="positionName"
              label="Tên chức vụ"
              rules={[{ required: true, message: "Nhập tên chức vụ!" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Tên chức vụ" />
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
          dataSource={filteredPositions}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: true }}
        />

        <Modal
          title="Chỉnh sửa chức vụ"
          open={editing}
          onCancel={() => setEditing(false)}
          onOk={handleUpdate}
          okText="Cập nhật"
        >
          <Form form={editForm} layout="vertical">
            <Form.Item label="Mã chức vụ" name="positionCode">
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Tên chức vụ"
              name="positionName"
              rules={[{ required: true, message: "Vui lòng nhập tên chức vụ!" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default PositionManagement;