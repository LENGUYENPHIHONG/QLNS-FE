import React, { useState, useEffect } from "react";
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
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  DownOutlined,
  ReloadOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

import {
  fetchContracts,
  createContract,
  deleteContract,
  approveContract,
  rejectContract,
  getNewContractCode,
  requestEndContract,
  confirmEndContract,
  uploadContractFile,
  renewContracts
} from "../../api/contractApi";
import { fetchEmployees } from "../../api/employeeApi";
import { fetchContractTypes } from "../../api/contractTypeApi";
import { toast } from 'react-toastify';
const { Content } = Layout;
const { Option } = Select;

export default function ContractManagement() {
  const [form] = Form.useForm();
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [endModalVisible, setEndModalVisible] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [hdRes, nvRes, lhdRes] = await Promise.all([
        fetchContracts(),
        fetchEmployees(),
        fetchContractTypes(),
      ]);
      if (hdRes.data?.Success) {
        setContracts(hdRes.data.Data);
      }
      if (nvRes.data?.Data) setEmployees(nvRes.data.Data);
      if (lhdRes.data?.Data) setContractTypes(lhdRes.data.Data);
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }

  const handleAddContract = async values => {
    setLoading(true);
    try {
      const codeRes = await getNewContractCode();
      const payload = {
        Id: codeRes.data.code,
        MANV: values.employeeId,
        MALHD: values.contractTypeId,
        LUONGCOBAN: values.salary,
        NGAYBATDAU: values.effectiveDate.format("YYYY-MM-DD"),
        TRANGTHAI: "Chờ phê duyệt"
      };
      const createRes = await createContract(payload);
      if (createRes.data?.Success) {
        toast.success(createRes.data?.Message);
        setAddModalVisible(false);
        form.resetFields();
        loadData();
      } else {
        toast.error(createRes.data?.Message || "Lỗi khi thêm hợp đồng");
      }
    } catch (err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  
  const handleApprove = async id => {
    setLoading(true);
    try {
      var res = await approveContract(id);
      toast.success(res.data?.Message);
      loadData();
    } catch(err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async id => {
    Modal.confirm({
      title: "Xác nhận từ chối hợp đồng?",
      okText: "Từ chối",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          var res = await rejectContract(id);
          toast.success(res.data?.Message);
          loadData();
        } catch {
          toast.error("Lỗi khi từ chối hợp đồng");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleRequestEnd = id => {
    setSelectedContractId(id);
    setCancelReason("");
    setEndModalVisible(true);
  };

  const confirmEnd = async () => {
    if (!cancelReason.trim()) return toast.warning("Vui lòng nhập lý do kết thúc");
    setLoading(true);
    try {
      var res = await requestEndContract(selectedContractId, { LYDOHUY: cancelReason, NGAYHUY: new Date().toISOString() });
      toast.success(res.data?.Message);
      setEndModalVisible(false);
      loadData();
    } catch(err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEnd = async id => {
    setLoading(true);
    try {
      var res = await confirmEndContract(id);
      toast.success(res.data?.Message);
      loadData();
    } catch( err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    setLoading(true);
    try {
      var res = await deleteContract(id);
      toast.success(res.data?.Message);
      loadData();
    } catch(err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    if (!selectedRowKeys.length) return toast.warning("Chọn ít nhất 1 hợp đồng để gia hạn");
    setLoading(true);
    try {
      var res = await renewContracts(selectedRowKeys);
      toast.success(res.data?.Message);
      setSelectedRowKeys([]);
      loadData();
    } catch(err) {
      toast.error(err.response.data.Message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFiles.length) return toast.warning("Chọn file PDF");
    const fd = new FormData();
    fd.append("MANV", currentRecord.MANV);
    fd.append("MALHD", currentRecord.MALHD);
    fd.append("AnhFile", uploadFiles[0].originFileObj);
    setLoading(true);
    try {
      const res = await uploadContractFile(fd);
      toast.success(res.data?.Message);
      loadData();
      setUploadVisible(false);
      setUploadFiles([]); 
    } catch {
      toast.error("Lỗi upload file");
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

  const columns = [,
    {
      title: 'Nhân viên',
      dataIndex: 'TENNV',
      key: 'TENNV',
      render: (text, record) => (
        <Dropdown overlay={menu(record)} trigger={['click']}>  
          <Button type="link">
            {text} <DownOutlined />
          </Button>
        </Dropdown>
      )
    },
    { title: 'Loại HD',      dataIndex: 'TENLHD',  key: 'TENLHD' },
    { title: 'Lương CB',     dataIndex: 'LUONGCOBAN', key: 'LUONGCOBAN', render: v => v?.toLocaleString() || '—' },
    { title: 'Hiệu lực từ', dataIndex: 'NGAYBATDAU', key: 'NGAYBATDAU', render: d => d ? dayjs(d).format('YYYY-MM-DD') : '—' },
    { title: 'Kết thúc',    dataIndex: 'NGAYKETTHUC', key: 'NGAYKETTHUC', render: d => d ? dayjs(d).format('YYYY-MM-DD') : '—' },
    { title: 'Trạng thái',  dataIndex: 'TRANGTHAI',   key: 'TRANGTHAI', render: st => {
        let color='default';
        if (st==='Chờ phê duyệt') color='orange';
        else if (st==='Đang hiệu lực') color='green';
        else if (st==='Sắp hết hiệu lực') color='gold';
        else if (st==='Hết hiệu lực') color='red';
        return <Tag color={color}>{st}</Tag>;
      }} ,
    { title: 'Upload',     key: 'upload', render: (_, r) => (
        <Button icon={<UploadOutlined />} onClick={()=>{setCurrentRecord(r);setUploadVisible(true);}} />
    )},
    { title: 'Tùy chọn',   key: 'actions', render: (_, r) => (
      <Space>
        {r.TRANGTHAI==='Chờ phê duyệt' && (
          <>
            <Button icon={<CheckCircleOutlined />} onClick={()=>handleApprove(r.Id)}>Duyệt</Button>
            <Button danger onClick={()=>handleReject(r.Id)}>Từ chối</Button>
          </>
        )}
        {['Đang hiệu lực','Chờ phê duyệt','Sắp hết hiệu lực'].includes(r.TRANGTHAI) && (
          <Button danger onClick={()=>handleRequestEnd(r.Id)}>Kết thúc</Button>
        )}
        {r.TRANGTHAI==='Chờ xử lý kết thúc' && (
          <Button type="primary" onClick={()=>handleConfirmEnd(r.Id)}>Xác nhận</Button>
        )}
        {['Hết hiệu lực','Không được duyệt'].includes(r.TRANGTHAI) && (
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(r.Id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        )}
      </Space>
    )}
  ];

  return (
    <Layout style={{ background:'#fff' }}>
      <Content style={{ padding:20 }}>
        <Space style={{ marginBottom:16 }}>
          <Input
            allowClear
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            style={{ width:240 }}
            value={searchTerm}
            onChange={e=>setSearchTerm(e.target.value)}
          />
          <Button type="primary" onClick={()=>setAddModalVisible(true)}>Thêm hợp đồng</Button>
          <Button onClick={handleRenew} disabled={!selectedRowKeys.length}>Gia hạn</Button>
        </Space>
        <Table
          rowSelection={{selectedRowKeys,onChange:setSelectedRowKeys}}
          columns={columns}
          dataSource={contracts.filter(c=>JSON.stringify(c).toLowerCase().includes(searchTerm.toLowerCase()))}
          rowKey="Id"
          loading={loading}
          pagination={false}
        />

        {/* Thêm hợp đồng Modal */}
        <Modal title="Thêm hợp đồng mới" visible={addModalVisible} onCancel={()=>setAddModalVisible(false)} footer={null}>
          <Form layout="vertical" form={form} onFinish={handleAddContract}>
            <Form.Item name="employeeId" label="Nhân viên" rules={[{required:true}]}>  
              <Select placeholder="Chọn nhân viên">{employees.map(e=> <Option key={e.MANV} value={e.MANV}>{e.TENNV}</Option>)}</Select>
            </Form.Item>
            <Form.Item name="contractTypeId" label="Loại hợp đồng" rules={[{required:true}]}>  
              <Select placeholder="Chọn loại hợp đồng">{contractTypes.map(t=> <Option key={t.MALHD} value={t.MALHD}>{t.TENLHD}</Option>)}</Select>
            </Form.Item>
            <Form.Item name="salary" label="Lương cơ bản" rules={[{required:true,message:'Nhập lương cơ bản'}]}>
              <InputNumber style={{width:'100%'}} formatter={v=>v.toString().replace(/\B(?=(\d{3})+(?!\d))/g,',')} parser={v=>v.replace(/\D/g,'')} />
            </Form.Item>
            <Form.Item name="effectiveDate" label="Ngày hiệu lực" rules={[{required:true}]}>  
              <DatePicker style={{width:'100%'}} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item style={{textAlign:'right'}}>
              <Button type="primary" htmlType="submit" loading={loading}>Thêm</Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Kết thúc hợp đồng Modal */}
        <Modal
          title="Lý do kết thúc hợp đồng"
          visible={endModalVisible}
          onCancel={()=>setEndModalVisible(false)}
          onOk={confirmEnd}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập lý do kết thúc..."
            value={cancelReason}
            onChange={e=>setCancelReason(e.target.value)}
          />
        </Modal>

        {/* Upload PDF Modal */}
        <Modal
          title="Upload file hợp đồng"
          visible={uploadVisible}
          onCancel={()=>setUploadVisible(false)}
          onOk={handleUpload}
        >
          <Upload
            fileList={uploadFiles}
            beforeUpload={()=>false}
            onChange={({fileList})=>setUploadFiles(fileList)}
            accept=".pdf"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn file PDF</Button>
          </Upload>
        </Modal>
      </Content>
    </Layout>
  );
}
