// src/pages/KyLuat/KyLuatPage.jsx
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Layout,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Table,
  Space,
  Modal,
  Tag,
  message,
} from 'antd';
import {
  SearchOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {
  getMaKL,
  getDanhSachKL,
  addKyLuat,
  updateKyLuat,
  deleteKyLuat,
  approveKyLuat,
  rejectKyLuat,
  cancelKyLuat,
} from '../../api/kyLuatApi';
import { fetchEmployees } from '../../api/employeeApi';

const { Content } = Layout;
const { Option } = Select;

const KyLuatPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // Load employees
  const loadEmployees = async () => {
    try {
      const res = await fetchEmployees();
      const payload = res.data || res;
      const list = Array.isArray(payload.Data)
        ? payload.Data
        : Array.isArray(payload)
        ? payload
        : [];
      setEmployees(list);
    } catch (err) {
      console.error('Error loading employees:', err);
      message.error('Không thể tải danh sách nhân viên');
    }
  };

  // Load discipline records
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getDanhSachKL({ search: searchTerm });
      const list = res.Data || res.data || [];
      setData(list);
    } catch (err) {
      console.error('Error loading discipline data:', err);
      message.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadData();
  }, []);

  // Search handler
  const onSearch = (value) => {
    setSearchTerm(value);
    loadData();
  };

  // Open modal for add/edit
  const openModal = async (record) => {
    form.resetFields();
    if (record) {
      setIsEdit(true);
      setCurrentRecord(record);
      form.setFieldsValue({
        ...record,
        NGAYKYLUAT: moment(record.NGAYKYLUAT),
      });
    } else {
      setIsEdit(false);
      try {
        const code = await getMaKL();
        form.setFieldsValue({ MAKL: code });
      } catch (err) {
        console.error('Error fetching new code:', err);
        message.error('Không thể lấy mã mới');
      }
    }
    setModalVisible(true);
  };

  // Submit add or edit
  const handleSubmit = async (values) => {
    // prepare payload, include required NGUOITAO and TRANGTHAI for validation
    const payload = {
      ...values,
      NGAYKYLUAT: values.NGAYKYLUAT.format('YYYY-MM-DD'),
      // set default status and creator
      TRANGTHAI: isEdit ? currentRecord.TRANGTHAI : 'Chờ duyệt',
      NGUOITAO: 'System',
    };
    console.log('Submitting payload:', payload);
    try {
      if (isEdit) {
        await updateKyLuat(currentRecord.MAKL, payload);
      } else {
        await addKyLuat(payload);
      }
      message.success('Thao tác thành công');
      setModalVisible(false);
      loadData();
    } catch (err) {
      console.error('Error on submit:', err.response || err);
      const resp = err.response?.data;
      if (resp?.errors) {
        const msgs = Object.values(resp.errors).flat().join('\n');
        message.error(msgs);
      } else {
        message.error(resp?.Message || 'Lỗi xử lý');
      }
    }
  };

  // Action handlers
  const handleAction = async (action, record) => {
    try {
      console.log(`Performing ${action} on`, record);
      if (action === 'approve') await approveKyLuat(record.MAKL);
      if (action === 'reject') await rejectKyLuat(record.MAKL);
      if (action === 'cancel') await cancelKyLuat(record.MAKL, { LYDOHUY: 'Hủy theo yêu cầu' });
      if (action === 'delete') await deleteKyLuat(record.MAKL);
      message.success('Thao tác thành công');
      loadData();
    } catch (err) {
      console.error(`Error on action ${action}:`, err.response || err);
      message.error('Thao tác thất bại');
    }
  };

  // Render status tag
  const renderStatus = (status) => {
    const map = {
      'Chờ duyệt': 'orange',
      'Đã duyệt': 'green',
      'Từ chối': 'red',
      'Đã hủy': 'default',
    };
    return <Tag color={map[status] || 'blue'}>{status}</Tag>;
  };

  const columns = [
    { title: 'Mã KL', dataIndex: 'MAKL', key: 'MAKL' },
    { title: 'Nhân viên', dataIndex: 'TENNV', key: 'TENNV' },
    { title: 'Loại', dataIndex: 'LOAIKYLUAT', key: 'LOAIKYLUAT' },
    {
      title: 'Ngày KL',
      dataIndex: 'NGAYKYLUAT',
      key: 'NGAYKYLUAT',
      render: (d) => moment(d).format('YYYY-MM-DD'),
    },
    { title: 'Lý do', dataIndex: 'LYDO', key: 'LYDO' },
    { title: 'Mức phạt', dataIndex: 'MUCPHAT', key: 'MUCPHAT' },
    {
      title: 'Trạng thái',
      dataIndex: 'TRANGTHAI',
      key: 'TRANGTHAI',
      render: renderStatus,
    },
    {
      title: 'Tùy chọn',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.TRANGTHAI === 'Chờ duyệt' && (
            <>
              <Button icon={<CheckCircleOutlined />} onClick={() => handleAction('approve', record)}>Duyệt</Button>
              <Button icon={<CloseCircleOutlined />} danger onClick={() => handleAction('reject', record)}>Từ chối</Button>
              <Button icon={<EditOutlined />} onClick={() => openModal(record)}>Sửa</Button>
              <Button icon={<DeleteOutlined />} danger onClick={() => handleAction('delete', record)}>Xóa</Button>
            </>
          )}
          {record.TRANGTHAI === 'Đã duyệt' && (
            <Button icon={<UndoOutlined />} danger onClick={() => handleAction('cancel', record)}>Hủy</Button>
          )}
          {['Từ chối', 'Đã hủy'].includes(record.TRANGTHAI) && (
            <Button icon={<DeleteOutlined />} danger onClick={() => handleAction('delete', record)}>Xóa</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ background: '#fff' }}>
      <Content style={{ padding: 20 }}>
        <Space style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm kỷ luật..."
            enterButton
            allowClear
            onSearch={onSearch}
            style={{ width: 300 }}
          />
          <Button type="primary" onClick={() => openModal(null)}>Thêm Kỷ luật</Button>
        </Space>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="MAKL"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={isEdit ? 'Sửa Kỷ luật' : 'Thêm Kỷ luật'}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={() => form.submit()}
        >
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item name="MAKL" label="Mã KL"><Input disabled /></Form.Item>
            <Form.Item name="MANV" label="Nhân viên" rules={[{ required: true }]}>  
              <Select placeholder="Chọn nhân viên">
                {employees.map((e) => (
                  <Option key={e.MANV} value={e.MANV}>{e.TENNV}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="LOAIKYLUAT" label="Loại kỷ luật" rules={[{ required: true }]}>  
              <Select placeholder="Chọn loại kỷ luật">
                <Option value="Phạt tiền">Phạt tiền</Option>
                <Option value="Cảnh cáo">Cảnh cáo</Option>
              </Select>
            </Form.Item>
            <Form.Item name="NGAYKYLUAT" label="Ngày kỷ luật" rules={[{ required: true }]}>  
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="LYDO" label="Lý do">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="MUCPHAT" label="Mức phạt">
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default KyLuatPage;
