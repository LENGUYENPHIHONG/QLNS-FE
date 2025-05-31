// File: src/pages/EmployeePage/EmployeeLeavesTab.js
import React, { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message, Modal, Form, Select, DatePicker, Input } from "antd";
import { getAllLeaveRequests, createLeaveRequest, approveLeave, deleteLeaveRequest } from "../../api/leaveRequestApi";
import { getAllLeaveTypes } from "../../api/leaveTypeApi";
import dayjs from "dayjs";
import { toast } from 'react-toastify';

const { Option } = Select;

const EmployeeLeavesTab = ({ employeeId }) => {
  const [data, setData] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  useEffect(() => {
    if (employeeId) fetchLeaves();
  }, [employeeId]);

  const fetchLeaveTypes = async () => {
    try {
      const res = await getAllLeaveTypes();
      if (res.data?.Success) setLeaveTypes(res.data.Data);
    } catch {
      toast.error("Lỗi tải loại nghỉ");
    }
  };

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await getAllLeaveRequests({ manv: employeeId });
      if (res.data?.Success) {
        setData(res.data.Data || []);
      } else {
        toast.error(res.data?.Message || "Lỗi tải nghỉ phép");
      }
    } catch {
      toast.error("Lỗi tải nghỉ phép");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async values => {
    setLoading(true);
    try {
      const startDate = values.startDate.startOf('day');
      const endDate = values.endDate.startOf('day');
      const diffDays = endDate.diff(startDate, 'day') + 1;
      const payload = {
  ID: "",              // nếu backend tự tạo ID
  MANV: employeeId,
  MALP: values.leaveType,
  NGAYBATDAU: startDate.toISOString(),
  NGAYKETTHUC: endDate.toISOString(),
  SONGAYNGHI: diffDays,
  LYDO: values.reason,
  TRANGTHAI: 'Chờ phê duyệt'
};
      const res = await createLeaveRequest(payload);
      if (res.data?.Success) {
        toast.success(res.data?.Message);
        form.resetFields();
        fetchLeaves();
        setIsModalOpen(false);
      } else toast.error(res.data.Message);
    } catch {
      toast.error("Lỗi tạo yêu cầu nghỉ");
    } finally { setLoading(false); }
  };

  const handleApprove = async id => {
    setLoading(true);
    try {
      const res = await approveLeave(id);
      if (res.data?.Success) {
        toast.success("Phê duyệt thành công");
        fetchLeaves();
      } else toast.error(res.data.Message);
    } catch {
      toast.error("Lỗi phê duyệt");
    } finally { setLoading(false); }
  };

  const handleDelete = async id => {
    setLoading(true);
    try {
      const res = await deleteLeaveRequest(id);
      if (res.data?.Success) {
        toast.success("Xóa thành công");
        fetchLeaves();
      } else toast.error(res.data.Message);
    } catch {
      toast.error("Lỗi xóa");
    } finally { setLoading(false); }
  };

  const columns = [
    { title: 'Mã YC', dataIndex: 'Id', key: 'Id' },
    { title: 'Loại nghỉ', dataIndex: 'TENLP', key: 'TENLP' },
    { title: 'Từ ngày', dataIndex: 'NGAYBATDAU', key: 'NGAYBATDAU', render: d => dayjs(d).format('DD/MM/YYYY') },
    { title: 'Đến ngày', dataIndex: 'NGAYKETTHUC', key: 'NGAYKETTHUC', render: d => dayjs(d).format('DD/MM/YYYY') },
    { title: 'Số ngày', dataIndex: 'SONGAYNGHI', key: 'SONGAYNGHI' },
    { title: 'Lý do', dataIndex: 'LYDO', key: 'LYDO' },
    { title: 'Trạng thái', dataIndex: 'TRANGTHAI', key: 'TRANGTHAI' },
    {
      title: 'Hành động', key: 'actions',
      render: (_, record) => (
        <Space>
          {record.TRANGTHAI === 'Chờ phê duyệt' && (
            <Button type="primary" onClick={() => handleApprove(record.Id)}>Phê duyệt</Button>
          )}
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.Id)}
            okText="Xóa" cancelText="Hủy"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => setIsModalOpen(true)}>
        Tạo nghỉ phép
      </Button>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="Id"
        loading={loading}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title="Tạo yêu cầu nghỉ phép"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="leaveType" label="Loại nghỉ" rules={[{ required: true }]}>        
            <Select placeholder="Chọn loại nghỉ">
              {leaveTypes.map(t => <Option key={t.MALP} value={t.MALP}>{t.TENLP}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="startDate" label="Từ ngày" rules={[{ required: true }]}>  
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="endDate" label="Đến ngày" rules={[{ required: true }]}>  
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="reason" label="Lý do" rules={[{ required: true }]}>  
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" loading={loading}>Gửi</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EmployeeLeavesTab;
