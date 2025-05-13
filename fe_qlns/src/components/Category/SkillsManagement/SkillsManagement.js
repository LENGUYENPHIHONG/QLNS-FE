import React, { useEffect, useState } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, Popconfirm, InputNumber, Space, Tag, Row, Col, Card, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  fetchSkillTypes,
  getSkillTypeDetails,
  createSkillTypeFull,
  updateSkillTypeFull,
  deleteSkillType,
  supplementSkillsAndLevels
} from '../../../api/LoaiKyNangApi';
import { deleteSkill } from '../../../api/KyNangApi';
import { deleteLevel } from '../../../api/CapDoApi';
import { toast } from 'react-toastify';
const { TabPane } = Tabs;

function LoaiKyNangPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ visible: false, isEdit: false, record: null });
  const [suppModal, setSuppModal] = useState({ visible: false, record: null });
  const [form] = Form.useForm();
  const [formSupp] = Form.useForm();

  async function load() {
    setLoading(true);
    try {
      const res = await fetchSkillTypes();
      const data = res.data.Data || [];
      setList(
        data.map(item => ({
          MALKN: item.MALKN,
          TENLKN: item.TENLKN,
          KYNANG: item.DanhSachKyNang.map(k => k.TENKN)
        }))
      );
    } catch {
      toast.error('Lỗi tải danh sách');
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const openModal = async (isEdit, record = null) => {
    form.resetFields();
    if (isEdit && record) {
      // Set initial TENLKN from record
      form.setFieldsValue({ TENLKN: record.TENLKN });
      // Fetch details and update lists
      //const res = await getSkillTypeDetails(record.MALKN);
    form.resetFields();
    if (isEdit && record) {
      const res = await getSkillTypeDetails(record.MALKN);
      const d = res.data.Data;
        form.setFieldsValue({
          TENLKN: d.TENLKN,
          DanhSachKyNang: d.DanhSachKyNang.map(k => ({ MAKN: k.MAKN, TENKN: k.TENKN })),
          DanhSachCapDo: d.DanhSachCapDo.map(c => ({ MACD: c.MACD, TENCD: c.TENCD, MUCDO: c.MUCDO }))
        });
        setModal({ visible: true, isEdit, record });
      };
    } else {
      setModal({ visible: true, isEdit: false, record: null });
    }
  };

  const openSupp = record => {
    formSupp.resetFields();
    setSuppModal({ visible: true, record });
  };

  const handleSave = async vals => {
    try {
      if (modal.isEdit) {
        var res = await updateSkillTypeFull(modal.record.MALKN, {
          TENLKN: vals.TENLKN,
          DanhSachKyNang: vals.DanhSachKyNang || [],
          DanhSachCapDo: vals.DanhSachCapDo || []
        });
      } else {
        var res = await createSkillTypeFull({
          TENLKN: vals.TENLKN,
          DanhSachKyNang: (vals.DanhSachKyNang || []).map(x => x.TENKN),
          DanhSachCapDo: vals.DanhSachCapDo || []
        });
      }
      toast.success(res.data?.Message);
      setModal({ visible: false, isEdit: false, record: null });
      load();
    } catch( err) {
      toast.error(err.response.data.Message);
    }
  };

  const handleSupplement = async vals => {
    try {
      var res = await supplementSkillsAndLevels({
        MALKN: suppModal.record.MALKN,
        DanhSachKyNangMoi: vals.DanhSachKyNangMoi || [],
        DanhSachCapDoMoi: vals.DanhSachCapDoMoi || []
      });
      toast.success(res.data?.Message);
      setSuppModal({ visible: false, record: null });
      load();
    } catch(err) {
      toast.error(err.response.data.Message);
    }
  };

  const columns = [
    { title: 'Tên', dataIndex: 'TENLKN' },
    { title: 'Kỹ năng', dataIndex: 'KYNANG', render: arr => arr.map(s => <Tag key={s}>{s}</Tag>) },
    {
      title: 'Hành động', render: (_, rec) => (
        <Space size="middle">
          <Button type="primary" shape="round" size="small" onClick={() => openModal(true, rec)}>Cập nhật</Button>
          <Button type="default" shape="round" size="small" onClick={() => openSupp(rec)}>Bổ sung</Button>
          <Popconfirm title="Xóa?" onConfirm={() => deleteSkillType(rec.MALKN).then(load)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Table
        title={() => (
          <Button type="primary" shape="round" icon={<PlusOutlined />} onClick={() => openModal(false)}>
            Thêm Loại Kỹ Năng
          </Button>
        )}
        rowSelection={{ type: 'checkbox' }}
        rowKey="MALKN"
        dataSource={list}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Modal create/update */}
      <Modal
        title={modal.isEdit ? 'Cập nhật loại kỹ năng' : 'Thêm loại kỹ năng'}
        visible={modal.visible}
        onCancel={() => setModal({ visible: false, isEdit: false, record: null })}
        onOk={() => form.submit()}
        width={700}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Form.Item name="TENLKN" label="Tên loại" rules={[{ required: true, message: 'Nhập tên loại' }]}>
            <Input />
          </Form.Item>
          <Row gutter={24}>
            <Col span={12}>
              <Card size="small" title="Kỹ năng" bordered>
                <Form.List name="DanhSachKyNang">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(f => (
                        <Space key={f.key} align="baseline" style={{ width: '100%', justifyContent: 'space-between' }}>
                          <Form.Item
                            name={[f.name, 'TENKN']}
                            fieldKey={[f.fieldKey, 'TENKN']}
                            rules={[{ required: true, message: 'Nhập tên kỹ năng' }]}
                          >
                            <Input placeholder="Tên kỹ năng" />
                          </Form.Item>
                          <Button type="link" danger onClick={() => remove(f.name)}>Xóa</Button>
                        </Space>
                      ))}
                      <Button block type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Thêm kỹ năng</Button>
                    </>
                  )}
                </Form.List>
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="Cấp độ" bordered>
                <Form.List name="DanhSachCapDo">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(f => (
                        <Space key={f.key} align="baseline" style={{ width: '100%', justifyContent: 'space-between' }}>
                          <Form.Item
                            name={[f.name, 'TENCD']}
                            fieldKey={[f.fieldKey, 'TENCD']}
                            rules={[{ required: true, message: 'Nhập tên cấp độ' }]}
                          >
                            <Input placeholder="Tên cấp độ" style={{ width: '100%' }} />
                          </Form.Item>
                          <Form.Item
                            name={[f.name, 'MUCDO']}
                            fieldKey={[f.fieldKey, 'MUCDO']}
                            rules={[{ required: true, message: 'Nhập mức độ' }]}
                          >
                            <InputNumber placeholder="Mức độ" style={{ width: '100%' }} />
                          </Form.Item>
                          <Button type="link" danger onClick={() => remove(f.name)}>Xóa</Button>
                        </Space>
                      ))}
                      <Button block type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Thêm cấp độ</Button>
                    </>
                  )}
                </Form.List>
              </Card>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Modal bổ sung */}
      <Modal
        title={`Bổ sung kỹ năng & cấp độ - ${suppModal.record?.TENLKN}`}
        visible={suppModal.visible}
        onCancel={() => setSuppModal({ visible: false, record: null })}
        onOk={() => formSupp.submit()}
        width={600}
        centered
        zIndex={1001}
        destroyOnClose
      >
        <Form form={formSupp} layout="vertical" onFinish={handleSupplement} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
          <Form.List name="DanhSachKyNangMoi">
            {(fields, { add, remove }) => (
              <Card size="small" title="Kỹ năng mới" bordered style={{ marginBottom: 16 }}>
                {fields.map(f => (
                  <Space key={f.key} align="baseline" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Form.Item name={[f.name]} fieldKey={[f.fieldKey]} rules={[{ required: true }]}> 
                      <Input placeholder="Tên kỹ năng mới" />
                    </Form.Item>
                    <Button type="link" danger onClick={() => remove(f.name)}>Xóa</Button>
                  </Space>
                ))}
                <Button block type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Thêm kỹ năng mới</Button>
              </Card>
            )}
          </Form.List>
          <Form.List name="DanhSachCapDoMoi">
            {(fields, { add, remove }) => (
              <Card size="small" title="Cấp độ mới" bordered>
                {fields.map(f => (
                  <Space key={f.key} align="baseline" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Form.Item name={[f.name, 'TENCD']} fieldKey={[f.fieldKey, 'TENCD']} rules={[{ required: true }]}> 
                      <Input placeholder="Tên cấp độ mới" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name={[f.name, 'MUCDO']} fieldKey={[f.fieldKey, 'MUCDO']} rules={[{ required: true }]}> 
                      <InputNumber placeholder="Mức độ" style={{ width: '100%' }} />
                    </Form.Item>
                    <Button type="link" danger onClick={() => remove(f.name)}>Xóa</Button>
                  </Space>
                ))}
                <Button block type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Thêm cấp độ mới</Button>
              </Card>
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

  useEffect(() => {
    (async () => {
      const res = await fetchSkillTypes();
      setTypes(res.data.Data || []);
    })();
  }, []);

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
    {
      title: 'Hành động', render: (_, record) => (
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

  useEffect(() => {
    (async () => {
      const res = await fetchSkillTypes();
      setTypes(res.data.Data || []);
    })();
  }, []);

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
    {
      title: 'Hành động', render: (_, record) => (
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
