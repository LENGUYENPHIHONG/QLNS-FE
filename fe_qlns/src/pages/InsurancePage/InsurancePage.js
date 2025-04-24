import React, { useState, useEffect } from "react";
import {
  Layout, Form, Input, Button, Table, Space, Modal, message, Select, DatePicker, Tag
} from "antd";
import {
  SearchOutlined, DeleteOutlined, CheckCircleOutlined, ReloadOutlined
} from "@ant-design/icons";
import {
  fetchInsurances,
  createInsurance,
  deleteInsurance,
  approveInsurance,
  renewInsurance,
  endInsurance,
  getInsuranceTypes,
  getEmployees,
  getNewInsuranceCode,
  fetchInsuranceById // ✅ thêm hàm fetch chi tiết
} from "../../api/insuranceDetailApi";


const { Content } = Layout;
const { Option } = Select;

const InsuranceManagement = () => {
  const [form] = Form.useForm();
  const [insurances, setInsurances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bhRes, nvRes, lbhRes] = await Promise.all([
        fetchInsurances(),
        getEmployees(),
        getInsuranceTypes(),
      ]);

      if (bhRes.data?.Success) {
        const list = bhRes.data.Data.map((i) => ({
          id: i.Id,
          employeeName: i.TENNV,
          insuranceType: i.TENLBH,
          effectiveDate: i.NGAYBATDAU?.split("T")[0],
          endDate: i.NGAYKETTHUC?.split("T")[0] || "",
          status: i.TRANGTHAI
        }));
        setInsurances(list);
      }
      if (nvRes.data?.Data) setEmployees(nvRes.data.Data);
      if (lbhRes.data?.Data) setInsuranceTypes(lbhRes.data.Data);
    } catch (err) {
      message.error("Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInsurance = async (values) => {
    setLoading(true);
    try {
        const payload = {
            MANV: values.employeeId,
            MALBH: values.insuranceTypeId,
            NGAYBATDAU: values.effectiveDate.format("YYYY-MM-DD"),
            TILETONG: values.tileTong.endsWith("%") ? values.tileTong : `${values.tileTong}%`,
            TILENV: values.tileNv.endsWith("%") ? values.tileNv : `${values.tileNv}%`,
            TILECTY: values.tileCty.endsWith("%") ? values.tileCty : `${values.tileCty}%`,  // ⚠️ Bổ sung dòng này
            CHUKY: values.chuKy,
            TRANGTHAI: "Chưa đóng"
          };
          
  
      console.log("📦 Payload gửi lên:", payload); // Gỡ lỗi
      const res = await createInsurance(payload);
  
      if (res.data?.Success) {
        message.success("Thêm bảo hiểm thành công");
        setIsModalOpen(false);
        form.resetFields();
        await loadData();
      } else {
        message.error(res.data?.Message || "Lỗi khi thêm bảo hiểm");
      }
    } catch (err) {
      console.error("❌ Lỗi gửi API:", err?.response?.data || err);
      message.error("Lỗi khi thêm bảo hiểm");
    } finally {
      setLoading(false);
    }
  };
  

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      const detailRes = await fetchInsuranceById(id);
      const detail = detailRes.data?.Data;
  
      console.log("📦 Dữ liệu chi tiết bảo hiểm:", detail);
  
      const dto = {
        MANV: detail.MANV,
        MALBH: detail.MALBH,
        TILETONG: detail.TILETONG + "%",
        TILENV: detail.TILENV + "%",
        TILECTY: detail.TILECTY + "%",
        CHUKY: detail.CHUKY,
        NGAYBATDAU: detail.NGAYBATDAU,
        TRANGTHAI: "Đã đóng"
      };
  
      const res = await approveInsurance(id, dto);
  
      if (res.data?.Success) {
        message.success("Phê duyệt thành công!");
        await loadData();
      } else {
        message.error(res.data?.Message || "Không thể phê duyệt bảo hiểm.");
      }
    } catch (err) {
      console.error("❌ Lỗi phê duyệt chi tiết:", err?.response?.data || err);
      message.error(err?.response?.data?.Message || "Lỗi khi phê duyệt bảo hiểm.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleRenew = async (id) => {
    setLoading(true);
    try {
      const res = await renewInsurance(id);
      if (res.data?.Success) {
        message.success("Gia hạn bảo hiểm thành công");
        await loadData();
      } else {
        message.error(res.data?.Message || "Lỗi khi gia hạn");
      }
    } catch {
      message.error("Lỗi khi gia hạn bảo hiểm");
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async (id) => {
    Modal.confirm({
      title: "Xác nhận kết thúc bảo hiểm?",
      content: "Chỉ bảo hiểm đã hết hạn mới được xóa.",
      okText: "Kết thúc",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true);
        try {
          const res = await endInsurance(id);
          if (res.data?.Success) {
            message.success("Đã kết thúc bảo hiểm");
            await loadData();
          } else {
            message.error(res.data?.Message || "Lỗi khi kết thúc");
          }
        } catch {
          message.error("Lỗi khi kết thúc bảo hiểm");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const columns = [
    {
      title: "Tên nhân viên",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Loại bảo hiểm",
      dataIndex: "insuranceType",
      key: "insuranceType",
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
        let color = "default";
        if (status === "Đã đóng") color = "green";
        else if (status === "Hết hạn") color = "red";
        else if (status === "Sắp hết hạn") color = "gold";
        else if (status === "Chưa đóng") color = "orange";
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: "Tùy chọn",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.status === "Chưa đóng" && (
            <Button icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id)}>Duyệt</Button>
          )}
          {record.status === "Đã đóng" && (
            <Button icon={<ReloadOutlined />} onClick={() => handleRenew(record.id)}>Gia hạn</Button>
          )}
          {record.status === "Hết hạn" && (
            <Button icon={<DeleteOutlined />} danger onClick={() => handleEnd(record.id)}>Xóa</Button>
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
            Thêm bảo hiểm
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={insurances}
          rowKey="id"
          loading={loading}
          pagination={false}
        />

        <Modal
          title="Thêm bảo hiểm mới"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form layout="vertical" form={form} onFinish={handleAddInsurance}>
            <Form.Item name="employeeId" label="Tên nhân viên" rules={[{ required: true }]}> 
              <Select placeholder="Chọn nhân viên">
                {employees.map((nv) => (
                  <Option key={nv.MANV} value={nv.MANV}>{nv.TENNV}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="insuranceTypeId" label="Loại bảo hiểm" rules={[{ required: true }]}> 
              <Select placeholder="Chọn loại bảo hiểm">
                {insuranceTypes.map((lbh) => (
                  <Option key={lbh.MALBH} value={lbh.MALBH}>{lbh.TENLBH}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="effectiveDate" label="Ngày bắt đầu" rules={[{ required: true }]}> 
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item name="tileTong" label="Tỉ lệ tổng (%)" rules={[{ required: true }]}> 
              <Input placeholder="VD: 10%" />
            </Form.Item>
            <Form.Item name="tileNv" label="Tỉ lệ nhân viên (%)" rules={[{ required: true }]}> 
              <Input placeholder="VD: 5%" />
            </Form.Item>
            <Form.Item name="tileCty" label="Tỉ lệ công ty (%)" rules={[{ required: true }]}> 
              <Input placeholder="VD: 5%" />
            </Form.Item>
            <Form.Item name="chuKy" label="Chu kỳ (VD: 3 tháng)" rules={[{ required: true }]}> 
              <Input />
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit" loading={loading}>Thêm</Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default InsuranceManagement;