import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Popconfirm,
  Input
} from "antd";
import { CheckCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  fetchContracts,
  createContract,
  renewContracts,
  approveContract,
  rejectContract,
  requestEndContract,
  confirmEndContract,
  deleteContract
} from "../../api/contractApi";
import { fetchContractTypes } from "../../api/contractTypeApi";

const { Option, TextArea } = Select;

export default function EmployeeContractsTab({ employeeId }) {
  const [contracts, setContracts] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [endModalVisible, setEndModalVisible] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchContractTypes()
      .then(res => setContractTypes(res.data?.Data || []))
      .catch(() => toast.error("Lỗi tải loại hợp đồng"));
  }, []);

  useEffect(() => {
    if (employeeId) loadContracts();
  }, [employeeId]);

  async function loadContracts() {
    setLoading(true);
    try {
      const res = await fetchContracts({ manv: employeeId });
      setContracts(res.data?.Data || []);
    } catch {
      toast.error("Lỗi khi tải hợp đồng");
    } finally {
      setLoading(false);
    }
  }

  const handleRenew = async () => {
    if (!selectedKeys.length) {
      toast.warning("Chọn ít nhất 1 hợp đồng để gia hạn");
      return;
    }
    setLoading(true);
    try {
      await renewContracts(selectedKeys);
      toast.success("Gia hạn hợp đồng thành công");
      setSelectedKeys([]);
      await loadContracts();
    } catch (err) {
      console.error("Lỗi khi gọi renewContracts:", err);
      console.error("Response data:", err.response?.data);
      toast.error("Gia hạn thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async values => {
    setLoading(true);
    try {
      await createContract({
        MANV: employeeId,
        MALHD: values.contractType,
        LUONGCOBAN: values.salary,
        NGAYBATDAU: values.startDate.format("YYYY-MM-DD"),
        TRANGTHAI: "Chờ phê duyệt"
      });
      toast.success("Thêm hợp đồng thành công");
      form.resetFields();
      setIsModalOpen(false);
      await loadContracts();
    } catch {
      toast.error("Thêm hợp đồng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async id => {
    setLoading(true);
    try {
      await approveContract(id);
      toast.success('Đã duyệt hợp đồng');
      await loadContracts();
    } catch {
      toast.error('Lỗi khi duyệt hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async id => {
    setLoading(true);
    try {
      await rejectContract(id);
      toast.success('Đã từ chối hợp đồng');
      await loadContracts();
    } catch {
      toast.error('Lỗi khi từ chối hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestEnd = id => {
    setSelectedContractId(id);
    setCancelReason('');
    setEndModalVisible(true);
  };

  const confirmEnd = async () => {
    if (!cancelReason.trim()) {
      toast.warning('Vui lòng nhập lý do kết thúc');
      return;
    }
    setLoading(true);
    try {
      await requestEndContract(selectedContractId, { 
        LYDOHUY: cancelReason, 
        NGAYHUY: new Date().toISOString() 
      });
      toast.success('Yêu cầu kết thúc hợp đồng đã gửi');
      setEndModalVisible(false);
      await loadContracts();
    } catch {
      toast.error('Lỗi khi gửi yêu cầu kết thúc');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEnd = async id => {
    setLoading(true);
    try {
      await confirmEndContract(id);
      toast.success('Đã xác nhận kết thúc hợp đồng');
      await loadContracts();
    } catch {
      toast.error('Lỗi khi xác nhận kết thúc');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    setLoading(true);
    try {
      await deleteContract(id);
      toast.success('Đã xóa hợp đồng');
      await loadContracts();
    } catch {
      toast.error('Lỗi khi xóa hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã hợp đồng",
      key: "code",
      render: (_, r) => r.MAHOPDONG || r.MAHD || r.Id || "-"
    },
    { title: "Loại hợp đồng", dataIndex: "TENLHD", key: "TENLHD" },
    {
      title: "Ngày bắt đầu",
      dataIndex: "NGAYBATDAU",
      key: "NGAYBATDAU",
      render: d => (d ? dayjs(d).format("YYYY-MM-DD") : "-")
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "NGAYKETTHUC",
      key: "NGAYKETTHUC",
      render: d => (d ? dayjs(d).format("YYYY-MM-DD") : "-")
    },
    {
      title: "File",
      dataIndex: "ANH",
      key: "file",
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            PDF
          </a>
        ) : (
          "-"
        )
    },
    {
      title: "Trạng thái",
      dataIndex: "TRANGTHAI",
      key: "TRANGTHAI",
      render: st => {
        let c = "default";
        if (st === "Chờ phê duyệt") c = "orange";
        else if (st === "Đang hiệu lực") c = "green";
        else if (st === "Sắp hết hiệu lực") c = "gold";
        else if (st === "Hết hiệu lực") c = "red";
        return <Tag color={c}>{st}</Tag>;
      }
    },
    {
      title: "Tùy chọn",
      key: "actions",
      render: (_, r) => (
        <Space>
          {r.TRANGTHAI === "Chờ phê duyệt" && (
            <>
              <Button 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleApprove(r.Id)}
              >
                Duyệt
              </Button>
              <Button 
                danger 
                onClick={() => handleReject(r.Id)}
              >
                Từ chối
              </Button>
            </>
          )}
          {["Đang hiệu lực", "Chờ phê duyệt", "Sắp hết hiệu lực"].includes(r.TRANGTHAI) && (
            <Button 
              danger 
              onClick={() => handleRequestEnd(r.Id)}
            >
              Kết thúc
            </Button>
          )}
          {r.TRANGTHAI === "Chờ xử lý kết thúc" && (
            <Button 
              onClick={() => handleConfirmEnd(r.Id)}
            >
              Xác nhận
            </Button>
          )}
          {r.TRANGTHAI === "Hết hiệu lực" && (
            <Popconfirm 
              title="Bạn có chắc muốn xóa hợp đồng này?" 
              onConfirm={() => handleDelete(r.Id)} 
              okText="Xóa" 
              cancelText="Hủy"
            >
              <Button 
                icon={<DeleteOutlined />} 
                danger 
              />
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Thêm hợp đồng
        </Button>
        <Button onClick={handleRenew} disabled={!selectedKeys.length}>
          Gia hạn đã chọn
        </Button>
      </Space>

      <Table
        rowSelection={{ selectedRowKeys: selectedKeys, onChange: setSelectedKeys }}
        dataSource={contracts}
        columns={columns}
        rowKey="Id"
        loading={loading}
        pagination={false}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title="Thêm hợp đồng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            name="contractType"
            label="Loại hợp đồng"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn loại hợp đồng">
              {contractTypes.map(t => (
                <Option key={t.MALHD} value={t.MALHD}>
                  {t.TENLHD}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="salary"
            label="Lương cơ bản"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={v =>
                v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={v => v.replace(/\D/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Lý do kết thúc hợp đồng"
        open={endModalVisible}
        onOk={confirmEnd}
        onCancel={() => setEndModalVisible(false)}
        okText="Gửi yêu cầu"
        cancelText="Hủy"
      >
        <Input.TextArea
          rows={4}
          value={cancelReason}
          onChange={e => setCancelReason(e.target.value)}
          placeholder="Nhập lý do kết thúc hợp đồng"
        />
      </Modal>
    </>
  );
}