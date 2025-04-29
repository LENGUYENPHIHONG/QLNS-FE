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
  message,
  Select,
  DatePicker,
  Tag,
  Upload,
  Dropdown,
  Menu
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  DownOutlined
} from "@ant-design/icons";
import {
  fetchContracts,
  createContract,
  deleteContract,
  approveContract,
  rejectContract,
  getNewContractCode,
  endContract,
  uploadContractFile,
  renewContracts
} from "../../api/contractApi";
import { fetchEmployees } from "../../api/employeeApi";
import { fetchContractTypes } from "../../api/contractTypeApi";

const { Content } = Layout;
const { Option } = Select;

const ContractManagement = () => {
  const [form] = Form.useForm();
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const loadData = async () => {
    setLoading(true);
    try {
      const [hdRes, nvRes, lhdRes] = await Promise.all([
        fetchContracts(),
        fetchEmployees(),
        fetchContractTypes(),
      ]);
      if (hdRes.data?.Success) {
        const list = hdRes.data.Data.map(c => ({
          id: c.Id,
          manv: c.MANV,
          malhd: c.MALHD,
          employeeName: c.TENNV,
          fileUrl: c.ANH,
          contractType: c.TENLHD,
          salary: c.LUONGCOBAN,
          effectiveDate: c.NGAYBATDAU?.split("T")[0],
          endDate: c.NGAYKETTHUC?.split("T")[0] || "",
          status: c.TRANGTHAI,
        }));
        setContracts(list);
      }
      if (nvRes.data?.Data) setEmployees(nvRes.data.Data);
      if (lhdRes.data?.Data) setContractTypes(lhdRes.data.Data);
    } catch (err) {
      message.error("Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // View PDF
  const onView = record => {
    const fresh = contracts.find(c => c.id === record.id);
    if (!fresh?.fileUrl) return message.error("Chưa có file hợp đồng");
    const url = `${fresh.fileUrl}?t=${Date.now()}`;
    window.open(url, '_blank');
  };

  // Add Contract
  const handleAddContract = async values => {
    setLoading(true);
    try {
      const res = await getNewContractCode();
      const payload = {
        Id: res.data?.code,
        MANV: values.employeeId,
        MALHD: values.contractTypeId,
        LUONGCOBAN: values.salary,
        NGAYBATDAU: values.effectiveDate.format("YYYY-MM-DD"),
        TRANGTHAI: "Chờ phê duyệt",
      };
      const createRes = await createContract(payload);
      if (createRes.data?.Success) {
        message.success("Thêm hợp đồng thành công");
        setIsModalOpen(false);
        form.resetFields();
        await loadData();
      } else {
        message.error(createRes.data?.Message || "Lỗi khi thêm hợp đồng");
      }
    } catch {
      message.error("Lỗi khi thêm hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  // Approve
  const handleApprove = async id => {
    setLoading(true);
    try {
      const res = await approveContract(id);
      if (res.data?.Success) {
        message.success("Phê duyệt thành công");
        await loadData();
      }
    } catch {
      message.error("Lỗi khi phê duyệt hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  // Reject
  const handleReject = async id => {
    Modal.confirm({
      title: "Xác nhận từ chối hợp đồng?",
      okText: "Từ chối",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          const res = await rejectContract(id);
          if (res.data?.Success) {
            message.success(res.data.Message);
            await loadData();
          }
        } catch {
          message.error("Lỗi khi từ chối hợp đồng");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // End Contract
  const handleEnd = id => {
    setSelectedContractId(id);
    setCancelReason("");
    setEndModalVisible(true);
  };

  // Delete
  const handleDelete = async id => {
    setLoading(true);
    try {
      const res = await deleteContract(id);
      if (res.data?.Success) {
        message.success("Xóa hợp đồng thành công");
        await loadData();
      }
    } catch {
      message.error("Lỗi khi xóa hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  // Upload PDF
  const handleUpload = async () => {
    if (!uploadFiles.length) return message.warning("Chọn file PDF");
    const fd = new FormData();
    fd.append("MANV", currentRecord.manv);
    fd.append("MALHD", currentRecord.malhd);
    fd.append("AnhFile", uploadFiles[0].originFileObj);
    setLoading(true);
    try {
      const res = await uploadContractFile(fd);
      const newUrl = res.data.FileUrl;
      message.success("Upload thành công");
      setContracts(prev => prev.map(item => item.id === currentRecord.id ? { ...item, fileUrl: newUrl } : item));
      setCurrentRecord(cr => ({ ...cr, fileUrl: newUrl }));
      setUploadVisible(false);
      setUploadFiles([]);
    } catch {
      message.error("Lỗi upload file");
    } finally {
      setLoading(false);
    }
  };

  // Renew
  const handleRenew = async () => {
    if (!selectedRowKeys.length) return message.warning("Vui lòng chọn hợp đồng để gia hạn");
    setLoading(true);
    try {
      const res = await renewContracts(selectedRowKeys);
      if (res.data?.Success) {
        console.log(res.data.Message)
        message.success("Gia hạn thành công");
        setSelectedRowKeys([]);
        await loadData();
      } else {
        message.error(res.data?.Message || "Gia hạn thất bại");
      }
    } catch {
      message.error("Lỗi khi gia hạn hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  const menu = record => (
    <Menu>
      <Menu.Item key="view" onClick={() => onView(record)}>
        Xem hợp đồng
      </Menu.Item>
    </Menu>
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: keys => setSelectedRowKeys(keys),
  };

  const columns = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: (text, record) => (
        <Dropdown overlay={menu(record)} trigger={['click']}>
          <Button type="link">{text} <DownOutlined /></Button>
        </Dropdown>
      ),
    },
    { title: 'Loại hợp đồng', dataIndex: 'contractType', key: 'contractType' },
    { title: 'Lương cơ bản', dataIndex: 'salary', key: 'salary', render: v => v != null ? v.toLocaleString() : '—' },
    { title: 'Hiệu lực từ', dataIndex: 'effectiveDate', key: 'effectiveDate' },
    { title: 'Ngày kết thúc', dataIndex: 'endDate', key: 'endDate' },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status', render: status => {
        let color = 'default';
        switch (status) {
          case 'Chờ phê duyệt': color = 'orange'; break;
          case 'Đang hiệu lực': color = 'green'; break;
          case 'Hết hiệu lực': color = 'red'; break;
          case 'Sắp hết hiệu lực': color = 'gold'; break;
        }
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Upload PDF', key: 'upload', render: (_, record) => (
        <Button icon={<UploadOutlined />} onClick={() => { setCurrentRecord(record); setUploadVisible(true); }}>Upload</Button>
      )
    },
    {
      title: 'Tùy chọn', key: 'actions', render: (_, record) => (
        <Space>
          {record.status === 'Chờ phê duyệt' && (
            <>
              <Button icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id)}>Duyệt</Button>
              <Button danger onClick={() => handleReject(record.id)}>Từ chối</Button>
            </>
          )}
          {['Đang hiệu lực','Chờ phê duyệt','Sắp hết hiệu lực'].includes(record.status) && (
            <Button danger onClick={() => handleEnd(record.id)}>Kết thúc</Button>
          )}
          {['Hết hiệu lực','Hủy hợp đồng'].includes(record.status) && (
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}>Xoá</Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <Content style={{ padding: 20 }}>
        <Space style={{ marginBottom: 20 }}>
          <Input placeholder="Tìm kiếm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} prefix={<SearchOutlined />} style={{ width: 300 }} />
          <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm hợp đồng</Button>
          <Button onClick={handleRenew} disabled={!selectedRowKeys.length}>Gia hạn</Button>
        </Space>
        <Table rowSelection={rowSelection} columns={columns} dataSource={contracts} rowKey="id" loading={loading} pagination={false} />

        {/* Thêm hợp đồng Modal */}
        <Modal title="Thêm hợp đồng mới" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
          <Form layout="vertical" form={form} onFinish={handleAddContract}>
            <Form.Item name="employeeId" label="Tên nhân viên" rules={[{ required: true }]}>  
              <Select placeholder="Chọn nhân viên">{employees.map(nv => <Option key={nv.MANV} value={nv.MANV}>{nv.TENNV}</Option>)}</Select>
            </Form.Item>
            <Form.Item name="contractTypeId" label="Loại hợp đồng" rules={[{ required: true }]}>  
              <Select placeholder="Chọn loại hợp đồng">{contractTypes.map(lhd => <Option key={lhd.MALHD} value={lhd.MALHD}>{lhd.TENLHD}</Option>)}</Select>
            </Form.Item>
            <Form.Item name="salary" label="Lương cơ bản" rules={[{ required: true, message: 'Vui lòng nhập lương cơ bản' }]}>
              <InputNumber style={{ width: '100%' }} min={0} formatter={v => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={v => v.replace(/\D/g, '')} />
            </Form.Item>
            <Form.Item name="effectiveDate" label="Ngày hiệu lực" rules={[{ required: true }]}>  
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}><Button type="primary" htmlType="submit" loading={loading}>Thêm</Button></Form.Item>
          </Form>
        </Modal>
        {/* Kết thúc hợp đồng Modal */}
        <Modal title="Nhập lý do kết thúc hợp đồng" open={endModalVisible} onCancel={() => setEndModalVisible(false)} onOk={async () => {
            if (!cancelReason.trim()) { message.warning('Vui lòng nhập lý do kết thúc!'); return; }
            try {
              const res = await endContract(selectedContractId, { LYDOHUY: cancelReason, NGAYHUY: new Date().toISOString() });
              if (res.data?.Success) { message.success(res.data.Message); setEndModalVisible(false); await loadData(); } else { message.error(res.data?.Message || 'Không thể kết thúc hợp đồng'); }
            } catch { message.error('Lỗi khi kết thúc hợp đồng'); }
          }}>
          <Input.TextArea rows={4} placeholder="Nhập lý do kết thúc..." value={cancelReason} onChange={e => setCancelReason(e.target.value)} />
        </Modal>
        {/* Upload PDF Modal */}
        <Modal title="Upload file hợp đồng" open={uploadVisible} onCancel={() => setUploadVisible(false)} onOk={handleUpload}>
          <Upload fileList={uploadFiles} beforeUpload={() => false} onChange={({ fileList }) => setUploadFiles(fileList)} accept=".pdf" maxCount={1}>
            <Button icon={<UploadOutlined />}>Chọn file PDF</Button>
          </Upload>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ContractManagement;
