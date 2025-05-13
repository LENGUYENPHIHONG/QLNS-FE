import React, { useState, useEffect } from "react";
import {
  Layout, Form, Input, Button, Table, Space, Modal
} from "antd";
import {
  SearchOutlined, EditOutlined, DeleteOutlined
} from "@ant-design/icons";
import {
  fetchContractTypes,
  createContractType,
  deleteContractType,
  updateContractType,
  getNewContractTypeCode
} from "../../../api/contractTypeApi";
import { toast } from 'react-toastify';
const { Content } = Layout;

const ContractTypeManagement = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [contractTypes, setContractTypes] = useState([]);
  const [filteredContractTypes, setFilteredContractTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadContractTypes();
    generateNewCode();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredContractTypes(contractTypes);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = contractTypes.filter(
      (item) =>
        item.code.toLowerCase().includes(lower) ||
        item.name.toLowerCase().includes(lower)
    );
    setFilteredContractTypes(filtered);
  }, [searchTerm, contractTypes]);

  const loadContractTypes = async () => {
    setLoading(true);
    try {
      const res = await fetchContractTypes();
      if (res.data?.Data) {
        const list = res.data.Data.map((item) => ({
          id: item.MALHD,
          code: item.MALHD,
          name: item.TENLHD,
          duration: item.THOIHAN,
        }));
        setContractTypes(list);
        setFilteredContractTypes(list);
      } else {
        setContractTypes([]);
        setFilteredContractTypes([]);
      }
    } catch (err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  const generateNewCode = async () => {
    try {
      const res = await getNewContractTypeCode();
      if (res.data?.code) {
        form.setFieldsValue({ code: res.data.code });
      }
    } catch(err) {
      toast.error(err.response.data.Message);
    }
  };

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      const res = await createContractType({
        MALHD: values.code,
        TENLHD: values.name,
        THOIHAN: values.duration,
      });
      if (res.data?.Success) {
        toast.success(res.data?.Message);
        form.resetFields();
        await loadContractTypes();
        await generateNewCode();
      } else {
        toast.error(res.data?.Message || "Thêm thất bại.");
      }
    } catch(err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteContractType(id);
      if (res.data?.Success) {
        toast.success(res.data?.Message);
        const newList = contractTypes.filter((item) => item.id !== id);
        setContractTypes(newList);
        setFilteredContractTypes(newList);
      } else {
        toast.error(res.data?.Message || "Xóa thất bại");
      }
    } catch {
      toast.error("Lỗi khi xóa");
    }
  };

  const handleEdit = (record) => {
    setEditing(true);
    setEditingItem(record);
    editForm.setFieldsValue({
      code: record.code,
      name: record.name,
      duration: record.duration,
    });
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      const res = await updateContractType({
        MALHD: editingItem.id,
        TENLHD: values.name,
        THOIHAN: values.duration,
      });
      if (res.data?.Success || res.data?.MA) {
        toast.success(res.data?.Success);
        setEditing(false);
        await loadContractTypes();
      } else {
        toast.error(res.data?.Message || "Cập nhật thất bại");
      }
    } catch {
      toast.error("Lỗi khi cập nhật");
    }
  };

  const columns = [
    {
      title: "Mã loại HĐ",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên loại HĐ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thời hạn",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Tùy chọn",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ backgroundColor: "#fff", borderRadius: 8 }}>
      <Content style={{ padding: 20 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAdd}
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
            <Form.Item
              label="Mã loại HĐ"
              name="code"
              rules={[{ required: true, message: "Vui lòng nhập mã" }]}
              style={{ flex: 1 }}
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="Tên loại HĐ"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Thời hạn"
              name="duration"
              rules={[{ required: true, message: "Vui lòng nhập thời hạn" }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="VD: 1 năm, 6 tháng..." />
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

        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm loại hợp đồng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 20, width: 300 }}
        />

        <Table
          columns={columns}
          dataSource={filteredContractTypes}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: true }}
        />

        <Modal
          title="Cập nhật loại hợp đồng"
          open={editing}
          onCancel={() => setEditing(false)}
          onOk={handleUpdate}
          okText="Cập nhật"
        >
          <Form form={editForm} layout="vertical">
            <Form.Item label="Mã loại HĐ" name="code">
              <Input disabled />
            </Form.Item>
            <Form.Item label="Tên loại HĐ" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Thời hạn" name="duration" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ContractTypeManagement;
