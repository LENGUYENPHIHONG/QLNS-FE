// src/pages/LeaveRequestManagement.js
import React, { useState, useEffect } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Select,
  Table,
  Space,
  message,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  getAllLeaveRequests,
  createLeaveRequest,
  approveLeave,
  deleteLeaveRequest,
} from "../../api/leaveRequestApi";
import { fetchEmployees } from "../../api/employeeApi";
import { getAllLeaveTypes } from "../../api/leaveTypeApi";
import { getYearDetails } from "../../api/yearDetailApi";
import dayjs from "dayjs";
import axios from "axios";

const { Content } = Layout;
const { Option } = Select;

const LeaveRequestManagement = () => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [yearDetails, setYearDetails] = useState([]);
  const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    fetchData();
    fetchDropdowns();
    fetchYearDetails();
    fetchFilters();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllLeaveRequests();
      if (res.data?.Success) {
        setLeaveRequests(res.data.Data);
      }
    } catch {
      message.error("Lỗi khi tải dữ liệu nghỉ phép");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const empRes = await fetchEmployees(1, 1000);
      const typeRes = await getAllLeaveTypes();
      if (empRes.data?.Success) setEmployees(empRes.data.Data);
      if (typeRes.data?.Success) setLeaveTypes(typeRes.data.Data);
    } catch {
      message.error("Không thể tải danh sách nhân viên hoặc loại phép");
    }
  };

  const fetchYearDetails = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const res = await getYearDetails(currentYear);
      if (res.data?.Success) setYearDetails(res.data.Data);
    } catch {
      message.error("Không thể tải chi tiết năm");
    }
  };

  const fetchFilters = async () => {
    try {
      const res = await axios.get("http://localhost:5077/api/ChiTietNghiPhep/filter-summary");
      if (res.data?.Success) {
        setLeaveTypeOptions(res.data.Data.LoaiPhep);
        setStatusOptions(res.data.Data.TrangThai);
      }
    } catch {
      message.error("Không thể tải bộ lọc nghỉ phép");
    }
  };

  const getRemainingLeave = (manv, tenLoaiPhep = "Phép năm") => {
    const currentYear = new Date().getFullYear();
    const detail = yearDetails.find(x => x.MaNhanVien === manv && x.Nam === currentYear);
    if (!detail || !detail.ChiTietPhep) return "N/A";

    const phep = detail.ChiTietPhep.find(p => p.LoaiPhep === tenLoaiPhep);
    return phep?.SoPhepConLai ?? "N/A";
  };

  const handleAddLeaveRequest = async (values) => {
    setLoading(true);
    try {
      const start = dayjs(values.startDate).hour(8).minute(0).second(0);
      const end = dayjs(values.endDate).hour(8).minute(0).second(0);
      const diffDays = end.diff(start, "day") + 1;

      if (start.isBefore(dayjs(), 'day')) {
        message.error("Không thể tạo nghỉ phép trong quá khứ.");
        setLoading(false);
        return;
      }

      if (end.isBefore(start, 'day')) {
        message.error("Ngày kết thúc không hợp lệ.");
        setLoading(false);
        return;
      }

      const payload = {
        id: "",
        manv: values.employeeCode,
        malp: values.leaveType,
        ngaybatdau: start.toISOString(),
        ngayketthuc: end.toISOString(),
        songaynghi: diffDays,
        lydo: values.reason,
        trangthai: "Chờ phê duyệt",
        isDeleted: false,
        ngaytao: new Date().toISOString(),
        ngaypheduyet: null
      };

      const res = await createLeaveRequest(payload);
      if (res.data?.Success) {
        message.success("Tạo yêu cầu nghỉ phép thành công");
        form.resetFields();
        fetchData();
      } else {
        message.error(res.data?.Message || "Tạo thất bại");
      }
    } catch (err) {
      console.error("❌ Lỗi tạo nghỉ phép:", err);
      message.error("Lỗi khi tạo yêu cầu nghỉ phép");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      const res = await approveLeave(id);
      if (res.data?.Success) {
        message.success("Phê duyệt thành công");
        fetchData();
      } else {
        message.error(res.data?.Message);
      }
    } catch {
      message.error("Lỗi khi phê duyệt");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await deleteLeaveRequest(id);
      if (res.data?.Success) {
        message.success("Xóa thành công");
        fetchData();
      } else {
        message.error(res.data?.Message);
      }
    } catch {
      message.error("Lỗi khi xóa");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Mã Yêu Cầu", dataIndex: "Id" },
    { title: "Nhân Viên", dataIndex: "TENNV" },
    { title: "Loại Nghỉ", dataIndex: "TENLP" },
    { title: "Từ Ngày", dataIndex: "NGAYBATDAU", render: text => dayjs(text).format("DD/MM/YYYY") },
    { title: "Đến Ngày", dataIndex: "NGAYKETTHUC", render: text => dayjs(text).format("DD/MM/YYYY") },
    { title: "Số Ngày", dataIndex: "SONGAYNGHI" },
    { title: "Lý Do", dataIndex: "LYDO" },
    { title: "Trạng Thái", dataIndex: "TRANGTHAI" },
    {
      title: "Tuỳ Chọn",
      render: (_, record) => (
        <Space>
          {record.TRANGTHAI === "Chờ phê duyệt" && (
            <Button type="primary" onClick={() => handleApprove(record.Id)}>
              Phê duyệt
            </Button>
          )}
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.Id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ backgroundColor: "white" }}>
      <Content style={{ padding: 20 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddLeaveRequest}
          style={{ background: "#fff", padding: 20, borderRadius: 8, marginBottom: 16 }}
        >
          <Space size="large" wrap>
            <Form.Item
              name="employeeCode"
              label="Mã Nhân Viên"
              rules={[{ required: true, message: "Vui lòng chọn nhân viên" }]}
            >
              <Select placeholder="Chọn nhân viên" style={{ width: 200 }}>
                {employees?.map((emp) => (
                  <Option key={emp.MANV} value={emp.MANV}>
                    {emp.TENNV} ({getRemainingLeave(emp.MANV)} ngày còn lại)
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="leaveType"
              label="Loại Nghỉ Phép"
              rules={[{ required: true, message: "Chọn loại nghỉ" }]}
            >
              <Select style={{ width: 200 }} placeholder="Chọn loại nghỉ">
                {leaveTypes?.map((lt) => (
                  <Option key={lt.MALP} value={lt.MALP}>{lt.TENLP}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="startDate"
              label="Ngày Bắt Đầu"
              rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: 180 }} />
            </Form.Item>
            <Form.Item
              name="endDate"
              label="Ngày Kết Thúc"
              rules={[{ required: true, message: "Chọn ngày kết thúc" }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: 180 }} />
            </Form.Item>
            <Form.Item
              name="reason"
              label="Lý do"
              rules={[{ required: true, message: "Nhập lý do" }]}
            >
              <Input placeholder="Lý do nghỉ phép" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Gửi yêu cầu
              </Button>
            </Form.Item>
          </Space>
        </Form>

        <Table
          columns={columns}
          dataSource={leaveRequests}
          rowKey="Id"
          loading={loading}
          bordered
        />
      </Content>
    </Layout>
  );
};

export default LeaveRequestManagement;