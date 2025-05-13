// src/components/Category/EmployeeType/EmployeeTypeModal.js
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Table,
  Space,
  Popconfirm,
} from "antd";
import { toast } from 'react-toastify';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getAutoCode,
  getAllEmployeeTypes,
  createEmployeeType,
  updateEmployeeType,
  deleteEmployeeType,
} from "../../../api/employeeTypeModalApi";

const EmployeeTypeModal = ({
  visible,
  onCancel,
  loading,
  setLoading,
  employeeTypes,
  setEmployeeTypes,
}) => {
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const fetchAutoCode = async () => {
    try {
      const res = await getAutoCode();
      form.setFieldsValue({ employeeTypeCode: res.data.code });
    } catch (err) {
      toast.error("Không thể lấy mã loại nhân viên mới!");
    }
  };

  const handleAddOrUpdate = async (values) => {
    
    setLoading(true);
    try {
      if (editingId) {
        var res = await updateEmployeeType({
          MALNV: values.employeeTypeCode,
          TENLNV: values.employeeTypeName,
          //NGAYPHEPCAP: values.leaveDays,
        });
        toast.success(res.data?.Message);
        setEmployeeTypes((prev) =>
          prev.map((type) =>
            type.employeeTypeCode === values.employeeTypeCode
              ? {
                  ...type,
                  employeeTypeName: values.employeeTypeName,
                  //leaveDays: values.leaveDays,
                }
              : type
          )
        );
      } else {
        var res = await createEmployeeType({
          MALNV: values.employeeTypeCode,
          TENLNV: values.employeeTypeName,
          //NGAYPHEPCAP: values.leaveDays,
        });
        toast.success(res.data?.Message);
        setEmployeeTypes((prev) => [
          ...prev,
          {
            employeeTypeCode: values.employeeTypeCode,
            employeeTypeName: values.employeeTypeName,
            //leaveDays: values.leaveDays,
          },
        ]);
      }
      form.resetFields();
      fetchAutoCode();
      setEditingId(null);
    } catch (err) {
      toast.error(err.response?.data?.Message || "Lỗi xử lý");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      employeeTypeCode: record.employeeTypeCode,
      employeeTypeName: record.employeeTypeName,
      //leaveDays: record.leaveDays,
    });
    setEditingId(record.employeeTypeCode);
  };

  const handleDelete = async (record) => {
    setLoading(true);
    try {
      var res = await deleteEmployeeType({ MALNV: record.employeeTypeCode });
      toast.success(res.data?.Message);
      setEmployeeTypes((prev) =>
        prev.filter((type) => type.employeeTypeCode !== record.employeeTypeCode)
      );
    } catch (err) {
      toast.error(err.response?.data?.Message || "Lỗi xóa dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchAutoCode();
    }
  }, [visible]);

  const columns = [
    {
      title: "Mã loại",
      dataIndex: "employeeTypeCode",
      key: "employeeTypeCode",
    },
    {
      title: "Tên loại",
      dataIndex: "employeeTypeName",
      key: "employeeTypeName",
    },
    
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      title="Quản lý loại nhân viên"
      open={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
        setEditingId(null);
      }}
      footer={null}
      width={800}
      style={{ left: 70 }}
    >
      <Form form={form} layout="vertical" onFinish={handleAddOrUpdate}>
        <div style={{ display: "flex", gap: 16 }}>
          <Form.Item
            name="employeeTypeCode"
            label="Mã loại nhân viên"
            rules={[{ required: true, message: "Vui lòng nhập mã!" }]}
            style={{ flex: 1 }}
          >
            <Input disabled={!!editingId} />
          </Form.Item>
          <Form.Item
            name="employeeTypeName"
            label="Tên loại nhân viên"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Tên loại nhân viên" />
          </Form.Item>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#3e0fe6" }}
              loading={loading}
            >
              {editingId ? "Cập nhật" : "Thêm"}
            </Button>
          </Form.Item>
        </div>
      </Form>

      <Table
        columns={columns}
        dataSource={employeeTypes}
        rowKey="employeeTypeCode"
        loading={loading}
        pagination={false}
        style={{ marginTop: 20 }}
      />
    </Modal>
  );
};

export default EmployeeTypeModal;
