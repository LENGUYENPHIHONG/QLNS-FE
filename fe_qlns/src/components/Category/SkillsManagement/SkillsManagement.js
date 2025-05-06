import React, { useEffect, useState } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, Popconfirm, Select, InputNumber, message, Space, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  fetchSkillTypes,
  getSkillTypeDetails,
  createSkillTypeFull,
  updateSkillTypeFull,
  deleteSkillType
} from '../../../api/LoaiKyNangApi';
import { deleteSkill } from '../../../api/KyNangApi';
import { deleteLevel } from '../../../api/CapDoApi';

const { TabPane } = Tabs;

// Loại kỹ năng với hiển thị tag kỹ năng
function LoaiKyNangPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, isEdit: false, record: null });
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchSkillTypes();
      const types = res.data.Data || [];
      const enriched = await Promise.all(
        types.map(async (item) => {
          const det = await getSkillTypeDetails(item.MALKN);
          const skills = det.data.Data.DanhSachKyNang.map(x => x.TENKN);
          return { ...item, KYNANG: skills };
        })
      );
      setList(enriched);
    } catch {
      message.error('Lỗi tải loại kỹ năng');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openModal = (isEdit, record = {}) => {
    form.resetFields();
    if (isEdit) {
      getSkillTypeDetails(record.MALKN).then(res => {
        const d = res.data.Data;
        form.setFieldsValue({
          TENLKN: d.TENLKN,
          DanhSachKyNang: d.DanhSachKyNang.map(x => x.TENKN),
          DanhSachCapDo: d.DanhSachCapDo.map(x => ({ TENCD: x.TENCD, MUCDO: x.MUCDO }))
        });
      });
    }
    setModal({ visible: true, isEdit, record });
  };

  const handleSave = async (vals) => {
    const payload = {
      TENLKN: vals.TENLKN,
      DanhSachKyNang: vals.DanhSachKyNang || [],
      DanhSachCapDo: vals.DanhSachCapDo || []
    };
    try {
      if (modal.isEdit) {
        await updateSkillTypeFull(modal.record.MALKN, payload);
      } else {
        await createSkillTypeFull(payload);
      }
      message.success('Lưu thành công');
      setModal({ visible: false });
      load();
    } catch {
      message.error('Lưu thất bại');
    }
  };

  const columns = [
    { title: 'Mã', dataIndex: 'MALKN' },
    { title: 'Tên', dataIndex: 'TENLKN' },
    { title: 'Kỹ năng', dataIndex: 'KYNANG', render: skills => skills.map(s => <Tag key={s}>{s}</Tag>) },
    { title: 'Hành động', render: (_, record) => (
        <Space>
          <Button onClick={() => openModal(true, record)}>Sửa</Button>
          <Popconfirm title="Xóa?" onConfirm={() => deleteSkillType(record.MALKN).then(load)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal(false)} style={{ marginBottom: 16 }}>
        Thêm Loại Kỹ Năng
      </Button>
      <Table
        rowKey="MALKN"
        dataSource={list}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
      <Modal
        title={modal.isEdit ? 'Cập nhật loại kỹ năng' : 'Thêm loại kỹ năng'}
        visible={modal.visible}
        onCancel={() => setModal({ visible: false })}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="TENLKN" label="Tên loại" rules={[{ required: true, message: 'Hãy nhập tên loại' }]}> 
            <Input /> 
          </Form.Item>
          <Form.Item name="DanhSachKyNang" label="Kỹ năng">
            <Select mode="tags" placeholder="Nhập tên kỹ năng và nhấn Enter" style={{ width: '100%' }} />
          </Form.Item>
          <Form.List name="DanhSachCapDo">
            {(fields, { add, remove }) => (
              <>
                <label style={{ fontWeight: 'bold' }}>Cấp độ</label>
                {fields.map(({ key, name, fieldKey }) => (
                  <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item
                      name={[name, 'TENCD']}
                      fieldKey={[fieldKey, 'TENCD']}
                      rules={[{ required: true, message: 'Nhập tên cấp độ' }]}
                    >
                      <Input placeholder="Tên cấp độ" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item
                      name={[name, 'MUCDO']}
                      fieldKey={[fieldKey, 'MUCDO']}
                      rules={[{ required: true, message: 'Nhập mức độ' }]}
                    >
                      <InputNumber placeholder="Mức độ" style={{ width: 100 }} />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)}>Xóa</Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Thêm cấp độ
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );
}

// Quản lý Kỹ năng
function KyNangPage() {
  const [types, setTypes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { (async () => {
    const res = await fetchSkillTypes();
    setTypes(res.data.Data || []);
  })(); }, []);

  const onTypeChange = async (maLKN) => {
    setSelected(maLKN);
    setLoading(true);
    const det = await getSkillTypeDetails(maLKN);
    setSkills(det.data.Data.DanhSachKyNang || []);
    setLoading(false);
  };

  const handleDelete = async (maKN) => {
    await deleteSkill(maKN);
    onTypeChange(selected);
  };

  const columns = [
    { title: 'Mã KN', dataIndex: 'MAKN' },
    { title: 'Tên KN', dataIndex: 'TENKN' },
    { title: 'Hành động', render: (_, record) => (
        <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.MAKN)}>
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  return (
    <>
      <Select
        placeholder="Chọn loại"
        style={{ width: 240, marginBottom: 16 }}
        onChange={onTypeChange}
        value={selected}
      >
        {types.map(t => <Select.Option key={t.MALKN} value={t.MALKN}>{t.TENLKN}</Select.Option>)}
      </Select>
      <Table rowKey="MAKN" dataSource={skills} columns={columns} loading={loading} pagination={false} />
    </>
  );
}

// Quản lý Cấp độ
function CapDoPage() {
  const [types, setTypes] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { (async () => {
    const res = await fetchSkillTypes();
    setTypes(res.data.Data || []);
  })(); }, []);

  const onTypeChange = async (maLKN) => {
    setSelected(maLKN);
    setLoading(true);
    const det = await getSkillTypeDetails(maLKN);
    setLevels(det.data.Data.DanhSachCapDo || []);
    setLoading(false);
  };

  const handleDelete = async (maCD) => {
    await deleteLevel(maCD);
    onTypeChange(selected);
  };

  const columns = [
    { title: 'Mã CD', dataIndex: 'MACD' },
    { title: 'Tên CD', dataIndex: 'TENCD' },
    { title: 'Mức độ', dataIndex: 'MUCDO' },
    { title: 'Hành động', render: (_, record) => (
        <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.MACD)}>
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  return (
    <>
      <Select
        placeholder="Chọn loại"
        style={{ width: 240, marginBottom: 16 }}
        onChange={onTypeChange}
        value={selected}
      >
        {types.map(t => <Select.Option key={t.MALKN} value={t.MALKN}>{t.TENLKN}</Select.Option>)}
      </Select>
      <Table rowKey="MACD" dataSource={levels} columns={columns} loading={loading} pagination={false} />
    </>
  );
}

// Giao diện chính
export default function SkillsManagement() {
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Loại kỹ năng" key="1"><LoaiKyNangPage /></TabPane>
      <TabPane tab="Kỹ năng" key="2"><KyNangPage /></TabPane>
      <TabPane tab="Cấp độ" key="3"><CapDoPage /></TabPane>
    </Tabs>
  );
}
