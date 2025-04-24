import React, { useEffect, useState } from "react";
import { Layout, Form, Input, Select, Button, message, Spin } from "antd";
import axios from "axios";
import { fetchEmployees } from "../../api/employeeApi";
import { getRoles, createAccount } from "../../api/authApi";

const { Content } = Layout;
const { Option } = Select;

const EmployeeAccountPage = () => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Lấy danh sách vai trò
  useEffect(() => {
    const fetchRoleList = async () => {
      setLoadingRoles(true);
      try {
        const res = await getRoles();
        const data = res.data.Data || res.data;
        setRoles(data);
      } catch {
        message.error('Lỗi khi tải danh sách vai trò');
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoleList();
  }, []);

  // Lấy danh sách nhân viên
  useEffect(() => {
    const fetchEmpList = async () => {
      setLoadingEmployees(true);
      try {
        const res = await fetchEmployees();
        const list = res.data.Data || [];
        setEmployees(list);
      } catch {
        message.error('Lỗi khi tải danh sách nhân viên');
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmpList();
  }, []);

  // Xử lý submit form
  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      await createAccount({
        tenDangNhap: values.tenDangNhap,
        matKhau: values.matKhau,
        maNV: values.maNV,
        email: values.email,
        vaiTroId: values.vaiTroId,
      });
      message.success('Tạo tài khoản thành công!');
      form.resetFields();
    } catch (err) {
      message.error(err.response?.data?.Message || 'Lỗi khi tạo tài khoản');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout style={{ background: 'white', padding: 24 }}>
      <Content>
        <h2>Tạo tài khoản nhân viên</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="tenDangNhap"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="matKhau"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="maNV"
            label="Nhân viên"
            rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
          >
            {loadingEmployees ? (
              <Spin />
            ) : (
              <Select placeholder="Chọn nhân viên">
                {employees.map((e) => (
                  <Option key={e.MANV || e.id} value={e.MANV || e.id}>
                    {e.TENNV || e.name} ({e.MANV || e.id})
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="vaiTroId"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            {loadingRoles ? (
              <Spin />
            ) : (
              <Select placeholder="Chọn vai trò">
                {roles.map((r) => (
                  <Option key={r.ID || r.id} value={r.ID || r.id}>
                    {r.TENVAITRO || r.tenVaiTro}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Tạo tài khoản
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default EmployeeAccountPage;
