import React, { useEffect, useState } from "react";
import { Layout, Form, Input, Select, Button, message, Spin, Table, Modal } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { fetchEmployees } from "../../api/employeeApi";
import { getRoles, createAccount, getAccounts, updateAccount, deleteAccount } from "../../api/authApi";
import { toast } from 'react-toastify';
const { Content } = Layout;
const { Option } = Select;

const EmployeeAccountPage = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch roles
  useEffect(() => {
    setLoadingRoles(true);
    getRoles()
      .then(res => setRoles(res.data.Data || res.data))
      .catch(() => toast.error('Lỗi khi tải danh sách vai trò'))
      .finally(() => setLoadingRoles(false));
  }, []);

  // Fetch employees
  useEffect(() => {
    setLoadingEmployees(true);
    fetchEmployees()
      .then(res => setEmployees(res.data.Data || []))
      .catch(() => toast.error('Lỗi khi tải danh sách nhân viên'))
      .finally(() => setLoadingEmployees(false));
  }, []);

  // Load accounts with optional filter
  const loadAccounts = (isDeleted) => {
    setLoadingAccounts(true);
    getAccounts(isDeleted)
      .then(res => {
        if (res.data.Success) setAccounts(res.data.Data || []);
        else toast.error(res.data.Message);
      })
      .catch(() => toast.error('Lỗi khi tải danh sách tài khoản'))
      .finally(() => setLoadingAccounts(false));
  };

  useEffect(() => {
    let isDeleted;
    if (filterStatus === 'active') isDeleted = false;
    else if (filterStatus === 'deleted') isDeleted = true;
    else isDeleted = undefined;
    loadAccounts(isDeleted);
  }, [filterStatus]);

  // Create account
  const onFinish = values => {
    console.log('📦 Dữ liệu gửi đi:', values);
    setSubmitting(true);
    createAccount(values)
      .then(res => {
        console.log('✅ Phản hồi backend:', res.data);
        toast.success(res.data.Message);
        form.resetFields();
        loadAccounts(filterStatus === 'active' ? false : filterStatus === 'deleted' ? true : undefined);
      })
      .catch(err => {
        console.error('❌ Lỗi từ backend:', err.response?.data || err);
        toast.error(err.response?.data?.Message || 'Lỗi khi tạo tài khoản');
      })
      .finally(() => setSubmitting(false));
  };

  const onFinishFailed = errorInfo => {
    console.error('❌ Validate fail:', errorInfo);
    toast.error('Vui lòng điền đầy đủ thông tin hợp lệ.');
  };

  const openEditModal = record => {
    editForm.setFieldsValue({
      Id: record.Id,
      MatKhauMoi: '',
      VaiTroId: record.VaiTros[0] || null
    });
    setEditModalVisible(true);
  };

  const onEditFinish = values => {
    updateAccount(values)
      .then(res => {
        toast.success(res.data.Message);
        setEditModalVisible(false);
        editForm.resetFields();
        loadAccounts(filterStatus === 'active' ? false : filterStatus === 'deleted' ? true : undefined);
      })
      .catch(err => toast.error(err.response?.data?.Message || 'Lỗi khi cập nhật tài khoản'));
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteAccount(id);
      if (res.data?.Success) {
        toast.success(res.data.Message);
        setAccounts(prev => prev.filter(item => item.Id !== id));
      } else {
        toast.error(res.data?.Message || 'Xóa thất bại');
      }
    } catch {
      toast.error('Lỗi khi xóa tài khoản');
    }
  };

  const onDelete = record => {
    Modal.confirm({
      title: 'Xác nhận xóa tài khoản này?',
      content: `Bạn chắc chắn muốn xóa tài khoản "${record.TenDangNhap}"?`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk() {
        handleDelete(record.Id);
      }
    });
  };

  const columns = [
    { title: 'Tên đăng nhập', dataIndex: 'TenDangNhap', key: 'TenDangNhap' },
    { title: 'Nhân viên', dataIndex: 'TenNhanVien', key: 'TenNhanVien' },
    { title: 'Email', dataIndex: 'Email', key: 'Email' },
    { title: 'Vai trò', dataIndex: 'VaiTros', key: 'VaiTros', render: vs => (vs || []).join(', ') },
    {
      title: 'Hành động', key: 'action', render: (_, record) => (
        <>
          <Button type="link" onClick={() => openEditModal(record)}>Sửa</Button>
          <Button type="link" danger onClick={() => onDelete(record)}>Xóa</Button>
        </>
      )
    }
  ];

  return (
    <Layout style={{ background: 'white', padding: 24 }}>
      <Content>
        <h2 style={{ padding: 10 }}>Quản lý tài khoản nhân viên</h2>

        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 200, marginBottom: 16 }}
        >
          <Option value="all">Tất cả</Option>
          <Option value="active">Đang hoạt động</Option>
          <Option value="deleted">Đã xóa</Option>
        </Select>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="tenDangNhap" label="Tên đăng nhập" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item name="maNV" label="Nhân viên" rules={[{ required: true }]}>
            {loadingEmployees ? <Spin /> :
              <Select placeholder="Chọn nhân viên">
                {employees.map(e => (
                  <Option key={e.MANV} value={e.MANV}>{e.TENNV}</Option>
                ))}
              </Select>}
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="vaiTroId" label="Vai trò" rules={[{ required: true }]}>
            {loadingRoles ? <Spin /> :
              <Select placeholder="Chọn vai trò">
                {roles.map(r => (
                  <Option key={r.ID} value={r.ID}>{r.TENVAITRO}</Option>
                ))}
              </Select>}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>Tạo tài khoản</Button>
          </Form.Item>
        </Form>

        <Table
          dataSource={accounts}
          columns={columns}
          rowKey="Id"
          loading={loadingAccounts}
          style={{ marginTop: 32 }}
        />

        <Modal
          title="Cập nhật tài khoản"
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
        >
          <Form form={editForm} layout="vertical" onFinish={onEditFinish}>
            <Form.Item name="Id" hidden>
              <Input />
            </Form.Item>
            <Form.Item name="MatKhauMoi" label="Mật khẩu mới" rules={[{ required: true, message: 'Nhập mật khẩu mới' }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item name="VaiTroId" label="Vai trò" rules={[{ required: true }]}>
              <Select placeholder="Chọn vai trò">
                {roles.map(r => (
                  <Option key={r.ID} value={r.ID}>{r.TENVAITRO}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Cập nhật</Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default EmployeeAccountPage;
