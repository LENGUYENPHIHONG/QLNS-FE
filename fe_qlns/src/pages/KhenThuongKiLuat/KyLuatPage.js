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
import { fetchEmployees } from '../../api/employeeApi';

const { Content } = Layout;
const { Option } = Select;

export default function KyLuatPage() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [current, setCurrent] = useState(null);

  const loadEmployees = useCallback(async () => {
    try {
      const res = await fetchEmployees();
      const list = res.data?.Data || res;
      setEmployees(Array.isArray(list) ? list : []);
    } catch {
      toast.error('Không thể tải danh sách nhân viên');
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDanhSachKL({ search: searchTerm });
      setData(res.data?.Data || res.Data || []);
    } catch {
      toast.error('Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);
  useEffect(() => { loadData(); }, [loadData]);

  const onSearch = value => setSearchTerm(value);

  const openModal = async record => {
    form.resetFields();
    if (record) {
      setIsEdit(true);
      setCurrent(record);
      form.setFieldsValue({
        ...record,
        NGAYKYLUAT: moment(record.NGAYKYLUAT),
      });
    } else {
      setIsEdit(false);
      try {
        const code = await getMaKL();
        form.setFieldsValue({ MAKL: code });
      } catch {
        toast.error('Không thể lấy mã mới');
      }
    }
    setModalVisible(true);
  };

  const handleSubmit = async values => {
    const payload = {
      ...values,
      NGAYKYLUAT: values.NGAYKYLUAT.format('YYYY-MM-DD'),
      TRANGTHAI: isEdit ? current.TRANGTHAI : 'Chờ phê duyệt',
      NGUOITAO: 'System',
    };
    try {
      if (isEdit) await updateKyLuat(current.MAKL, payload);
      else await addKyLuat(payload);
      toast.success(isEdit ? 'Cập nhật thành công' : 'Thêm mới thành công');
      setModalVisible(false);
      loadData();
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.errors) {
        Object.values(resp.errors).flat().forEach(m => toast.error(m));
      } else {
        toast.error(resp?.Message || 'Lỗi xử lý');
      }
    }
  };

  const handleImport = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  toast.info('Đang import...');
  try {
    // importKyLuatFromExcel trả về trực tiếp `res.data`
    const res = await importKyLuatFromExcel(fd);
    const { Message, Loi } = res;   // <-- chính xác
    toast.success(Message || 'Import thành công');
    if (Array.isArray(Loi) && Loi.length > 0) {
      Loi.forEach(l => toast.warn(l));
    }
    // Sau khi import thành công, gọi loadData() để refresh ngay
    loadData();
  } catch (err) {
    const resp = err.response?.data;
    const errMsg = resp?.Detail || resp?.Message || 'Import thất bại';
    toast.error(errMsg);
  }
  return false;
};

  const handleAction = async (action, rec) => {
    try {
      if (action==='approve') await approveKyLuat(rec.MAKL);
      if (action==='reject') await rejectKyLuat(rec.MAKL);
      if (action==='cancel') await cancelKyLuat(rec.MAKL, { LYDOHUY: 'Hủy theo yêu cầu' });
      if (action==='delete') await deleteKyLuat(rec.MAKL);
      toast.success('Thao tác thành công');
      loadData();
    } catch {
      toast.error('Thao tác thất bại');
    }
  };

  const renderStatus = st => {
    const map = {
      'Chờ phê duyệt':'orange', 'Đã duyệt':'green', 'Từ chối':'red','Đã hủy':'default'
    };
    return <Tag color={map[st]||'blue'}>{st}</Tag>;
  };

  const columns = [
    { title:'Mã KL', dataIndex:'MAKL', key:'MAKL' },
    { title:'Nhân viên', dataIndex:'TENNV', key:'TENNV' },
    { title:'Loại', dataIndex:'LOAIKYLUAT', key:'LOAIKYLUAT' },
    { title:'Ngày KL', dataIndex:'NGAYKYLUAT', key:'NGAYKYLUAT', render: d=> moment(d).format('YYYY-MM-DD') },
    { title:'Lý do', dataIndex:'LYDO', key:'LYDO' },
    { title:'Mức phạt', dataIndex:'MUCPHAT', key:'MUCPHAT' },
    { title:'Trạng thái', dataIndex:'TRANGTHAI', key:'TRANGTHAI', render:renderStatus },
    { title:'Tùy chọn', key:'actions', render: (_, r) => (
      <Space>
        {r.TRANGTHAI==='Chờ phê duyệt' && <>
          <Button icon={<CheckCircleOutlined />} onClick={()=>handleAction('approve',r)}>Phê duyệt</Button>
          <Button icon={<CloseCircleOutlined />} danger onClick={()=>handleAction('reject',r)}>Từ chối</Button>
          <Button icon={<EditOutlined />} onClick={()=>openModal(r)}>Sửa</Button>
          <Button icon={<DeleteOutlined />} danger onClick={()=>handleAction('delete',r)}>Xóa</Button>
        </>}
        {r.TRANGTHAI==='Đã duyệt' &&
          <Button icon={<UndoOutlined />} danger onClick={()=>handleAction('cancel',r)}>Hủy</Button>}
        {['Từ chối','Đã hủy'].includes(r.TRANGTHAI) &&
          <Button icon={<DeleteOutlined />} danger onClick={()=>handleAction('delete',r)}>Xóa</Button>}
      </Space>
    )}
  ];

  return (
    <Layout style={{background:'#fff'}}>
      <Content style={{padding:20}}>
        <Space style={{marginBottom:16}}>
          <Input.Search placeholder="Tìm kiếm kỷ luật..." enterButton allowClear onSearch={onSearch} style={{width:300}}/>
          <Upload accept=".xlsx,.xls" showUploadList={false} beforeUpload={handleImport}>
            <Button icon={<UploadOutlined />}>Import Excel</Button>
          </Upload>
          <Button type="primary" onClick={()=>openModal(null)}>Thêm Kỷ luật</Button>
        </Space>
        <Table columns={columns} dataSource={data} rowKey="MAKL" loading={loading} pagination={{pageSize:10}}/>
        <Modal title={isEdit?'Sửa Kỷ luật':'Thêm Kỷ luật'} visible={modalVisible} onCancel={()=>setModalVisible(false)} onOk={()=>form.submit()}>
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item name="MAKL" label="Mã KL"><Input disabled/></Form.Item>
            <Form.Item name="MANV" label="Nhân viên" rules={[{required:true}]}>  
              <Select placeholder="Chọn nhân viên">{employees.map(e=><Option key={e.MANV} value={e.MANV}>{e.TENNV}</Option>)}</Select>
            </Form.Item>
            <Form.Item name="LOAIKYLUAT" label="Loại kỷ luật" rules={[{required:true}]}>  
              <Select placeholder="Chọn loại kỷ luật"><Option value="Phạt tiền">Phạt tiền</Option><Option value="Cảnh cáo">Cảnh cáo</Option></Select>
            </Form.Item>
            <Form.Item name="NGAYKYLUAT" label="Ngày kỷ luật" rules={[{required:true}]}>  
              <DatePicker style={{width:'100%'}}/>
            </Form.Item>
            <Form.Item name="LYDO" label="Lý do">
              <Input.TextArea rows={2}/>
            </Form.Item>
            <Form.Item name="MUCPHAT" label="Mức phạt">
              <InputNumber style={{width:'100%'}} min={0}/>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}
