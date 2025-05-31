
// src/components/DepartmentTransferPage.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Select, Input, message, Tag, Space, Spin } from 'antd';
import {
    getTransferRequests,
    submitTransferRequest,
    approveTransferRequest,
    rejectTransferRequest,
    getEmployeeDetail,
} from '../../api/departmentTransferApi';
import moment from 'moment';
import { fetchEmployees } from '../../api/employeeApi';
import { getDepartments } from '../../api/dropdownApi';
import { toast } from 'react-toastify';

const { Option } = Select;

export default function DepartmentTransferPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [form] = Form.useForm();
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [currentDept, setCurrentDept] = useState('');
    const [loadingCurrent, setLoadingCurrent] = useState(false);
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [loadingDepartments, setLoadingDepartments] = useState(false);

    // Fetch transfer requests
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await getTransferRequests();
            const list = res.data?.Data || res.data || [];
            setRequests(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi tải danh sách yêu cầu.');
        }
        setLoading(false);
    };

    // Fetch dropdown data
    const fetchInitialData = async () => {
        setLoadingEmployees(true);
        setLoadingDepartments(true);
        try {
            const [empRes, deptRes] = await Promise.all([fetchEmployees(), getDepartments()]);
            const empList = empRes.data?.Data || empRes.data || [];
            const deptList = deptRes.data?.Data || deptRes.data || [];
            setEmployees(Array.isArray(empList) ? empList : []);
            setDepartments(Array.isArray(deptList) ? deptList : []);
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi tải dữ liệu nhân viên hoặc phòng ban.');
        }
        setLoadingEmployees(false);
        setLoadingDepartments(false);
    };

    useEffect(() => {
        fetchRequests();
        fetchInitialData();
    }, []);

    // Load current department on employee change
    const handleEmployeeChange = async (manv) => {
        setLoadingCurrent(true);
        try {
            const res = await getEmployeeDetail(manv);
            const phongBans = res.data?.Data?.PhongBans || [];
            const activePb = phongBans.find(pb => !pb.NGAYKETTHUC);
            if (activePb) {
                setCurrentDept(activePb.TENPB);
                form.setFieldsValue({ MAPB_CU: activePb.MAPB });
            } else {
                setCurrentDept('Chưa có phòng ban');
                form.setFieldsValue({ MAPB_CU: '' });
            }
        } catch (err) {
            console.error(err);
            toast.error('Không thể lấy phòng ban hiện tại.');
            setCurrentDept('');
            form.setFieldsValue({ MAPB_CU: '' });
        } finally {
            setLoadingCurrent(false);
        }
    };

    // Approve transfer
    const handleApprove = async (id) => {
        try {
            await approveTransferRequest(id);
            toast.success('Phê duyệt thành công!');
            fetchRequests();
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi phê duyệt.');
        }
    };

    // Reject transfer
    const handleReject = async (record) => {
        Modal.confirm({
            title: 'Xác nhận từ chối',
            content: <Input.TextArea placeholder="Nhập lý do từ chối" onChange={e => record.LYDOTUCHOI = e.target.value} />, 
            onOk: async () => {
                try {
                    await rejectTransferRequest({ MAYEUCAU: record.MAYEUCAU, LYDOTUCHOI: record.LYDOTUCHOI });
                    toast.success('Đã từ chối yêu cầu.');
                    fetchRequests();
                } catch (err) {
                    console.error(err);
                    toast.error('Lỗi khi từ chối.');
                }
            }
        });
    };

    // Table columns
    const columns = [
        { title: 'Mã yêu cầu', dataIndex: 'MAYEUCAU', key: 'MAYEUCAU' },
        { title: 'Nhân viên', dataIndex: 'MANV', key: 'MANV' },
        {
            title: 'Phòng ban cũ',
            dataIndex: 'MAPB_CU',
            key: 'MAPB_CU',
            render: code => {
                const dept = departments.find(d => d.MAPB === code);
                return dept ? dept.TENPB : code;
            }
        },
        {
            title: 'Phòng ban mới',
            dataIndex: 'MAPB_MOI',
            key: 'MAPB_MOI',
            render: code => {
                const dept = departments.find(d => d.MAPB === code);
                return dept ? dept.TENPB : code;
            }
        },
        { title: 'Ngày bắt đầu', dataIndex: 'NGAYBATDAU', key: 'NGAYBATDAU', render: date => moment(date).format('YYYY-MM-DD') },
        { title: 'Vai trò', dataIndex: 'VAITRO', key: 'VAITRO' },
        {
            title: 'Trạng thái',
            dataIndex: 'TRANGTHAI',
            key: 'TRANGTHAI',
            render: txt => {
                const color = txt === 'Đã phê duyệt' ? 'green' : txt === 'Không được duyệt' ? 'red' : 'blue';
                return <Tag color={color}>{txt}</Tag>;
            }
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                record.TRANGTHAI === 'Chờ duyệt' ? (
                    <Space>
                        <Button type="primary" onClick={() => handleApprove(record.MAYEUCAU)}>Phê duyệt</Button>
                        <Button danger onClick={() => handleReject(record)}>Từ chối</Button>
                    </Space>
                ) : null
            )
        }
    ];

    // Submit request form
    const handleFormSubmit = async (values) => {
        try {
            await submitTransferRequest(values);
            toast.success('Yêu cầu được gửi thành công!');
            setFormVisible(false);
            fetchRequests();
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi gửi yêu cầu.');
        }
    };

    return (
        <div>
            <Button type="primary" onClick={() => setFormVisible(true)} style={{ marginBottom: 16 }}>
                Gửi yêu cầu điều chuyển
            </Button>

            <Table
                dataSource={requests}
                columns={columns}
                rowKey="MAYEUCAU"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal open={formVisible} title="Gửi yêu cầu điều chuyển" footer={null} onCancel={() => setFormVisible(false)} width={600}>
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item name="MANV" label="Nhân viên" rules={[{ required: true }]}> 
                        <Select showSearch placeholder="Chọn nhân viên" loading={loadingEmployees} optionFilterProp="children" filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())} onChange={handleEmployeeChange}>
                            {employees.map(emp => <Option key={emp.MANV} value={emp.MANV}>{emp.TENNV} ({emp.MANV})</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Phòng ban hiện tại">
                        <Spin spinning={loadingCurrent}><Input value={currentDept} disabled/></Spin>
                    </Form.Item>
                    <Form.Item name="MAPB_CU" hidden><Input/></Form.Item>
                    <Form.Item name="MAPB_MOI" label="Phòng ban mới" rules={[{ required: true }]}> 
                        <Select placeholder="Chọn phòng ban mới" loading={loadingDepartments}>
                            {departments.map(dept => <Option key={dept.MAPB} value={dept.MAPB}>{dept.TENPB} ({dept.MAPB})</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="VAITRO" label="Vai trò" rules={[{ required: true }]}> 
                        <Select>
                            <Option value="Chính thức">Chính thức</Option>
                            <Option value="Kiêm nhiệm">Kiêm nhiệm</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Gửi yêu cầu</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

