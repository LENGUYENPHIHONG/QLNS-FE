import React, { useState, useEffect } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Select,
  Table,
  Space,
  Modal,
  Popconfirm,
  InputNumber
} from "antd";
import { toast } from 'react-toastify';
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getAutoCode,
  getAllLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
} from "../../../api/leaveTypeApi";

const { Content } = Layout;
const { Option } = Select;

const LeaveTypeManagement = () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoCode, setAutoCode] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
    fetchAutoCode();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllLeaveTypes();
      if (res.data?.Success) setLeaveTypes(res.data.Data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách loại phép");
    } finally {
      setLoading(false);
    }
  };

  const fetchAutoCode = async () => {
    try {
      const res = await getAutoCode();
      setAutoCode(res.data?.code);
      form.setFieldsValue({ leaveTypeCode: res.data?.code });
    } catch (error) {
      toast.error("Không lấy được mã loại phép");
    }
  };

  const handleAddLeaveType = async (values) => {
    setLoading(true);
    try {
      const payload = {
        MALP: values.leaveTypeCode,
        TENLP: values.leaveTypeName,
        AffectQuota: values.hasImpact === "Có" ? true : false,
        NGAYTOIDA: values.maxDays
      };
      const res = await createLeaveType(payload);
      if (res.data?.Success) {
        toast.success(res.data?.Message);
        form.resetFields();
        await fetchData();
        await fetchAutoCode();
      } else {
        toast.error(res.data?.Message || "Lỗi thêm loại phép");
      }
    } catch (err) {
      toast.error("Lỗi khi gửi yêu cầu thêm loại phép");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLeaveType = async () => {
    try {
      const values = await modalForm.validateFields();
      const payload = {
        MALP: values.leaveTypeCode,
        TENLP: values.leaveTypeName,
        AffectQuota: values.hasImpact === "Có",
        NGAYTOIDA: values.maxDays
      };
      const res = await updateLeaveType(editingId, payload);
      if (res.data?.Success) {
        toast.success(res.data?.Message);
        setIsEditMode(false);
        setEditingId(null);
        modalForm.resetFields();
        setIsModalVisible(false);
        await fetchData();
        await fetchAutoCode();
      } else {
        toast.error(res.data?.Message || "Cập nhật thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi cập nhật loại phép");
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await deleteLeaveType(id);
      if (res.data?.Success) {
        toast.success(res.data?.Message);
        await fetchData();
      } else {
        toast.error(res.data?.Message);
      }
    } catch (error) {
      toast.error("Lỗi khi xóa loại phép");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã loại nghỉ phép",
      dataIndex: "MALP",
      key: "MALP",
    },
    {
      title: "Tên loại nghỉ phép",
      dataIndex: "TENLP",
      key: "TENLP",
    },
    {
      title: "Ảnh hưởng",
      dataIndex: "AffectQuota",
      key: "AffectQuota",
      render: (val) => (val ? "Có" : "Không"),
    },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setIsEditMode(true);
              setEditingId(record.MALP);
              setIsModalVisible(true);
              modalForm.setFieldsValue({
                leaveTypeCode: record.MALP,
                leaveTypeName: record.TENLP,
                hasImpact: record.AffectQuota ? "Có" : "Không",
                maxDays: record.NGAYTOIDA
              });
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.MALP)}
          >
            <Button danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ backgroundColor: "white", margin: "0px", borderRadius: "8px" }}>
      <Content style={{ padding: "20px" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddLeaveType}
          style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", marginBottom: "10px" }}
        >
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
            <Form.Item name="leaveTypeCode" label="Mã loại nghỉ phép" style={{ flex: 1 }}>
              <Input disabled />
            </Form.Item>
            <Form.Item name="leaveTypeName" label="Tên loại nghỉ phép" rules={[{ required: true, message: "Vui lòng nhập tên loại nghỉ phép!" }]} style={{ flex: 1 }}>
              <Input placeholder="Tên loại nghỉ phép" />
            </Form.Item>
            <Form.Item name="hasImpact" label="Ảnh hưởng" rules={[{ required: true, message: "Vui lòng chọn ảnh hưởng!" }]} style={{ flex: 1 }}>
              <Select placeholder="Chọn ảnh hưởng">
                <Option value="Có">Có</Option>
                <Option value="Không">Không</Option>
              </Select>
            </Form.Item>
            <Form.Item name="maxDays" label="Ngày tối đa" style={{ flex: 1 }}>
              <InputNumber min={1} placeholder="Số ngày tối đa" style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-5px" }}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Thêm
              </Button>
            </Form.Item>
          </div>
        </Form>

        <Modal
          title="Cập nhật loại nghỉ phép"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={handleUpdateLeaveType}
          okText="Cập nhật"
          confirmLoading={loading}
        >
          <Form form={modalForm} layout="vertical">
            <Form.Item name="leaveTypeCode" label="Mã loại nghỉ phép">
              <Input disabled />
            </Form.Item>
            <Form.Item name="leaveTypeName" label="Tên loại nghỉ phép" rules={[{ required: true, message: "Vui lòng nhập tên loại nghỉ phép!" }]}> <Input /> </Form.Item>
            <Form.Item name="hasImpact" label="Ảnh hưởng" rules={[{ required: true, message: "Vui lòng chọn ảnh hưởng!" }]}> <Select> <Option value="Có">Có</Option> <Option value="Không">Không</Option> </Select> </Form.Item>
            <Form.Item name="maxDays" label="Ngày tối đa"> <InputNumber min={1} placeholder="Số ngày tối đa" style={{ width: "100%" }} /> </Form.Item>
          </Form>
        </Modal>

        <Space style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
          <Input placeholder="Tìm kiếm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} prefix={<SearchOutlined style={{ color: "#007bff" }} />} style={{ width: "300px" }} />
        </Space>

        <Table columns={columns} dataSource={leaveTypes} rowKey="MALP" loading={loading} pagination={false} />
      </Content>
    </Layout>
  );
};

export default LeaveTypeManagement;
