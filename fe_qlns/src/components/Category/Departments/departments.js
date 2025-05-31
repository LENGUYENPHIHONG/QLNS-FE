// src/pages/DepartmentManagement.js
import React, { useEffect, useState } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Table,
  Space,
  Modal,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  getNewDepartmentCode,
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../../api/departmentModalApi"; // API phải có đúng 5 hàm này
import { toast } from "react-toastify";

const { Content } = Layout;

const DepartmentManagement = () => {
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [departments, setDepartments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 1. Load dữ liệu & sinh mã mới khi mount
  useEffect(() => {
    loadDepartments();
    genNewCode();
  }, []);

  // 2. Khi searchTerm hoặc departments thay đổi thì filter lại bảng
  useEffect(() => {
    if (!searchTerm) {
      setFiltered(departments);
      return;
    }
    const lower = searchTerm.toLowerCase();
    setFiltered(
      departments.filter(
        (d) =>
          d.MAPB.toLowerCase().includes(lower) ||
          d.TENPB.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, departments]);

  // Hàm lấy mã mới
  const genNewCode = async () => {
    try {
      const res = await getNewDepartmentCode();
      if (res.data?.code) {
        addForm.setFieldsValue({ departmentCode: res.data.code });
      }
    } catch {
      toast.error("Không thể lấy mã phòng ban mới");
    }
  };

  // Hàm load toàn bộ phòng ban
  const loadDepartments = async () => {
    setLoading(true);
    try {
      const res = await fetchDepartments();
      // Giả sử API trả về res.data.Data = [ { MAPB, TENPB }, ... ]
      if (Array.isArray(res.data.Data)) {
        setDepartments(res.data.Data);
        setFiltered(res.data.Data);
      } else {
        setDepartments([]);
        setFiltered([]);
        toast.warning("Không có dữ liệu phòng ban.");
      }
    } catch (err) {
      toast.error("Lỗi khi tải danh sách phòng ban.");
    } finally {
      setLoading(false);
    }
  };

  // Thêm mới phòng ban
  const handleAdd = async (values) => {
    setLoading(true);
    try {
      const payload = {
        MAPB: values.departmentCode,
        TENPB: values.departmentName,
      };
      const res = await createDepartment(payload);
      if (res.data?.Success) {
        toast.success(res.data.Message);
        addForm.resetFields();
        await loadDepartments();
        await genNewCode();
      } else {
        toast.error(res.data.Message || "Thêm thất bại");
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || "Lỗi thêm phòng ban.");
    } finally {
      setLoading(false);
    }
  };

  // Bắt đầu chỉnh sửa
  const onEdit = (record) => {
    setEditing(true);
    setEditingItem(record);
    editForm.setFieldsValue({
      departmentCode: record.MAPB,
      departmentName: record.TENPB,
    });
  };

  // Cập nhật phòng ban
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const vals = await editForm.validateFields();
      const payload = {
        MAPB: editingItem.MAPB,
        TENPB: vals.departmentName,
      };
      const res = await updateDepartment(payload);
      if (res.data?.Success) {
        toast.success(res.data.Message);
        setEditing(false);
        setEditingItem(null);
        await loadDepartments();
      } else {
        toast.error(res.data.Message || "Cập nhật thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi cập nhật phòng ban.");
    } finally {
      setLoading(false);
    }
  };

  // Xoá phòng ban
  const handleDelete = async (record) => {
    setLoading(true);
    try {
      const res = await deleteDepartment({ MAPB: record.MAPB });
      if (res.data?.Success) {
        toast.success(res.data.Message);
        await loadDepartments();
      } else {
        toast.error(res.data.Message || "Xóa thất bại");
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || "Lỗi khi xóa phòng ban.");
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình cột cho Table
  const columns = [
    {
      title: "Mã phòng ban",
      dataIndex: "MAPB",
      key: "MAPB",
    },
    {
      title: "Tên phòng ban",
      dataIndex: "TENPB",
      key: "TENPB",
    },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
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
    <Layout style={{ backgroundColor: "white", borderRadius: 8 }}>
      <Content style={{ padding: 20 }}>
        {/* === Form thêm mới === */}
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAdd}
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 8,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <Form.Item
              name="departmentCode"
              label="Mã phòng ban"
              rules={[
                { required: true, message: "Vui lòng nhập mã phòng ban!" },
              ]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Mã phòng ban" readOnly />
            </Form.Item>
            <Form.Item
              name="departmentName"
              label="Tên phòng ban"
              rules={[
                { required: true, message: "Vui lòng nhập tên phòng ban!" },
              ]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Tên phòng ban" />
            </Form.Item>
          </div>
          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Thêm
            </Button>
          </Form.Item>
        </Form>

        {/* === Khung tìm kiếm === */}
        <Space style={{ marginBottom: 20 }}>
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
        </Space>

        {/* === Bảng hiển thị === */}
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="MAPB"
          loading={loading}
          pagination={false}
          scroll={{ x: true }}
          locale={{ emptyText: "Không có dữ liệu" }}
        />

        {/* === Modal chỉnh sửa === */}
        <Modal
          title="Chỉnh sửa phòng ban"
          visible={editing}
          onCancel={() => {
            setEditing(false);
            setEditingItem(null);
            editForm.resetFields();
          }}
          onOk={handleUpdate}
          okText="Cập nhật"
          confirmLoading={loading}
        >
          <Form form={editForm} layout="vertical">
            <Form.Item name="departmentCode" label="Mã phòng ban">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="departmentName"
              label="Tên phòng ban"
              rules={[
                { required: true, message: "Vui lòng nhập tên phòng ban!" },
              ]}
            >
              <Input placeholder="Tên phòng ban" />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default DepartmentManagement;
