// File: src/pages/EmployeePage/EmployeeKyLuatTab.js
import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import {
  Table, Button, Space, Modal, Form, Select,
  DatePicker, Input, InputNumber, Upload, Tag
} from 'antd';
import {
  SearchOutlined, DeleteOutlined, CheckCircleOutlined,
  CloseCircleOutlined, EditOutlined, UndoOutlined,
  UploadOutlined, PlusOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import {
  getMaKL,
  getDanhSachKL,
  addKyLuat,
  updateKyLuat,
  deleteKyLuat,
  approveKyLuat,
  rejectKyLuat,
  cancelKyLuat,
  importKyLuatFromExcel,
} from '../../api/kyLuatApi';

const { Option } = Select;

export default function EmployeeKyLuatTab({ employeeId }) {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [current, setCurrent] = useState(null);

  // lấy dữ liệu kỷ luật của nhân viên
  const loadData = useCallback(async () => {
    if (!employeeId) {
      setData([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getDanhSachKL({ maNhanVien: employeeId, search: searchTerm });
      const list = (res.Data ?? res.data) || [];
      setData(list);
      //console.log('Kỷ luật:', res.data?.Data || []);
    } catch {
      toast.error('Không thể tải dữ liệu kỷ luật');
    } finally {
      setLoading(false);
    }
  }, [employeeId, searchTerm]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // tìm kiếm
  const onSearch = value => setSearchTerm(value);

  // mở modal thêm/sửa
  const openModal = async record => {
    form.resetFields();
    if (record) {
      setIsEdit(true);
      setCurrent(record);
      form.setFieldsValue({
        MAKL: record.MAKL,
        MANV: record.MANV,
        LOAIKYLUAT: record.LOAIKYLUAT,
        NGAYKYLUAT: moment(record.NGAYKYLUAT),
        LYDO: record.LYDO,
        MUCPHAT: record.MUCPHAT,
      });
    } else {
      setIsEdit(false);
      try {
        const code = await getMaKL();
        form.setFieldsValue({ MAKL: code, MANV: employeeId });
      } catch {
        toast.error('Không thể lấy mã kỷ luật mới');
      }
    }
    setModalOpen(true);
  };

  // submit form
  const handleSubmit = async values => {
    setLoading(true);
    const payload = {
      ...values,
      NGAYKYLUAT: values.NGAYKYLUAT.format('YYYY-MM-DD'),
      TRANGTHAI: isEdit ? current.TRANGTHAI : 'Chờ phê duyệt',
      NGUOITAO: 'System',
    };
    try {
      if (isEdit) {
        await updateKyLuat(current.MAKL, payload);
        toast.success('Cập nhật thành công');
      } else {
        await addKyLuat(payload);
        toast.success('Thêm mới thành công');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.errors) {
        Object.values(resp.errors).flat().forEach(m => toast.error(m));
      } else {
        toast.error(resp?.Message || 'Lỗi xử lý');
      }
    } finally {
      setLoading(false);
    }
  };

  // hành động approve/reject/cancel/delete
  const handleAction = async (action, rec) => {
    try {
      if (action === 'approve') await approveKyLuat(rec.MAKL);
      if (action === 'reject')  await rejectKyLuat(rec.MAKL);
      if (action === 'cancel')  await cancelKyLuat(rec.MAKL, { LYDOHUY: 'Hủy theo yêu cầu' });
      if (action === 'delete')  await deleteKyLuat(rec.MAKL);
      toast.success('Thao tác thành công');
      loadData();
    } catch {
      toast.error('Thao tác thất bại');
    }
  };

  // import Excel
  const handleImport = async file => {
    const fd = new FormData();
    fd.append('file', file);
    toast.info('Đang import...');
    try {
      const res = await importKyLuatFromExcel(fd);
      const { Message, Loi } = res.data;
      toast.success(Message || 'Import thành công');
      (Loi || []).forEach(l => toast.warn(l));
      loadData();
    } catch {
      toast.error('Import thất bại');
    }
    return false;
  };

  // hiển thị trạng thái màu
  const renderStatus = st => {
    const map = {
      'Chờ phê duyệt': 'orange',
      'Đã duyệt':       'green',
      'Từ chối':        'red',
      'Đã hủy':         'default',
    };
    return <Tag color={map[st] || 'blue'}>{st}</Tag>;
  };

  const columns = [
    { title: 'Mã KL',          dataIndex: 'MAKL',          key: 'MAKL' },
    { title: 'Loại kỷ luật',   dataIndex: 'LOAIKYLUAT',   key: 'LOAIKYLUAT' },
    { title: 'Ngày KL',        dataIndex: 'NGAYKYLUAT',    key: 'NGAYKYLUAT',
      render: d => moment(d).format('YYYY-MM-DD') },
    { title: 'Lý do',          dataIndex: 'LYDO',          key: 'LYDO' },
    { title: 'Mức phạt',       dataIndex: 'MUCPHAT',       key: 'MUCPHAT' },
    { title: 'Trạng thái',     dataIndex: 'TRANGTHAI',     key: 'TRANGTHAI',
      render: renderStatus },
    {
      title: 'Tùy chọn',
      key: 'actions',
      render: (_, rec) => (
        <Space size="small">
          {rec.TRANGTHAI === 'Chờ phê duyệt' && <>
            <Button onClick={()=>handleAction('approve',rec)} icon={<CheckCircleOutlined />}>Phê duyệt</Button>
            <Button danger onClick={()=>handleAction('reject',rec)} icon={<CloseCircleOutlined />}>Từ chối</Button>
            <Button onClick={()=>openModal(rec)} icon={<EditOutlined />}>Sửa</Button>
            <Button danger onClick={()=>handleAction('delete',rec)} icon={<DeleteOutlined />}>Xóa</Button>
          </>}
          {rec.TRANGTHAI === 'Đã duyệt' && (
            <Button danger onClick={()=>handleAction('cancel',rec)} icon={<UndoOutlined />}>Hủy</Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm kỷ luật..."
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={onSearch}
          style={{ width: 240 }}
        />
        <Upload
          accept=".xlsx,.xls"
          showUploadList={false}
          beforeUpload={handleImport}
        >
          <Button icon={<UploadOutlined />}>Import Excel</Button>
        </Upload>
        <Button type="primary" icon={<PlusOutlined />} onClick={()=>openModal(null)}>
          Thêm Kỷ luật
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="MAKL"
        loading={loading}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={isEdit ? 'Sửa Kỷ luật' : 'Thêm Kỷ luật'}
        open={modalOpen}
        onCancel={()=>setModalOpen(false)}
        okText="Lưu"
        onOk={()=>form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item name="MAKL" label="Mã KL">
            <Input disabled/>
          </Form.Item>
          <Form.Item name="MANV" label="Nhân viên" hidden>
            <Input/>
          </Form.Item>
          <Form.Item name="LOAIKYLUAT" label="Loại kỷ luật" rules={[{ required: true }]}>
            <Select placeholder="Chọn loại kỷ luật">
              <Option value="Phạt tiền">Phạt tiền</Option>
              <Option value="Cảnh cáo">Cảnh cáo</Option>
            </Select>
          </Form.Item>
          <Form.Item name="NGAYKYLUAT" label="Ngày kỷ luật" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }}/>
          </Form.Item>
          <Form.Item name="LYDO" label="Lý do">
            <Input.TextArea rows={2}/>
          </Form.Item>
          <Form.Item name="MUCPHAT" label="Mức phạt">
            <InputNumber style={{ width: '100%' }} min={0}/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
