// File: src/pages/EmployeePage/EmployeeInsurancesTab.js
import React, { useEffect, useState } from "react";
import {
  fetchInsurances,
  createInsurance,
  updateInsurance,
  deleteInsurance,
  renewInsurances,
} from "../../api/insuranceDetailApi";
import { toast } from 'react-toastify';
import { Table, Button, Space, Modal, Form, Select, Tag, Popconfirm, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { fetchInsuranceTypes } from "../../api/insuranceApi";
import dayjs from "dayjs";
const { Option } = Select;

const EmployeeInsurancesTab = ({ employeeId }) => {
  const [insurances, setInsurances] = useState([]);
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);

  // modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadLookup();
  }, []);

  useEffect(() => {
    if (employeeId) loadInsurances();
  }, [employeeId]);

  const loadLookup = async () => {
    try {
      const res = await fetchInsuranceTypes();
      setInsuranceTypes(res.data?.Data || []);
    } catch {
      toast.error("Lỗi tải loại bảo hiểm");
    }
  };

  const loadInsurances = async () => {
    setLoading(true);
    try {
      const res = await fetchInsurances({ maNhanVien: employeeId });
      setInsurances(res.data?.Data || []);
    } catch {
      toast.error("Lỗi tải bảo hiểm");
    } finally {
      setLoading(false);
    }
  };

  const openModal = record => {
    if (record) {
      setEditingId(record.Id);
      form.setFieldsValue({
        MALBH: record.MALBH,
        CHUKY: record.CHUKY
      });
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ CHUKY: "Tháng" });
    }
    setModalVisible(true);
  };

  const handleSave = async values => {
    setLoading(true);
    try {
      if (editingId) {
        const current = insurances.find(i => i.Id === editingId);
        await updateInsurance(editingId, {
          MANV: employeeId,
          MALBH: values.MALBH,
          CHUKY: values.CHUKY,
          TRANGTHAI: current.TRANGTHAI
        });
        toast.success("Cập nhật thành công");
      } else {
        await createInsurance({
          MANV: employeeId,
          MALBH: values.MALBH,
          CHUKY: values.CHUKY,
          TRANGTHAI: ""
        });
        toast.success("Tạo bảo hiểm thành công");
      }
      setModalVisible(false);
      setSelectedKeys([]);
      loadInsurances();
    } catch (err) {
      toast.error(err.response?.data?.Message || "Lỗi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    setLoading(true);
    try {
      await deleteInsurance(id);
      toast.success("Xóa thành công");
      loadInsurances();
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    if (!selectedKeys.length) {
      toast.warning("Chọn ít nhất 1 mục để gia hạn");
      return;
    }
    setLoading(true);
    try {
      await renewInsurances({ BaoHiemIds: selectedKeys });
      toast.success("Gia hạn thành công");
      setSelectedKeys([]);
      loadInsurances();
    } catch {
      toast.error("Gia hạn thất bại");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Mã BH", dataIndex: "Id", key: "Id" },
    { title: "Loại BH", dataIndex: "TENLBH", key: "TENLBH" },
    { title: "Chu kỳ", dataIndex: "CHUKY", key: "CHUKY" },
    {
      title: "Bắt đầu", dataIndex: "NGAYBATDAU", key: "start",
      render: d => d ? dayjs(d).format("YYYY-MM-DD") : "—"
    },
    {
      title: "Kết thúc", dataIndex: "NGAYKETTHUC", key: "end",
      render: d => d ? dayjs(d).format("YYYY-MM-DD") : "—"
    },
    {
      title: "Trạng thái", dataIndex: "TRANGTHAI", key: "status",
      render: st => {
        let color = "default";
        if (st === "Đang hiệu lực") color = "green";
        else if (st === "Sắp hết hiệu lực") color = "gold";
        else if (st === "Hết hiệu lực") color = "red";
        return <Tag color={color}>{st}</Tag>;
      }
    },
    {
      title: "Hành động", key: "actions",
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" onClick={() => openModal(r)}>
            Sửa
          </Button>
        </Space>
      )
    }
  ];

  return (
    <>
      <Space style={{ margin: 12 }}>
        <Button onClick={handleRenew} disabled={!selectedKeys.length}>Gia hạn</Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal(null)}>
          Thêm BH
        </Button>
      </Space>
      <Table
        rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }}
        dataSource={insurances}
        columns={columns}
        rowKey="Id"
        loading={loading}
        pagination={false}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={editingId ? "Cập nhật bảo hiểm" : "Tạo bảo hiểm mới"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} initialValues={{ CHUKY: "Tháng" }}>
          <Form.Item name="MALBH" label="Loại bảo hiểm" rules={[{ required: true }]}>  
            <Select placeholder="Chọn loại bảo hiểm">
              {insuranceTypes.map(t => (
                <Option key={t.MALBH} value={t.MALBH}>{t.TENLBH}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="CHUKY" label="Chu kỳ" rules={[{ required: true }]}>  
            <Select>
              <Option value="Tháng">Tháng</Option>
              <Option value="Quý">Quý</Option>
              <Option value="Năm">Năm</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingId ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EmployeeInsurancesTab;
