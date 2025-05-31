// File: src/pages/EmployeePage/EmployeeContractsTab.js
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
  InputNumber
} from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  fetchContracts,
  createContract,
  renewContracts
} from "../../api/contractApi";
import { fetchContractTypes } from "../../api/contractTypeApi";

const { Option } = Select;

export default function EmployeeContractsTab({ employeeId }) {
  const [contracts, setContracts] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
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
      // GỬI THẲNG MẢNG ID, KHÔNG BỌC OBJECT
      await renewContracts(selectedKeys);
      toast.success("Gia hạn hợp đồng thành công");
      setSelectedKeys([]);
      await loadContracts();
    } catch (err){
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
    </>
  );
}
