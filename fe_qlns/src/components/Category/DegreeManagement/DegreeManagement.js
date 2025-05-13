import React, { useState, useEffect } from "react";
import {
  Layout,
  Form,
  Select,
  Table,
  Space,
  DatePicker,
  Button,
  Popconfirm,
  Input
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import moment from "moment";
import { toast } from 'react-toastify';
// APIs
import { fetchEmployees } from "../../../api/employeeApi";
import {
  fetchDegreeDetails,
  createDegreeDetail,
  updateDegreeDetail,
  deleteDegreeDetail
} from "../../../api/degreeDetailApi";
import { fetchDegreeTypes } from "../../../api/degreeTypeModalApi";

// Modal loại bằng cấp (tách riêng)
import DegreeTypeModal from "./DegreeTypeModal";

const { Content } = Layout;
const { Option } = Select;

const DegreeManagement = () => {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [degreeTypes, setDegreeTypes] = useState([]);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadEmployees();
    loadDegreeTypes();
    loadDetails();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await fetchEmployees();
      const list = res.data.Data || res.data;
      setEmployees(list);
    } catch {
      toast.error("Không tải được danh sách nhân viên");
    }
  };

  const loadDegreeTypes = async () => {
    try {
      const res = await fetchDegreeTypes();
      setDegreeTypes(res.data.Data);
    } catch {
      toast.error("Không tải được loại bằng cấp");
    }
  };

  const loadDetails = async () => {
    setLoading(true);
    try {
      const res = await fetchDegreeDetails();
      setDetails(res.data);
    } catch {
      toast.error("Không tải được danh sách bằng cấp");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    const payload = {
      MANV: values.MANV,
      MALBC: values.MALBC,
      TENBC: degreeTypes.find(t => t.MALBC === values.MALBC)?.LOAIBC,
      NOICAP: values.NOICAP,
      NGAYCAP: values.NGAYCAP.format("YYYY-MM-DD")
    };
    try {
      if (editingId) {
        var res = await updateDegreeDetail(editingId, payload);
        toast.success(res.data?.Message);
      } else {
        var res = await createDegreeDetail(payload);
        toast.success(res.data?.Message);
      }
      form.resetFields();
      setEditingId(null);
      loadDetails();
    } catch {
      toast.error("Lỗi xử lý");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.Id);
    form.setFieldsValue({
      MANV: record.MANV,
      MALBC: record.MALBC,
      NOICAP: record.NOICAP,
      NGAYCAP: moment(record.NGAYCAP)
    });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      var res = await deleteDegreeDetail(id);
      toast.success(res.data?.Message);
      loadDetails();
    } catch( err) {
      toast.error(res.data?.Message || "Xóa thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDetails = details.filter(d =>
    d.TENNV.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.LOAIBC.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: "Nhân viên", dataIndex: "TENNV", key: "TENNV" },
    { title: "Loại bằng cấp", dataIndex: "LOAIBC", key: "LOAIBC" },
    { title: "Nơi cấp", dataIndex: "NOICAP", key: "NOICAP" },
    { title: "Ngày cấp", dataIndex: "NGAYCAP", key: "NGAYCAP", render: text => moment(text).format("DD/MM/YYYY") },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.Id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ];
  
  return (
    <Layout style={{ backgroundColor: "#fff", padding: 20 }}>
      <Content>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ marginBottom: 24 }}
        >
          {/* Row 1: Nhân viên + Loại bằng cấp */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <Form.Item
              name="MANV"
              label="Nhân viên"
              rules={[{ required: true, message: 'Chọn nhân viên!' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Chọn nhân viên">
                {employees.map(emp => (
                  <Option key={emp.MANV} value={emp.MANV}>{emp.TENNV}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="MALBC"
              label={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Loại bằng cấp{' '}
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    onClick={() => setTypeModalVisible(true)}
                    style={{ padding: 0, marginBottom: -15, top: -5 }}
                  />
                </span>
              }
              rules={[{ required: true, message: 'Chọn loại bằng cấp!' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Chọn loại bằng cấp">
                {degreeTypes.map(type => (
                  <Option key={type.MALBC} value={type.MALBC}>{type.LOAIBC}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Row 2: Nơi cấp + Ngày cấp */}
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <Form.Item
              name="NOICAP"
              label="Nơi cấp"
              rules={[{ required: true, message: 'Nhập nơi cấp!' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Nơi cấp" />
            </Form.Item>
            <Form.Item
              name="NGAYCAP"
              label="Ngày cấp"
              rules={[{ required: true, message: 'Chọn ngày cấp!' }]}
              style={{ flex: 1 }}
            >
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </div>

          {/* Row 3: Nút Thêm */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingId ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Form.Item>
          </div>
        </Form>

        {/* Search */}
        <Space style={{ marginBottom: 16 }}>
          <SearchOutlined />
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
          />
        </Space>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredDetails}
          rowKey="Id"
          loading={loading}
          pagination={false}
        />

        {/* Modal Loại bằng cấp */}
        <DegreeTypeModal
          visible={typeModalVisible}
          onCancel={() => setTypeModalVisible(false)}
          onTypesChange={loadDegreeTypes}
        />
      </Content>
    </Layout>
  );
};

export default DegreeManagement;
