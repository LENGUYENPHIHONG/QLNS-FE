import React, { useEffect, useState } from "react";
import {
  Layout, Input, Button, Select, Table, Space, message, Form, Image
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import EmployeeAddModal from "./EmployeeAddModal.js";
import {
  getNewEmployeeCode,
  createEmployee,
  fetchEmployees
} from "../../api/employeeApi";
import {
  getDepartments,
  getPositions,
  getEducationLevels,
  getSpecializations,
  getEmployeeTypes
} from "../../api/dropdownApi.js";

const { Content } = Layout;
const { Option } = Select;

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);

  useEffect(() => {
    loadInitialData();
    loadDropdowns();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const res = await fetchEmployees();
      if (res.data?.Data) {
        const data = res.data.Data.map((e) => ({
          id: e.MANV,
          name: e.TENNV,
          phone: e.SODIENTHOAI,
          department: e.PhongBanStr,
          position: e.ChucVuStr,
          status: e.TRANGTHAI,
          avatar: e.ANH ? (e.ANH.startsWith("data:") ? e.ANH : `http://localhost:5077/${e.ANH}`) : null,
        }));
        setEmployees(data);
        setFilteredEmployees(data);
      }
    } catch {
      message.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const loadDropdowns = async () => {
    try {
      const [pb, cv, td, cm, lnv] = await Promise.all([
        getDepartments(),
        getPositions(),
        getEducationLevels(),
        getSpecializations(),
        getEmployeeTypes()
      ]);
      setDepartments(pb.data?.Data || []);
      setPositions(cv.data?.Data || []);
      setEducationLevels(td.data?.Data || []);
      setSpecializations(cm.data?.Data || []);
      setEmployeeTypes(lnv.data?.Data || []);
    } catch (error) {
      message.error("Lỗi khi tải dropdown");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(value.toLowerCase()) ||
      emp.department?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = async (values) => {
    setLoading(true);
    try {
      // 🔁 Chuyển ảnh sang base64 nếu có
      const imageFile = fileList[0]?.originFileObj;
      const imageBase64 = imageFile ? await toBase64(imageFile) : "";
  
      const payload = {
        MANV: values.id,
        TENNV: values.name,
        CCCD: values.cccd || "",
        SODIENTHOAI: values.phone || "",
        NGAYSINH: values.birthDate?.format("YYYY-MM-DD") || "",
        NGAYVAOLAM: values.joinDate?.format("YYYY-MM-DD") || "",
        GIOITINH: values.gender || "",
        QUOCTICH: values.nationality || "",
        DANTOC: values.ethnicity || "",
        TONGIAO: values.religion || "",
        HONNHAN: values.maritalStatus || "",
        NOISINH: values.birthPlace || "",
        DIACHI: values.address || "",
        IMAGEBASE64: imageBase64,
        TRANGTHAI: values.status || "Chưa kí hợp đồng",
        MATD: values.education || "",
        MACM: values.specialization || "",
        MALNV: values.employeeType || "",
        MAPB: values.department ? [values.department] : [],
        MACV: values.position ? [values.position] : []
      };
  
      console.log("📤 Payload gửi đi:", payload);
  
      const res = await createEmployee(payload);
      if (res.data?.Success) {
        message.success("Thêm nhân viên thành công");
        setIsModalOpen(false);
        form.resetFields();
        setFileList([]);
        loadInitialData();
      } else {
        message.error(res.data?.Message || "Thêm thất bại");
      }
    } catch (err) {
      message.error("Lỗi khi thêm nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  const handleFileChange = ({ fileList }) => setFileList(fileList);

  const columns = [
    { title: "Mã NV", dataIndex: "id", key: "id" },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) =>
        avatar ? (
          <Image src={avatar} width={50} height={50} style={{ objectFit: "cover", borderRadius: 6 }} />
        ) : (
          <span style={{ color: "#888" }}>Không có ảnh</span>
        ),
    },
    { title: "Tên nhân viên", dataIndex: "name", key: "name" },
    { title: "Phòng ban", dataIndex: "department", key: "department" },
    { title: "Chức vụ", dataIndex: "position", key: "position" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
  ];

  return (
    <Layout style={{ backgroundColor: "white" }}>
      <Content style={{ padding: 20 }}>
        <Space style={{ marginBottom: 20 }}>
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleSearch}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Thêm nhân viên
          </Button>
        </Space>

        <Table columns={columns} dataSource={filteredEmployees} rowKey="id" loading={loading} />

        <EmployeeAddModal
          visible={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onFinish={handleAddEmployee}
          form={form}
          fileList={fileList}
          onFileChange={handleFileChange}
          loading={loading}
          departments={departments}
          positions={positions}
          educationLevels={educationLevels}
          specializations={specializations}
          employeeTypes={employeeTypes}
        />
      </Content>
    </Layout>
  );
};

export default EmployeeListPage;