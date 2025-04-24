// File: src/pages/EmployeePage/EmployeeListPage.js
import React, { useEffect, useState } from "react";
import {
  Layout, Input, Button, Select, Table, Space, message, Form, Image
} from "antd";
import {
  SearchOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined
} from "@ant-design/icons";
import { Popconfirm } from "antd";
import EmployeeAddModal from "./EmployeeAddModal";
import EmployeeDetailModal from "./EmployeeDetailModal";
import {
  getNewEmployeeCode,
  createEmployee,
  fetchEmployees,
  deleteEmployee,
  getEmployeeDetail,
  updateEmployee
} from "../../api/employeeApi";
import {
  getDepartments,
  getPositions,
  getEducationLevels,
  getSpecializations,
  getEmployeeTypes
} from "../../api/dropdownApi";
import dayjs from "dayjs";

const { Content } = Layout;

const EmployeeListPage = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
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

  const loadInitialData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const res = await fetchEmployees(page, pageSize);
      if (res.data?.Data) {
        const data = res.data.Data.map((e) => ({
          id: e.MANV,
          name: e.TENNV,
          phone: e.SODIENTHOAI,
          avatar: e.ANH ? `http://localhost:5077/${e.ANH}` : "",
          department: e.PhongBanStr,
          position: e.ChucVuStr,
          joinDate: e.NGAYVAOLAM?.split("T")[0],
          status: e.TRANGTHAI,
        }));
        setEmployees(data);
        setFilteredEmployees(data);
        setPagination({
          current: page,
          pageSize,
          total: res.data.Total,
        });
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

  const handleAddOrEditEmployee = async (values, isEditMode) => {
    setLoading(true);
    try {
      const payload = {
        MANV: values.id,
        TENNV: values.name,
        NGAYSINH: values.birthDate?.format("YYYY-MM-DD"),
        GIOITINH: values.gender,
        CCCD: values.cccd,
        SODIENTHOAI: values.phone,
        QUOCTICH: values.nationality,
        DANTOC: values.ethnicity,
        TONGIAO: values.religion,
        HONNHAN: values.maritalStatus,
        NOISINH: values.birthPlace,
        DIACHI: values.address,
        NGAYVAOLAM: values.joinDate?.format("YYYY-MM-DD"),
        IMAGEBASE64: values.IMAGEBASE64 || "",
        MAPB: [values.department],
        MACV: [values.position],
        MATD: values.education,
        MACM: values.specialization,
        MALNV: values.employeeType
      };

      let res;
      if (isEditMode) {
        res = await updateEmployee(payload.MANV, payload);
      } else {
        res = await createEmployee(payload);
      }

      if (res.data?.Success) {
        message.success(isEditMode ? "Cập nhật thành công" : "Thêm thành công");
        setIsModalOpen(false);
        form.resetFields();
        setEditEmployee(null);
        loadInitialData();
      } else {
        message.error(res.data?.Message || "Lỗi xử lý dữ liệu");
      }
    } catch {
      message.error("Lỗi gọi API nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (manv) => {
    try {
      const res = await getEmployeeDetail(manv);
      if (res.data?.Success) {
        setSelectedEmployee(res.data.Data);
        setIsDetailModalOpen(true);
      } else {
        message.error("Không lấy được chi tiết nhân viên");
      }
    } catch {
      message.error("Lỗi khi tải chi tiết nhân viên");
    }
  };

  const handleEdit = async (manv) => {
    try {
      const res = await getEmployeeDetail(manv);
      if (res.data?.Success) {
        const data = res.data.Data;
  
        setEditEmployee({
          id: data.MANV,
          name: data.TENNV,
          phone: data.SODIENTHOAI,
          cccd: data.CCCD,
          birthDate: data.NGAYSINH,
          gender: data.GIOITINH,
          nationality: data.QUOCTICH,
          ethnicity: data.DANTOC,
          religion: data.TONGIAO,
          maritalStatus: data.HONNHAN,
          birthPlace: data.NOISINH,
          address: data.DIACHI,
          joinDate: data.NGAYVAOLAM,
          department: data?.PhongBans?.[0]?.MAPB,
          position: data?.ChucVus?.[0]?.MACV,
          education: data?.TrinhDo?.MATD,
          specialization: data?.ChuyenMon?.MACM,
          employeeType: data?.LoaiNhanVien?.MALNV,
        });
  
        setIsModalOpen(true); // gọi sau khi set xong dữ liệu
      }
    } catch {
      message.error("Không lấy được dữ liệu nhân viên");
    }
  };
  
  

  const handleDelete = async (manv) => {
    try {
      const res = await deleteEmployee(manv);
      if (res.data?.Success) {
        message.success("Đã xóa nhân viên");
        loadInitialData();
      } else {
        message.error(res.data?.Message || "Lỗi khi xóa");
      }
    } catch {
      message.error("Lỗi khi xóa nhân viên");
    }
  };

  const handleFileChange = ({ fileList }) => setFileList(fileList);

  const columns = [
    { title: "Mã NV", dataIndex: "id", key: "id" },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (url) => url ? <Image src={url} width={50} height={50} /> : "Không có ảnh"
    },
    { title: "Tên nhân viên", dataIndex: "name", key: "name" },
    { title: "Phòng ban", dataIndex: "department", key: "department" },
    { title: "Chức vụ", dataIndex: "position", key: "position" },
    { title: "Ngày vào làm", dataIndex: "joinDate", key: "joinDate" },
    {
      title: "Trạng thái", dataIndex: "status", key: "status",
      render: (status) => {
        let bgColor = "#d4edda";  // Mặc định: đang làm
        let textColor = "#155724";
    
        if (status === "Chưa kí hợp đồng") {
          bgColor = "#fff3cd";
          textColor = "#ff9800";
        } else if (status === "Đã nghỉ việc") {
          bgColor = "#f8d7da";
          textColor = "#dc3545";
        }
    
        return (
          <span style={{
            backgroundColor: bgColor,
            color: textColor,
            padding: "2px 10px",
            borderRadius: 20,
            fontWeight: 500
          }}>
            {status}
          </span>
        );
      }
    },
    {
      title: "Tùy chọn", key: "actions",
      render: (_, record) => (
        <Space>
      <Button icon={<EyeOutlined />} onClick={() => handleViewDetail(record.id)} />
      <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
      <Popconfirm
        title="Bạn có chắc muốn xoá nhân viên này không?"
        onConfirm={() => handleDelete(record.id)}
        okText="Xóa"
        cancelText="Hủy"
        placement="topRight"
      >
        <Button icon={<DeleteOutlined />} danger />
      </Popconfirm>
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
            onChange={handleSearch}
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Thêm nhân viên
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredEmployees}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => loadInitialData(page, pageSize),
          }}
        />

        <EmployeeAddModal
          visible={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setEditEmployee(null);
          }}
          onFinish={(values) => handleAddOrEditEmployee(values, !!editEmployee)}
          form={form}
          fileList={fileList}
          onFileChange={handleFileChange}
          loading={loading}
          departments={departments}
          positions={positions}
          educationLevels={educationLevels}
          specializations={specializations}
          employeeTypes={employeeTypes}
          isEdit={!!editEmployee}
          initialValues={editEmployee}
        />


        <EmployeeDetailModal
          visible={isDetailModalOpen}
          onCancel={() => setIsDetailModalOpen(false)}
          employee={selectedEmployee}
        />
      </Content>
    </Layout>
  );
};

export default EmployeeListPage;
