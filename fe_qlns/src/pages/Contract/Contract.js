// File: src/pages/ContractManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Layout,
  Form,
  Input,
  InputNumber,
  Button,
  Table,
  Space,
  Modal,
  Popconfirm,
  Select,
  DatePicker,
  Upload,
  Dropdown,
  Menu,
  Tag
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  DownOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import {
  fetchContracts,
  getNewContractCode,
  createContract,
  approveContract,
  rejectContract,
  requestEndContract,
  confirmEndContract,
  deleteContract,
  renewContracts,
  uploadContractFile
} from '../../api/contractApi';
import { fetchEmployees } from '../../api/employeeApi';
import { fetchContractTypes } from '../../api/contractTypeApi';

const { Content } = Layout;
const { Option } = Select;

export default function ContractManagement() {
  const [form] = Form.useForm();
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters & pagination
  const [filters, setFilters] = useState({
    malhd: undefined,
    manv: undefined,
    trangThai: undefined,
    search: undefined,
    deletion: 'active'
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // modal states
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [endModalVisible, setEndModalVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // load lookup data
  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [eRes, tRes] = await Promise.all([
          fetchEmployees(),
          fetchContractTypes()
        ]);
        if (eRes.data?.Data) setEmployees(eRes.data.Data);
        if (tRes.data?.Data) setContractTypes(tRes.data.Data);
      } catch {
        toast.error('Lỗi khi tải dữ liệu phụ');
      }
    };
    loadLookups();
  }, []);

  // fetch contracts
  const loadData = async (p = 1, ps = 10) => {
    setLoading(true);
    try {
      let includeDeleted = false;
      let onlyDeleted = false;
      if (filters.deletion === 'all') includeDeleted = true;
      else if (filters.deletion === 'deleted') onlyDeleted = true;

      const res = await fetchContracts({
        page: p,
        pageSize: ps,
        malhd: filters.malhd,
        manv: filters.manv,
        search: filters.search,
        trangThai: filters.trangThai,
        includeDeleted,
        onlyDeleted
      });
      if (res.data?.Success) {
        setContracts(res.data.Data);
        setTotal(res.data.Total);
        setPage(res.data.Page);
        setPageSize(res.data.PageSize);
      } else {
        toast.error(res.data?.Message || 'Lỗi tải danh sách');
      }
    } catch {
      toast.error('Lỗi gọi API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page, pageSize);
  }, [filters, page, pageSize]);

  // handlers
  const handleAdd = async values => {
    setLoading(true);
    try {
      const codeRes = await getNewContractCode();
      const payload = {
        Id: codeRes.data.code,
        MANV: values.employeeId,
        MALHD: values.contractTypeId,
        LUONGCOBAN: values.salary,
        NGAYBATDAU: values.effectiveDate.format('YYYY-MM-DD'),
        TRANGTHAI: 'Chờ phê duyệt'
      };
      const createRes = await createContract(payload);
      if (createRes.data?.Success) {
        toast.success(createRes.data.Message);
        setAddModalVisible(false);
        form.resetFields();
        loadData(page, pageSize);
      } else {
        toast.error(createRes.data?.Message);
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || 'Lỗi thêm hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async id => {
    setLoading(true);
    try {
      await approveContract(id);
      toast.success('Đã duyệt');
      loadData(page, pageSize);
    } catch {
      toast.error('Lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async id => {
    setLoading(true);
    try {
      await rejectContract(id);
      toast.success('Đã từ chối');
      loadData(page, pageSize);
    } catch {
      toast.error('Lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestEnd = id => {
    setSelectedContractId(id);
    setCancelReason('');
    setEndModalVisible(true);
  };

  const confirmEnd = async () => {
    if (!cancelReason.trim()) return toast.warning('Nhập lý do');
    setLoading(true);
    try {
      await requestEndContract(selectedContractId, { LYDOHUY: cancelReason, NGAYHUY: new Date().toISOString() });
      toast.success('Yêu cầu kết thúc gửi');
      setEndModalVisible(false);
      loadData(page, pageSize);
    } catch {
      toast.error('Lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEnd = async id => {
    setLoading(true);
    try {
      await confirmEndContract(id);
      toast.success('Đã xác nhận');
      loadData(page, pageSize);
    } catch {
      toast.error('Lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    setLoading(true);
    try {
      await deleteContract(id);
      toast.success('Đã xóa');
      loadData(page, pageSize);
    } catch {
      toast.error('Lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    if (!selectedRowKeys.length) return toast.warning('Chọn ít nhất 1');
    setLoading(true);
    try {
      await renewContracts(selectedRowKeys);
      toast.success('Gia hạn xong');
      setSelectedRowKeys([]);
      loadData(page, pageSize);
    } catch {
      toast.error('Lỗi');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
  if (!uploadFiles.length) {
    toast.warning('Vui lòng chọn file PDF');
    return;
  }

  const file = uploadFiles[0].originFileObj;
  // Validate client-side để tránh gửi sai định dạng
  if (file.type !== 'application/pdf') {
    toast.error('Chỉ hỗ trợ file PDF');
    return;
  }

  const fd = new FormData();
  fd.append('AnhFile', file);

  setLoading(true);
   try {
    // record.Id (chữ I hoa) mới đúng
    await uploadContractFile(currentRecord.Id, fd);
    toast.success('Upload thành công');
    loadData(page, pageSize);
    setUploadVisible(false);
    setUploadFiles([]);
  } catch (err) {
    console.error(err);
    toast.error('Lỗi trong quá trình upload');
  } finally {
    setLoading(false);
  }
};

  const menu = record => (
    <Menu>
      <Menu.Item key="view">
        <a href={record.ANH} target="_blank" rel="noopener noreferrer">
          Xem hợp đồng
        </a>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'TENNV',
      key: 'TENNV',
      render: (text, record) => (
        <Dropdown overlay={menu(record)} trigger={['click']}>
          <Button type="link">{text} <DownOutlined /></Button>
        </Dropdown>
      )
    },
    { title: 'Loại HD', dataIndex: 'TENLHD', key: 'TENLHD' },
    { title: 'Lương CB', dataIndex: 'LUONGCOBAN', key: 'LUONGCOBAN', render: v => v?.toLocaleString() || '—' },
    { title: 'Hiệu lực từ', dataIndex: 'NGAYBATDAU', key: 'NGAYBATDAU', render: d => d ? dayjs(d).format('YYYY-MM-DD') : '—' },
    { title: 'Kết thúc', dataIndex: 'NGAYKETTHUC', key: 'NGAYKETTHUC', render: d => d ? dayjs(d).format('YYYY-MM-DD') : '—' },
    {
      title: 'Trạng thái',
      dataIndex: 'TRANGTHAI',
      key: 'TRANGTHAI',
      render: st => {
        let color = 'default';
        if (st === 'Chờ phê duyệt') color = 'orange';
        else if (st === 'Đang hiệu lực') color = 'green';
        else if (st === 'Sắp hết hiệu lực') color = 'gold';
        else if (st === 'Hết hiệu lực') color = 'red';
        return <Tag color={color}>{st}</Tag>;
      }
    },
    {
      title: 'Upload',
      key: 'upload',
      render: (_, r) => (
        <Button icon={<UploadOutlined />} onClick={() => { setCurrentRecord(r); setUploadVisible(true); }} />
      )
    },
    {
      title: 'Tùy chọn',
      key: 'actions',
      render: (_, r) => (
        <Space>
          {r.TRANGTHAI === 'Chờ phê duyệt' && (
            <>
              <Button icon={<CheckCircleOutlined />} onClick={() => handleApprove(r.Id)}>Duyệt</Button>
              <Button danger onClick={() => handleReject(r.Id)}>Từ chối</Button>
            </>
          )}
          {['Đang hiệu lực','Chờ phê duyệt','Sắp hết hiệu lực'].includes(r.TRANGTHAI) && (
            <Button danger onClick={() => handleRequestEnd(r.Id)}>Kết thúc</Button>
          )}
          {r.TRANGTHAI === 'Chờ xử lý kết thúc' && (
            <Button onClick={() => handleConfirmEnd(r.Id)}>Xác nhận</Button>
          )}
          {['Hết hiệu lực'].includes(r.TRANGTHAI) && (
            <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(r.Id)} okText="Xóa" cancelText="Hủy">
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ background: '#fff' }}>
      <Content style={{ padding: 20 }}>
        <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
          <Select allowClear placeholder="Loại hợp đồng" style={{ width: 180 }} value={filters.malhd} onChange={v => setFilters(f => ({ ...f, malhd: v }))}>
            {contractTypes.map(t => <Option key={t.MALHD} value={t.MALHD}>{t.TENLHD}</Option>)}
          </Select>
          <Select allowClear placeholder="Nhân viên" style={{ width: 180 }} value={filters.manv} onChange={v => setFilters(f => ({ ...f, manv: v }))}>
            {employees.map(e => <Option key={e.MANV} value={e.MANV}>{e.TENNV}</Option>)}
          </Select>
          <Select allowClear placeholder="Trạng thái" style={{ width: 150 }} value={filters.trangThai} onChange={v => setFilters(f => ({ ...f, trangThai: v }))}>
            <Option value="Chờ phê duyệt">Chờ phê duyệt</Option>
            <Option value="Đang hiệu lực">Đang hiệu lực</Option>
            <Option value="Sắp hết hiệu lực">Sắp hết hiệu lực</Option>
            <Option value="Hết hiệu lực">Hết hiệu lực</Option>
          </Select>
          {/* <Select allowClear placeholder="Trạng thái xóa" style={{ width: 150 }} value={filters.deletion} onChange={v => setFilters(f => ({ ...f, deletion: v }))}>
            <Option value="all">Tất cả</Option>
            <Option value="active">Chưa xóa</Option>
            <Option value="deleted">Đã xóa</Option>
          </Select> */}
          <Input allowClear placeholder="Tìm kiếm..." prefix={<SearchOutlined />} style={{ width: 240 }} value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} onPressEnter={() => loadData(1, pageSize)} />
          <Button type="primary" icon={<SearchOutlined />} onClick={() => loadData(1, pageSize)}>Lọc</Button>
          <Button icon={<ReloadOutlined />} onClick={() => { setFilters({ malhd: undefined, manv: undefined, search: undefined, trangThai: undefined, deletion: 'active' }); loadData(1, pageSize); }}>Đặt lại</Button>
          <Button type="primary" onClick={handleRenew} disabled={!selectedRowKeys.length}>Gia hạn</Button>
          <Button type="primary" onClick={() => setAddModalVisible(true)}>Thêm hợp đồng</Button>
        </Space>
        <Table
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
          columns={columns}
          dataSource={contracts}
          rowKey="Id"
          loading={loading}
          pagination={{ current: page, pageSize, total, showSizeChanger: true, onChange: (p, ps) => loadData(p, ps) }}
        />

        <Modal visible={addModalVisible} title="Thêm hợp đồng mới" onCancel={() => setAddModalVisible(false)} footer={null}>
          <Form layout="vertical" form={form} onFinish={handleAdd}>
            <Form.Item name="employeeId" label="Nhân viên" rules={[{ required: true }]}>
              <Select placeholder="Chọn nhân viên">
                {employees.map(e => <Option key={e.MANV} value={e.MANV}>{e.TENNV}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="contractTypeId" label="Loại hợp đồng" rules={[{ required: true }]}>
              <Select placeholder="Chọn loại hợp đồng">
                {contractTypes.map(t => <Option key={t.MALHD} value={t.MALHD}>{t.TENLHD}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item name="salary" label="Lương cơ bản" rules={[{ required: true, message: 'Nhập lương cơ bản' }]}>
              <InputNumber style={{ width: '100%' }} formatter={v => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => v.replace(/\D/g, '')} />
            </Form.Item>
            <Form.Item name="effectiveDate" label="Ngày hiệu lực" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" loading={loading}>Thêm</Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal visible={endModalVisible} title="Lý do kết thúc" onCancel={() => setEndModalVisible(false)} onOk={confirmEnd}>
          <Input.TextArea rows={4} value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="Nhập lý do kết thúc" />
        </Modal>

        <Modal visible={uploadVisible} title="Upload hợp đồng" onCancel={() => setUploadVisible(false)} onOk={handleUpload}>
          <Upload fileList={uploadFiles} beforeUpload={() => false} onChange={({ fileList }) => setUploadFiles(fileList)} accept=".pdf" maxCount={1}>
            <Button icon={<UploadOutlined />}>Chọn PDF</Button>
          </Upload>
        </Modal>
      </Content>
    </Layout>
  );
}