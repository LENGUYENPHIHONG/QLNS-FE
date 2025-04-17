import React, { useState, useEffect } from "react";
import {
  Layout, Form, Input, Button, Table, Space, Modal, message, Select, DatePicker, Tag
} from "antd";
import {
  SearchOutlined, DeleteOutlined, CheckCircleOutlined
} from "@ant-design/icons";
import {
  fetchContracts,
  createContract,
  deleteContract,
  approveContract,
  rejectContract,
  getNewContractCode,
  endContract
} from "../../api/contractApi";
import { fetchEmployees } from "../../api/employeeApi";
import { fetchContractTypes } from "../../api/contractTypeApi";

const { Content } = Layout;
const { Option } = Select;

const ContractManagement = () => {
  const [form] = Form.useForm();
  const [contracts, setContracts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [endModalVisible, setEndModalVisible] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [hdRes, nvRes, lhdRes] = await Promise.all([
        fetchContracts(),
        fetchEmployees(),
        fetchContractTypes(),
      ]);

      if (hdRes.data?.Success) {
        const list = hdRes.data.Data.map((c) => ({
          id: c.Id,
          employeeName: c.TENNV,
          contractType: c.TENLHD,
          effectiveDate: c.NGAYBATDAU?.split("T")[0],
          endDate: c.NGAYKETTHUC?.split("T")[0] || "",
          status: c.TRANGTHAI,
        }));
        setContracts(list);
      }
      if (nvRes.data?.Data) {
        setEmployees(nvRes.data.Data);
      }
      if (lhdRes.data?.Data) {
        setContractTypes(lhdRes.data.Data);
      }
    } catch (err) {
      message.error("Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddContract = async (values) => {
    setLoading(true);
    try {
      const res = await getNewContractCode();
      const payload = {
        Id: res.data?.code,
        MANV: values.employeeId,
        MALHD: values.contractTypeId,
        NGAYBATDAU: values.effectiveDate.format("YYYY-MM-DD"),
        TRANGTHAI: "Chờ hiệu lực"
      };
      const createRes = await createContract(payload);
      if (createRes.data?.Success) {
        message.success("Thêm hợp đồng thành công");
        setIsModalOpen(false);
        form.resetFields();
        await loadData();
      } else {
        message.error(createRes.data?.Message || "Lỗi khi thêm hợp đồng");
      }
    } catch (err) {
      message.error("Lỗi khi thêm hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      const res = await approveContract(id);
      if (res.data?.Success) {
        message.success("Phê duyệt thành công!");
        await loadData();
      } else {
        message.error(res.data?.Message || "Không thể phê duyệt");
      }
    } catch {
      message.error("Lỗi khi phê duyệt hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    Modal.confirm({
      title: "Xác nhận từ chối hợp đồng?",
      content: "Bạn có chắc chắn muốn từ chối hợp đồng này không?",
      okText: "Từ chối",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          const res = await rejectContract(id);
          if (res.data?.Success) {
            message.success(res.data.Message);
            await loadData();
          } else {
            message.error(res.data?.Message || "Không thể từ chối hợp đồng.");
          }
        } catch {
          message.error("Lỗi khi gọi API từ chối hợp đồng.");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleEnd = (id) => {
    setSelectedContractId(id);
    setCancelReason("");
    setEndModalVisible(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await deleteContract(id);
      if (res.data?.Success) {
        message.success("Xóa hợp đồng thành công");
        await loadData();
      } else {
        message.error(res.data?.Message || "Lỗi khi xóa hợp đồng");
      }
    } catch {
      message.error("Lỗi khi gọi API xóa hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Tên nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Loại hợp đồng",
      dataIndex: "contractType",
      key: "contractType",
    },
    {
      title: "Hiệu lực từ",
      dataIndex: "effectiveDate",
      key: "effectiveDate",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "";
        switch (status) {
          case "Đang hiệu lực": color = "green"; break;
          case "Hết hiệu lực": color = "red"; break;
          case "Sắp hết hiệu lực": color = "gold"; break;
          case "Chờ hiệu lực": color = "orange"; break;
          default: color = "default";
        }
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: "Tùy chọn",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.status === "Chờ hiệu lực" && (
            <>
              <Button icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id)}>Duyệt</Button>
              <Button danger onClick={() => handleReject(record.id)}>Từ chối</Button>
            </>
          )}
    
          {["Đang hiệu lực", "Chờ hiệu lực", "Sắp hết hiệu lực"].includes(record.status) && (
            <Button danger onClick={() => handleEnd(record.id)}>Kết thúc</Button>
          )}
    
          {["Hết hiệu lực", "Hủy hợp đồng"].includes(record.status) && (
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)}>Xoá</Button>
          )}
        </Space>
      )
    }
    
  ];

  return (
    <Layout style={{ backgroundColor: "white" }}>
      <Content style={{ padding: 20 }}>
        <Space style={{ marginBottom: 20 }}>
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Thêm hợp đồng
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={contracts}
          rowKey="id"
          loading={loading}
          pagination={false}
        />

        <Modal
          title="Thêm hợp đồng mới"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form layout="vertical" form={form} onFinish={handleAddContract}>
            <Form.Item name="employeeId" label="Tên nhân viên" rules={[{ required: true }]}> 
              <Select placeholder="Chọn nhân viên">
                {employees.map((nv) => (
                  <Option key={nv.MANV} value={nv.MANV}>{nv.TENNV}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="contractTypeId" label="Loại hợp đồng" rules={[{ required: true }]}> 
              <Select placeholder="Chọn loại hợp đồng">
                {contractTypes.map((lhd) => (
                  <Option key={lhd.MALHD} value={lhd.MALHD}>{lhd.TENLHD}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="effectiveDate" label="Ngày hiệu lực" rules={[{ required: true }]}> 
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit" loading={loading}>Thêm</Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal nhập lý do kết thúc hợp đồng */}
        <Modal
          title="Nhập lý do kết thúc hợp đồng"
          open={endModalVisible}
          onCancel={() => setEndModalVisible(false)}
          onOk={async () => {
            if (!cancelReason.trim()) {
              message.warning("Vui lòng nhập lý do kết thúc!");
              return;
            }
            try {
              const res = await endContract(selectedContractId, {
                LYDOHUY: cancelReason,
                NGAYHUY: new Date().toISOString()
              });
              if (res.data?.Success) {
                message.success(res.data.Message);
                setEndModalVisible(false);
                await loadData();
              } else {
                message.error(res.data?.Message || "Không thể kết thúc hợp đồng.");
              }
            } catch {
              message.error("Lỗi khi kết thúc hợp đồng.");
            }
          }}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập lý do kết thúc hợp đồng..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </Modal>
      </Content>
    </Layout>
  );
};

export default ContractManagement;