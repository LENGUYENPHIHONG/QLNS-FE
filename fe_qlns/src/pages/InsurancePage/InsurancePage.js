import React, { useState, useEffect } from "react";
import {
  Layout, Form, Input, Button, Table, Space,
  Modal, message, Select, Tag
} from "antd";
import {
  SearchOutlined, DeleteOutlined,
  CheckCircleOutlined, PlusOutlined,
  EditOutlined, ReloadOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

import {
  fetchInsurances,
  createInsurance,
  updateInsurance,
  deleteInsurance,
  renewInsurances,
  fetchInsuranceById,
  getEmployees,
  getInsuranceTypes
} from "../../api/insuranceDetailApi";

const { Content } = Layout;
const { Option } = Select;

export default function InsuranceManagement() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [emps, setEmps] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [insRes, empRes, typeRes] = await Promise.all([
        fetchInsurances(),
        getEmployees(),
        getInsuranceTypes()
      ]);
      if (insRes.data?.Success) setData(insRes.data.Data);
      if (empRes.data?.Data)  setEmps(empRes.data.Data);
      if (typeRes.data?.Data) setTypes(typeRes.data.Data);
    } catch (err) {
      console.error("❌ loadAll:", err);
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }

  function openModal(record = null) {
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
  }

  async function onFinish(values) {
    setLoading(true);
    try {
      if (editingId) {
        // cập nhật
        const current = data.find(i => i.Id === editingId);
        await updateInsurance(editingId, {
          MANV: values.MANV,
          MALBH: values.MALBH,
          CHUKY: values.CHUKY,
          TRANGTHAI: current.TRANGTHAI
        });
        message.success("Cập nhật thành công");
      } else {
        // tạo mới
        await createInsurance({
          MANV: values.MANV,
          MALBH: values.MALBH,
          CHUKY: values.CHUKY,
          TRANGTHAI: ""
        });
        message.success("Tạo mới thành công");
      }
      setModalVisible(false);
      form.resetFields();
      setSelectedKeys([]);
      await loadAll();
    } catch (err) {
      console.error("❌ onFinish:", err, err.response?.data);
      message.error(err.response?.data?.Message || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id) {
    setLoading(true);
    try {
      await deleteInsurance(id);
      message.success("Xóa thành công");
      await loadAll();
    } catch (err) {
      console.error("❌ onDelete:", err);
      message.error("Xóa thất bại");
    } finally {
      setLoading(false);
    }
  }

  async function onRenew() {
    if (!selectedKeys.length) {
      return message.warning("Chọn ít nhất 1 để gia hạn");
    }
    setLoading(true);
    try {
      await renewInsurances({ BaoHiemIds: selectedKeys });
      message.success("Gia hạn thành công");
      setSelectedKeys([]);
      await loadAll();
    } catch (err) {
      console.error("❌ onRenew:", err);
      message.error("Gia hạn thất bại");
    } finally {
      setLoading(false);
    }
  }

  // async function onApprove(record) {
  //   setLoading(true);
  //   try {
  //     const detail = (await fetchInsuranceById(record.Id)).data.Data;
  //     await updateInsurance(record.Id, {
  //       CHUKY: detail.CHUKY,
  //       TRANGTHAI: "Đã đóng"
  //     });
  //     message.success("Phê duyệt thành công");
  //     await loadAll();
  //   } catch (err) {
  //     console.error("❌ onApprove:", err);
  //     message.error("Phê duyệt thất bại");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const columns = [
    {
      title: "Mã bảo hiểm",
      dataIndex: "Id",
      key: "Id"
    },
    { title: "Nhân viên", dataIndex: "TENNV", key: "TENNV" },
    { title: "Loại BH", dataIndex: "TENLBH", key: "TENLBH" },
    { title: "Chu kỳ", dataIndex: "CHUKY", key: "CHUKY" },
    {
      title: "Bắt đầu",
      dataIndex: "NGAYBATDAU",
      key: "NGAYBATDAU",
      render: d => (d ? dayjs(d).format("YYYY-MM-DD") : "—")
    },
    {
      title: "Kết thúc",
      dataIndex: "NGAYKETTHUC",
      key: "NGAYKETTHUC",
      render: d => (d ? dayjs(d).format("YYYY-MM-DD") : "—")
    },
    {
      title: "Trạng thái",
      dataIndex: "TRANGTHAI",
      key: "TRANGTHAI",
      render: st => {
        let color;
        switch (st) {
          case "Đang hiệu lực":
            color = "green";
            break;
          case "Sắp hết hiệu lực":
            color = "gold";
            break;
          case "Hết hiệu lực":
            color = "red";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{st}</Tag>;
      }
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openModal(r)}>
            Sửa
          </Button>
          {r.TRANGTHAI === "Hết hiệu lực" && (
            <Button danger onClick={() => onDelete(r.Id)} icon={<DeleteOutlined />}>
              Xóa
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ background: "#fff" }}>
      <Content style={{ padding: 20 }}>
        <Space style={{ marginBottom: 16 }}>
          <Input
            allowClear
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onPressEnter={loadAll}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Tạo mới
          </Button>
          <Button
            disabled={!selectedKeys.length}
            onClick={onRenew}
            icon={<ReloadOutlined />}
          >
            Gia hạn
          </Button>
        </Space>

        <Table
          rowSelection={{
            selectedRowKeys: selectedKeys,
            onChange: setSelectedKeys
          }}
          columns={columns}
          dataSource={data.filter(i =>
            JSON.stringify(i).toLowerCase().includes(search.toLowerCase())
          )}
          rowKey="Id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={editingId ? "Cập nhật bảo hiểm" : "Tạo bảo hiểm mới"}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ CHUKY: "Tháng" }}
          >
            <Form.Item
              name="MANV"
              label="Nhân viên"
              rules={[{ required: true, message: "Chọn nhân viên" }]}
            >
              <Select placeholder="Chọn nhân viên">
                {emps.map(e => (
                  <Option key={e.MANV} value={e.MANV}>
                    {e.TENNV}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="MALBH"
              label="Loại bảo hiểm"
              rules={[{ required: true, message: "Chọn loại bảo hiểm" }]}
            >
              <Select placeholder="Chọn loại bảo hiểm">
                {types.map(t => (
                  <Option key={t.MALBH} value={t.MALBH}>
                    {t.TENLBH}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="CHUKY"
              label="Chu kỳ"
              rules={[{ required: true, message: "Chọn chu kỳ" }]}
            >
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
