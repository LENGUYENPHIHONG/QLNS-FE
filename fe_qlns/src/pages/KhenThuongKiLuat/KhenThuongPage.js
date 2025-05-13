import React, { useState, useEffect, useCallback } from 'react';
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
  Upload,
} from 'antd';
import { toast } from 'react-toastify';
import {
  SearchOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  UndoOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  getMaKT,
  getDanhSachKT,
  addKhenThuong,
  updateKhenThuong,
  deleteKhenThuong,
  approveKhenThuong,
  rejectKhenThuong,
  cancelKhenThuong,
  importKhenThuongFromExcel,
} from '../../api/khenThuongApi';
import { fetchEmployees } from '../../api/employeeApi';

const { Content } = Layout;
const { Option } = Select;

const KhenThuongPage = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // Load employees once
  const loadEmployees = useCallback(async () => {
    try {
      const res = await fetchEmployees();
      const payload = res.data ?? res;
      const list = Array.isArray(payload.Data)
        ? payload.Data
        : Array.isArray(payload)
        ? payload
        : [];
      setEmployees(list);
    } catch {
      toast.error('Không thể tải danh sách nhân viên');
    }
  }, []);

  // Load data whenever searchTerm changes
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDanhSachKT({ search: searchTerm });
      const list = res.Data ?? res.data ?? [];
      setData(list);
    } catch {
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSearch = (value) => {
    setSearchTerm(value);
  };

  const openModal = async (record) => {
    form.resetFields();
    if (record) {
      setIsEdit(true);
      setCurrentRecord(record);
      form.setFieldsValue({
        ...record,
        NGAYKHENTHUONG: moment(record.NGAYKHENTHUONG),
      });
    } else {
      setIsEdit(false);
      try {
        const code = await getMaKT();
        form.setFieldsValue({ MAKT: code });
      } catch {
        toast.error('Không thể lấy mã mới');
      }
    }
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      NGAYKHENTHUONG: values.NGAYKHENTHUONG.format('YYYY-MM-DD'),
      TRANGTHAI: 'Chờ duyệt',
      NGUOITAO: 'System',
    };
    try {
      if (isEdit) {
        await updateKhenThuong(currentRecord.MAKT, payload);
        toast.success('Cập nhật thành công');
      } else {
        await addKhenThuong(payload);
        toast.success('Thêm mới thành công');
      }
      setModalVisible(false);
      loadData();
    } catch (err) {
      const msg = err.response?.data?.Message || 'Lỗi xử lý';
      toast.error(msg);
    }
  };

  const handleImport = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    toast.info('Đang import...');
    try {
      const res = await importKhenThuongFromExcel(formData);
      const { Message, Loi } = res.data;
      toast.success(Message || 'Import thành công');
      if (Array.isArray(Loi) && Loi.length > 0) {
        // Hiển thị các dòng lỗi
        Loi.forEach(errLine => toast.warn(errLine));
      }
      loadData();
    } catch (err) {
      const resp = err.response?.data;
      const errMsg = resp?.Detail || resp?.Message || 'Import thất bại';
      toast.error(errMsg);
    }
    return false;
  };

  const handleAction = async (action, record) => {
    try {
      if (action === 'approve') await approveKhenThuong(record.MAKT);
      if (action === 'reject') await rejectKhenThuong(record.MAKT);
      if (action === 'cancel') await cancelKhenThuong(record.MAKT, { LYDOHUY: 'Hủy theo yêu cầu' });
      if (action === 'delete') await deleteKhenThuong(record.MAKT);
      toast.success('Thao tác thành công');
      loadData();
    } catch {
      toast.error('Thao tác thất bại');
    }
  };

  const renderStatus = (status) => {
    const colorMap = {
      'Chờ phê duyệt': 'orange',
      'Đã duyệt': 'green',
      'Từ chối': 'red',
      'Đã hủy': 'default',
    };
    return <Tag color={colorMap[status] || 'blue'}>{status}</Tag>;
  };

  const columns = [
    { title: 'Mã KT', dataIndex: 'MAKT', key: 'MAKT' },
    { title: 'Nhân viên', dataIndex: 'TENNV', key: 'TENNV' },
    { title: 'Loại', dataIndex: 'LOAIKHENTHUONG', key: 'LOAIKHENTHUONG' },
    { title: 'Ngày KT', dataIndex: 'NGAYKHENTHUONG', key: 'NGAYKHENTHUONG', render: d => moment(d).format('YYYY-MM-DD') },
    { title: 'Lý do', dataIndex: 'LYDO', key: 'LYDO' },
    { title: 'Giá trị', dataIndex: 'GIATRITHUONG', key: 'GIATRITHUONG' },
    { title: 'Trạng thái', dataIndex: 'TRANGTHAI', key: 'TRANGTHAI', render: renderStatus },
    {
      title: 'Tùy chọn', key: 'actions', render: (_, record) => (
        <Space>
          {record.TRANGTHAI === 'Chờ phê duyệt' && (
            <>
              <Button icon={<CheckCircleOutlined />} onClick={() => handleAction('approve', record)}>Phê duyệt</Button>
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
      )
    }
  ];

  return (
    <Layout style={{ background: '#fff' }}>
      <Content style={{ padding: 20 }}>
        <Space style={{ marginBottom: 16 }}>
          <Input.Search placeholder="Tìm kiếm khen thưởng..." enterButton allowClear onSearch={onSearch} style={{ width: 300 }} />
          <Upload accept=".xlsx,.xls" showUploadList={false} beforeUpload={handleImport}>
            <Button icon={<UploadOutlined />}>Import Excel</Button>
          </Upload>
          <Button type="primary" onClick={() => openModal(null)}>Thêm Khen Thưởng</Button>
        </Space>

        <Table columns={columns} dataSource={data} rowKey="MAKT" loading={loading} pagination={{ pageSize: 10 }} />

        <Modal title={isEdit ? 'Sửa Khen Thưởng' : 'Thêm Khen Thưởng'} visible={modalVisible} onCancel={() => setModalVisible(false)} onOk={() => form.submit()}>
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item name="MAKT" label="Mã KT"><Input disabled /></Form.Item>
            <Form.Item name="MANV" label="Nhân viên" rules={[{ required: true }]}>
              <Select placeholder="Chọn nhân viên">{employees.map(emp => <Option key={emp.MANV} value={emp.MANV}>{emp.TENNV}</Option>)}</Select>
            </Form.Item>
            <Form.Item name="LOAIKHENTHUONG" label="Loại khen thưởng" rules={[{ required: true }]}>
              <Select placeholder="Chọn loại khen thưởng"><Option value="Thưởng tiền">Thưởng tiền</Option><Option value="Giấy khen">Giấy khen</Option></Select>
            </Form.Item>
            <Form.Item name="NGAYKHENTHUONG" label="Ngày khen thưởng" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
            <Form.Item name="LYDO" label="Lý do"><Input.TextArea rows={2} /></Form.Item>
            <Form.Item name="GIATRITHUONG" label="Giá trị"><InputNumber style={{ width: '100%' }} min={0} /></Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default KhenThuongPage;