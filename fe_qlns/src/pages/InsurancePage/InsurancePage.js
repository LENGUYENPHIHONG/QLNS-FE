// File: src/pages/InsuranceManagement.jsx
import React, { useState, useEffect } from "react";
import {
  Layout, Form, Input, Button, Table, Space,
  Modal, Popconfirm, Select, Tag
} from "antd";
import {
  SearchOutlined, DeleteOutlined, PlusOutlined,
  ReloadOutlined, EditOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import {
  fetchInsurances, createInsurance, updateInsurance,
  deleteInsurance, renewInsurances,
  getEmployees, getInsuranceTypes
} from "../../api/insuranceDetailApi";

const { Content } = Layout;
const { Option } = Select;

export default function InsuranceManagement() {
  const [form] = Form.useForm();
  const [insurances, setInsurances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters + paging state
  const [filters, setFilters] = useState({
    maNhanVien: undefined,
    maLoaiBaoHiem: undefined,
    trangThai: undefined,
    search: undefined
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]);

  // load lookups + initial data
  useEffect(() => {
    loadLookups();
    loadData(1, pageSize);
  }, []);

  const loadLookups = async () => {
    try {
      const [empRes, typeRes] = await Promise.all([
        getEmployees(), getInsuranceTypes()
      ]);
      if (empRes.data?.Data) setEmployees(empRes.data.Data);
      if (typeRes.data?.Data) setInsuranceTypes(typeRes.data.Data);
    } catch {
      toast.error("Lỗi tải dữ liệu phụ");
    }
  };

  const loadData = async (p = 1, ps = 10) => {
    setLoading(true);
    try {
      const res = await fetchInsurances({
        page: p,
        pageSize: ps,
        ...filters
      });
      if (res.data?.Success) {
        setInsurances(res.data.Data);
        setTotal(res.data.Total);
        setPage(res.data.Page);
        setPageSize(res.data.PageSize);
      }
    } catch {
      toast.error("Lỗi tải danh sách bảo hiểm");
    } finally {
      setLoading(false);
    }
  };

  const openModal = record => {
    if (record) {
      setEditingId(record.Id);
      form.setFieldsValue({
        MANV: record.MANV,
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
        // cập nhật
        const current = insurances.find(i => i.Id === editingId);
        await updateInsurance(editingId, {
          MANV: values.MANV,
          MALBH: values.MALBH,
          CHUKY: values.CHUKY,
          TRANGTHAI: current.TRANGTHAI
        });
        toast.success("Cập nhật thành công");
      } else {
        // tạo mới
        await createInsurance({
          MANV: values.MANV,
          MALBH: values.MALBH,
          CHUKY: values.CHUKY,
          TRANGTHAI: ""
        });
        toast.success("Tạo mới thành công");
      }
      setModalVisible(false);
      setSelectedKeys([]);
      loadData(page, pageSize);
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
      loadData(page, pageSize);
    } catch {
      toast.error("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    if (!selectedKeys.length) return toast.warning("Chọn ít nhất 1 mục để gia hạn");
    setLoading(true);
    try {
      await renewInsurances({ BaoHiemIds: selectedKeys });
      toast.success("Gia hạn thành công");
      setSelectedKeys([]);
      loadData(page, pageSize);
    } catch {
      toast.error("Gia hạn thất bại");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Mã BH", dataIndex: "Id", key: "Id" },
    { title: "Nhân viên", dataIndex: "TENNV", key: "TENNV" },
    { title: "Loại BH", dataIndex: "TENLBH", key: "TENLBH" },
    { title: "Chu kỳ", dataIndex: "CHUKY", key: "CHUKY" },
    {
      title: "Bắt đầu", dataIndex: "NGAYBATDAU", key: "NGAYBATDAU",
      render: d => d ? dayjs(d).format("YYYY-MM-DD") : "—"
    },
    {
      title: "Kết thúc", dataIndex: "NGAYKETTHUC", key: "NGAYKETTHUC",
      render: d => d ? dayjs(d).format("YYYY-MM-DD") : "—"
    },
    {
      title: "Trạng thái", dataIndex: "TRANGTHAI", key: "TRANGTHAI",
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
          <Button icon={<EditOutlined />} onClick={() => openModal(r)}>Sửa</Button>
          {r.TRANGTHAI === "Hết hiệu lực" && (
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
      )
    }
  ];

  return (
    <Layout style={{ background: "#fff" }}>
      <Content style={{ padding: 20 }}>
        {/* Filters */}
        <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
          <Select
            allowClear
            placeholder="Nhân viên"
            style={{ width: 180 }}
            value={filters.maNhanVien}
            onChange={val => setFilters(f => ({ ...f, maNhanVien: val }))}
          >
            {employees.map(e => (
              <Option key={e.MANV} value={e.MANV}>{e.TENNV}</Option>
            ))}
          </Select>

          <Select
            allowClear
            placeholder="Loại BH"
            style={{ width: 180 }}
            value={filters.maLoaiBaoHiem}
            onChange={val => setFilters(f => ({ ...f, maLoaiBaoHiem: val }))}
          >
            {insuranceTypes.map(t => (
              <Option key={t.MALBH} value={t.MALBH}>{t.TENLBH}</Option>
            ))}
          </Select>

          <Select
            allowClear
            placeholder="Trạng thái"
            style={{ width: 180 }}
            value={filters.trangThai}
            onChange={val => setFilters(f => ({ ...f, trangThai: val }))}
          >
            <Option value="Đang hiệu lực">Đang hiệu lực</Option>
            <Option value="Sắp hết hiệu lực">Sắp hết hiệu lực</Option>
            <Option value="Hết hiệu lực">Hết hiệu lực</Option>
          </Select>

          <Input
            allowClear
            placeholder="Tìm chung..."
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            onPressEnter={() => loadData(1, pageSize)}
          />

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => loadData(1, pageSize)}
          >
            Lọc
          </Button>

          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setFilters({ maNhanVien: undefined, maLoaiBaoHiem: undefined, trangThai: undefined, search: undefined });
              loadData(1, pageSize);
            }}
          >
            Đặt lại
          </Button>

          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal(null)}>
            Tạo mới
          </Button>

          <Button onClick={handleRenew} disabled={!selectedKeys.length} icon={<ReloadOutlined />}>
            Gia hạn
          </Button>
        </Space>

        {/* Table */}
        <Table
          rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }}
          columns={columns}
          dataSource={insurances}
          rowKey="Id"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (p, ps) => loadData(p, ps)
          }}
        />

        {/* Modal Create/Edit */}
        <Modal
          title={editingId ? "Cập nhật bảo hiểm" : "Tạo bảo hiểm mới"}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSave} initialValues={{ CHUKY: "Tháng" }}>
            <Form.Item name="MANV" label="Nhân viên" rules={[{ required: true, message: "Chọn nhân viên" }]}>
              <Select placeholder="Chọn nhân viên">
                {employees.map(e => <Option key={e.MANV} value={e.MANV}>{e.TENNV}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item name="MALBH" label="Loại bảo hiểm" rules={[{ required: true, message: "Chọn loại bảo hiểm" }]}>
              <Select placeholder="Chọn loại bảo hiểm">
                {insuranceTypes.map(t => <Option key={t.MALBH} value={t.MALBH}>{t.TENLBH}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item name="CHUKY" label="Chu kỳ" rules={[{ required: true, message: "Chọn chu kỳ" }]}>
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
      </Content>
    </Layout>
  );
}
