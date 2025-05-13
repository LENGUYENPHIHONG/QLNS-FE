import React, { useState, useEffect } from "react";
import { Layout, Form, Input, Button, Table, Space, Modal, Popconfirm, Select, Row, Col } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getNewTrainingCode,
  fetchTrainings,
  createTraining,
  updateTraining,
  deleteTraining
} from "../../../api/trainingApi";
import { toast } from 'react-toastify';

const { Content } = Layout;
const { Option } = Select;

export default function TrainingTypeManagement() {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [trainings, setTrainings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadTrainings();
    fetchCode();
  }, []);

  useEffect(() => {
    if (!search) setFiltered(trainings);
    else {
      const lower = search.toLowerCase();
      setFiltered(
        trainings.filter(t =>
          t.MADT.toLowerCase().includes(lower) ||
          t.TENDAOTAO.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, trainings]);

  const fetchCode = async () => {
    try {
      const res = await getNewTrainingCode();
      if (res.data?.code) form.setFieldsValue({ MADT: res.data.code });
    } catch {
      toast.error("Không lấy được mã đào tạo mới");
    }
  };

  const loadTrainings = async () => {
    setLoading(true);
    try {
      const res = await fetchTrainings();
      if (res.data?.Success) {
        setTrainings(res.data.Data);
        setFiltered(res.data.Data);
      }
    } catch {
      toast.error("Lỗi khi tải danh sách đào tạo");
    } finally {
      setLoading(false);
    }
  };

  const onAdd = async values => {
    setLoading(true);
    try {
      const payload = {
        MADT: values.MADT,
        TENDAOTAO: values.TENDAOTAO,
        LOAIDAOTAO: values.LOAIDAOTAO
      };
      const res = await createTraining(payload);
      if (res.data?.Success) {
        toast.success(res.data?.Message);
        form.resetFields();
        await fetchCode();
        await loadTrainings();
      } else {
        toast.error(res.data?.Message || "Thêm thất bại");
      }
    } catch(err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = item => {
    setEditingItem(item);
    setIsEditing(true);
    editForm.setFieldsValue(item);
  };

  const onUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      setLoading(true);
      const res = await updateTraining(editingItem.MADT, values);
      if (res.data?.Success) {
        toast.success(res.data?.Message);
        setIsEditing(false);
        await loadTrainings();
      } else {
        toast.error(res.data?.Message || "Cập nhật thất bại");
      }
    } catch (err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async madt => {
    setLoading(true);
    try {
      const res = await deleteTraining(madt);
      if (res.data?.Success) {
        toast.success(res.data?.Message);
        await loadTrainings();
      } else {
        toast.error(res.data?.Message || "Xóa thất bại");
      }
    } catch {
      toast.error("Lỗi khi xóa");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Mã đào tạo", dataIndex: "MADT", key: "MADT" },
    { title: "Tên đào tạo", dataIndex: "TENDAOTAO", key: "TENDAOTAO" },
    { title: "Loại đào tạo", dataIndex: "LOAIDAOTAO", key: "LOAIDAOTAO" },
    {
      title: "Tùy chọn", key: "actions", render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => startEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => onDelete(record.MADT)}
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
    <Layout style={{ background: '#fff' }}>
      <Content style={{ padding: 20 }}>
        <Form form={form} layout="vertical" onFinish={onAdd} style={{ marginBottom: 20 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="MADT" label="Mã đào tạo">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="TENDAOTAO" label="Tên đào tạo" rules={[{ required: true, message: 'Nhập tên đào tạo' }]}>
                <Input placeholder="VD: Kỹ năng mềm" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="LOAIDAOTAO"	label="Loại đào tạo" rules={[{ required: true, message: 'Chọn loại đào tạo' }]}>
                <Select placeholder="Chọn loại">
                  <Option value="Nội bộ">Nội bộ</Option>
                  <Option value="Bên ngoài">Bên ngoài</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign:'right' }}>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} >Thêm</Button>
          </Form.Item>
        </Form>

        <Input
          placeholder="Tìm kiếm..."
          prefix={<SearchOutlined />}
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300, marginBottom: 16 }}
        />

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="MADT"
          loading={loading}
          pagination={false}
        />

        <Modal
          title="Cập nhật đào tạo"
          visible={isEditing}
          onCancel={() => setIsEditing(false)}
          onOk={onUpdate}
          okText="Cập nhật"
        >
          <Form form={editForm} layout="vertical">
            <Form.Item name="MADT" label="Mã đào tạo">
              <Input disabled />
            </Form.Item>
            <Form.Item name="TENDAOTAO" label="Tên đào tạo" rules={[{ required: true }]}>  
              <Input />
            </Form.Item>
            <Form.Item name="LOAIDAOTAO" label="Loại đào tạo" rules={[{ required: true }]}>  
              <Select>
                <Option value="Nội bộ">Nội bộ</Option>
                <Option value="Bên ngoài">Bên ngoài</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}
