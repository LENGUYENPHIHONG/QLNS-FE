// File: src/pages/EmployeePage/EmployeeRewardsTab.js
import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Tag,
  message
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  UndoOutlined,
  UploadOutlined,
  PlusOutlined
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
  importKhenThuongFromExcel
} from '../../api/khenThuongApi';

const { Option } = Select;

export default function EmployeeRewardsTab({ employeeId }) {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  // fetch only this employee’s rewards
  const loadData = useCallback(async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const res = await getDanhSachKT({ maNhanVien: employeeId, search: searchTerm });
      const list = (res.Data ?? res.data) || [];
      setData(list);
    } catch {
      toast.error('Không thể tải dữ liệu khen thưởng');
    } finally {
      setLoading(false);
    }
  }, [employeeId, searchTerm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSearch = v => setSearchTerm(v);

  const openModal = async record => {
    form.resetFields();
    if (record) {
      setIsEdit(true);
      setCurrentRecord(record);
      form.setFieldsValue({
        MAKT: record.MAKT,
        MANV: record.MANV,
        LOAIKHENTHUONG: record.LOAIKHENTHUONG,
        NGAYKHENTHUONG: moment(record.NGAYKHENTHUONG),
        LYDO: record.LYDO,
        GIATRITHUONG: record.GIATRITHUONG,
      });
    } else {
      setIsEdit(false);
      try {
        const code = await getMaKT();
        form.setFieldsValue({ MAKT: code, MANV: employeeId });
      } catch {
        toast.error('Không thể lấy mã mới');
      }
    }
    setModalVisible(true);
  };

  const handleSubmit = async values => {
  const payload = {
    ...values,
    NGAYKHENTHUONG: values.NGAYKHENTHUONG.format('YYYY-MM-DD'),
    GIATRITHUONG: values.GIATRITHUONG ?? 0,
    TRANGTHAI: isEdit ? currentRecord.TRANGTHAI : 'Chờ phê duyệt',
    NGUOITAO: 'System'
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
    toast.error(err.response?.data?.Message || 'Lỗi lưu dữ liệu');
  }
};

  const handleImport = async file => {
    const fm = new FormData();
    fm.append('file', file);
    toast.loading('Import...');
    try {
      const res = await importKhenThuongFromExcel(fm);
      toast.destroy();
      toast.success(res.data.Message || 'Import thành công');
      if (Array.isArray(res.data.Loi) && res.data.Loi.length) {
        res.data.Loi.forEach(line => toast.warn(line));
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.Message || 'Import thất bại');
    }
    return false;
  };

  const handleAction = async (action, record) => {
    try {
      switch (action) {
        case 'approve': await approveKhenThuong(record.MAKT); break;
        case 'reject': await rejectKhenThuong(record.MAKT); break;
        case 'cancel': await cancelKhenThuong(record.MAKT, { LYDOHUY: 'Hủy theo yêu cầu' }); break;
        case 'delete': await deleteKhenThuong(record.MAKT); break;
      }
      toast.success('Thao tác thành công');
      loadData();
    } catch {
      toast.error('Thao tác thất bại');
    }
  };

  const renderStatus = st => {
    const map = {
      'Chờ phê duyệt': 'orange',
      'Đã duyệt': 'green',
      'Từ chối': 'red',
      'Đã hủy': 'default'
    };
    return <Tag color={map[st] || 'blue'}>{st}</Tag>;
  };

  const columns = [
    { title: 'Mã KT', dataIndex: 'MAKT', key: 'MAKT' },
    { title: 'Loại', dataIndex: 'LOAIKHENTHUONG', key: 'LOAIKHENTHUONG' },
    {
      title: 'Ngày KT', dataIndex: 'NGAYKHENTHUONG', key: 'NGAYKHENTHUONG',
      render: d => moment(d).format('YYYY-MM-DD')
    },
    { title: 'Lý do', dataIndex: 'LYDO', key: 'LYDO' },
    { title: 'Giá trị', dataIndex: 'GIATRITHUONG', key: 'GIATRITHUONG' },
    {
      title: 'Trạng thái', dataIndex: 'TRANGTHAI', key: 'TRANGTHAI',
      render: renderStatus
    },
    {
      title: 'Tùy chọn',
      key: 'actions',
      render: (_, rec) => (
        <Space>
          {rec.TRANGTHAI === 'Chờ phê duyệt' && <>
            <Button size="small" onClick={() => handleAction('approve', rec)} icon={<CheckCircleOutlined />}>Phê duyệt</Button>
            <Button size="small" danger onClick={() => handleAction('reject', rec)} icon={<CloseCircleOutlined />}>Từ chối</Button>
            <Button size="small" onClick={() => openModal(rec)} icon={<EditOutlined />}>Sửa</Button>
            <Button size="small" danger onClick={() => handleAction('delete', rec)} icon={<DeleteOutlined />}>Xóa</Button>
          </>}
          {rec.TRANGTHAI === 'Đã duyệt' && (
            <Button size="small" danger onClick={() => handleAction('cancel', rec)} icon={<UndoOutlined />}>Hủy</Button>
          )}
          {['Từ chối', 'Đã hủy'].includes(rec.TRANGTHAI) && (
            <Button size="small" danger onClick={() => handleAction('delete', rec)} icon={<DeleteOutlined />}>Xóa</Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 16 }}>
      <Space style={{ marginBottom: 12 }}>
        <Input.Search
          placeholder="Tìm kiếm..."
          enterButton={<SearchOutlined />}
          allowClear
          onSearch={onSearch}
        />
        <Upload beforeUpload={handleImport} showUploadList={false} accept=".xlsx,.xls">
          <Button icon={<UploadOutlined />}>Import Excel</Button>
        </Upload>
        <Button type="primary" onClick={() => openModal(null)} icon={<PlusOutlined />}>
          Thêm Khen Thưởng
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="MAKT"
        loading={loading}
        pagination={false}
      />

      <Modal
        title={isEdit ? 'Sửa Khen Thưởng' : 'Thêm Khen Thưởng'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        okText="Lưu"
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="MANV" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="MAKT" label="Mã KT">
            <Input disabled />
          </Form.Item>
          <Form.Item name="LOAIKHENTHUONG" label="Loại" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại">
              <Option value="Thưởng tiền">Thưởng tiền</Option>
              <Option value="Giấy khen">Giấy khen</Option>
            </Select>
          </Form.Item>
          <Form.Item name="NGAYKHENTHUONG" label="Ngày khen thưởng" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="LYDO" label="Lý do">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="GIATRITHUONG" label="Giá trị">
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
