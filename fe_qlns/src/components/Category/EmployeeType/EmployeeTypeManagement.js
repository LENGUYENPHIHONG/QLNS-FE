import React, { useState, useEffect } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Table,
  Space,
  Modal,
  Popconfirm
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import {
  getAllEmployeeTypes,
  createEmployeeType,
  updateEmployeeType,
  deleteEmployeeType,
  getAutoCode
} from "../../../api/employeeTypeModalApi";
import { toast } from 'react-toastify';

const { Content } = Layout;

const EmployeeTypeManagement = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadTypes();
    genCode();
  }, []);

  const genCode = async () => {
    try {
      const res = await getAutoCode();
      if (res.data?.code) form.setFieldsValue({ employeeTypeCode: res.data.code });
    } catch {
      toast.error("Không lấy được mã mới");
    }
  };

  const loadTypes = async () => {
    setLoading(true);
    try {
      const res = await getAllEmployeeTypes();
      const list = res.data.Data.map(item => ({
        id: item.MALNV,
        employeeTypeCode: item.MALNV,
        employeeTypeName: item.TENLNV
      }));
      setEmployeeTypes(list);
      setFiltered(list);
    } catch {
      toast.error("Tải danh sách thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setFiltered(employeeTypes);
      return;
    }
    const lower = searchTerm.toLowerCase();
    setFiltered(
      employeeTypes.filter(
        t =>
          t.employeeTypeCode.toLowerCase().includes(lower) ||
          t.employeeTypeName.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, employeeTypes]);

  const handleAdd = async values => {
    setLoading(true);
    try {
      const payload = { MALNV: values.employeeTypeCode, TENLNV: values.employeeTypeName };
      const res = await createEmployeeType(payload);
      if (res.data?.Success) {
        toast.success(res.data.Message);
        form.resetFields();
        await loadTypes();
        await genCode();
      } else {
        toast.error(res.data.Message || "Thêm thất bại");
      }
    } catch {
      toast.error("Lỗi thêm loại nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = record => {
    setEditing(true);
    setEditingItem(record);
    editForm.setFieldsValue({
      employeeTypeCode: record.employeeTypeCode,
      employeeTypeName: record.employeeTypeName
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const vals = await editForm.validateFields();
      const payload = { MALNV: editingItem.id, TENLNV: vals.employeeTypeName };
      const res = await updateEmployeeType(payload);
      if (res.data?.Success) {
        toast.success(res.data.Message);
        setEditing(false);
        await loadTypes();
      } else {
        toast.error(res.data.Message || "Cập nhật thất bại");
      }
    } catch {
      toast.error("Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    setLoading(true);
    try {
      const res = await deleteEmployeeType({ MALNV: id });
      if (res.data?.Success) {
        toast.success(res.data.Message);
        await loadTypes();
      } else {
        toast.error(res.data.Message || "Xóa thất bại");
      }
    } catch {
      toast.error("Lỗi xóa");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Mã loại", dataIndex: "employeeTypeCode", key: "code" },
    { title: "Tên loại", dataIndex: "employeeTypeName", key: "name" },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => startEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Xác nhận xóa?"
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
    <Layout style={{ backgroundColor: "white", borderRadius: 8 }}>
      <Content style={{ padding: 20 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          style={{
            background: '#fff',
            padding: 20,
            borderRadius: 8,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: 20
          }}
        >
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="employeeTypeCode"
              label="Mã loại nhân viên"
              rules={[{ required: true, message: 'Nhập mã!' }]}
              style={{ flex: 1 }}
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              name="employeeTypeName"
              label="Tên loại nhân viên"
              rules={[{ required: true, message: 'Nhập tên!' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Tên loại nhân viên" />
            </Form.Item>
          </div>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm
            </Button>
          </Form.Item>
        </Form>

        <Space style={{ marginBottom: 20 }}>
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: true }}
        />

        <Modal
          title="Chỉnh sửa loại nhân viên"
          open={editing}
          onCancel={() => setEditing(false)}
          onOk={handleUpdate}
          okText="Cập nhật"
          confirmLoading={loading}
        >
          <Form form={editForm} layout="vertical">
            <Form.Item name="employeeTypeCode" label="Mã loại nhân viên">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="employeeTypeName"
              label="Tên loại nhân viên"
              rules={[{ required: true, message: 'Nhập tên!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default EmployeeTypeManagement;

