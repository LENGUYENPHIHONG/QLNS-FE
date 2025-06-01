// File: src/pages/EmployeePage/EmployeeListPage.js
import React, { useEffect, useState } from "react";
import {
  Layout,
  Input,
  Button,
  Table,
  Space,
  Popconfirm,
  Drawer,
  Tabs,
  Spin,
  Dropdown,
  Menu,
  Form,
  Image,
  Upload,
  message,
  Select,
  Switch
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import EmployeeContractsTab from "../Tab/EmployeeContractsTab";
import EmployeeDetailTab from "../Tab/EmployeeDetailTab";
import EmployeeInsurancesTab from "../Tab/EmployeeInsurancesTab";
import EmployeeLeavesTab from "../Tab/EmployeeLeavesTab";
import EmployeeTrainingsTab from "../Tab/EmployeeTrainingsTab";
import EmployeeRewardsTab from "../Tab/EmployeeRewardsTab";
import EmployeeKyLuatTab from "../Tab/EmployeeKyLuatTab";
import EmployeeAddModal from "./EmployeeAddModal";
import EmployeeDetailModal from "./EmployeeDetailModal";
import {
  fetchEmployees,
  deleteEmployee,
  createEmployee,
  updateEmployee,
  getEmployeeDetail,
  importEmployees,
  exportEmployees
} from "../../api/employeeApi";
import { fetchContracts } from "../../api/contractApi";
import {
  getDepartments,
  getPositions,
  getEducationLevels,
  getSpecializations,
  getEmployeeTypes
} from "../../api/dropdownApi";
import { toast } from 'react-toastify';
import dayjs from "dayjs";

const { Content } = Layout;
const { TabPane } = Tabs;

const EmployeeListPage = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
const [statusFilter, setStatusFilter] = useState(null);
const [showDeleted, setShowDeleted] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);

  // Drawer + Tabs
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(null);
  const [activeTab, setActiveTab] = useState('contracts');
  const [contracts, setContracts] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);

  // Detail modal
  const [selectedEmployeeDetail, setSelectedEmployeeDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadEmployees();
    loadDropdowns();
  }, []);

  const loadEmployees = async (
   page = 1,
   pageSize = pagination.pageSize,
   status = statusFilter,
   deleted = showDeleted
 ) => {
   setLoading(true);
   try {
     // Gọi API kèm statusFilter và showDeleted
     const res = await fetchEmployees(page, pageSize, /*search=*/ null, status, deleted);
      if (res.data?.Data) {
        const data = res.data.Data.map(e => ({
          id: e.MANV,
          name: e.TENNV,
          avatar: e.ANH ? `${process.env.REACT_APP_API_URL}/${e.ANH}` : null,
          department: e.PhongBanStr,
          position: e.ChucVuStr,
          joinDate: e.NGAYVAOLAM?.split('T')[0],
          status: e.TRANGTHAI,
          phone: e.SODIENTHOAI
        }));
        
        setEmployees(data);
        setFilteredEmployees(data);
        setPagination({ current: page, pageSize, total: res.data.Total });
      }
    } catch {
      toast.error('Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const loadDropdowns = async () => {
    try {
      const [pb, cv, td, cm, lnv] = await Promise.all([
        getDepartments(), getPositions(), getEducationLevels(), getSpecializations(), getEmployeeTypes()
      ]);
      setDepartments(pb.data?.Data || []);
      setPositions(cv.data?.Data || []);
      setEducationLevels(td.data?.Data || []);
      setSpecializations(cm.data?.Data || []);
      setEmployeeTypes(lnv.data?.Data || []);
    } catch {
      toast.error('Lỗi khi tải dropdown');
    }
  };

  const handleSearch = e => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredEmployees(
      employees.filter(emp =>
        emp.name.toLowerCase().includes(term.toLowerCase()) ||
        emp.department.toLowerCase().includes(term.toLowerCase())
      )
    );
  };

  const handleAddOrEdit = async (values, isEdit) => {
    setLoading(true);
    try {
      const payload = {
        MANV: values.id,
        TENNV: values.name,
        NGAYSINH: values.birthDate?.format('YYYY-MM-DD') || null,
        GIOITINH: values.gender || null,
        CCCD: values.cccd || null,
        SODIENTHOAI: values.phone || null,
        QUOCTICH: values.nationality || null,
        DANTOC: values.ethnicity || null,
        TONGIAO: values.religion || null,
        HONNHAN: values.maritalStatus || null,
        NOISINH: values.birthPlace || null,
        DIACHI: values.address || null,
        NGAYVAOLAM: values.joinDate?.format('YYYY-MM-DD') || null,
        IMAGEBASE64: values.IMAGEBASE64 || "",
        MAPB: values.department ? [values.department] : [],
        MACV: values.position ? [values.position] : [],
        MATD: values.education || null,
        MACM: values.specialization || null,
        MALNV: values.employeeType || null
      };
      const res = isEdit ? await updateEmployee(values.id, payload) : await createEmployee(payload);
      if (res.data?.Success) {
        toast.success(isEdit ? 'Cập nhật thành công' : 'Thêm thành công');
        setIsAddModalOpen(false);
        form.resetFields();
        loadEmployees();
      } else toast.error(res.data?.Message);
    } catch {
      toast.error('Lỗi sử dụng API');
    } finally { setLoading(false); }
  };

  // Edit employee: load detail then open modal
  const handleEdit = async (id) => {
    setLoading(true);
    try {
      const res = await getEmployeeDetail(id);
      if (res.data?.Success) {
        const data = res.data.Data;
        setEditEmployee({
          id: data.MANV,
          name: data.TENNV,
          birthDate: data.NGAYSINH,
          gender: data.GIOITINH,
          cccd: data.CCCD,
          phone: data.SODIENTHOAI,
          nationality: data.QUOCTICH,
          ethnicity: data.DANTOC,
          religion: data.TONGIAO,
          maritalStatus: data.HONNHAN,
          birthPlace: data.NOISINH,
          address: data.DIACHI,
          joinDate: data.NGAYVAOLAM,
          department: data.PhongBans?.[0]?.MAPB,
          position: data.ChucVus?.[0]?.MACV,
          education: data.TrinhDo?.MATD,
          specialization: data.ChuyenMon?.MACM,
          employeeType: data.LoaiNhanVien?.MALNV,
        });
        form.setFieldsValue({
          ...data,
          birthDate: data.NGAYSINH ? dayjs(data.NGAYSINH) : null,
          joinDate: data.NGAYVAOLAM ? dayjs(data.NGAYVAOLAM) : null
        });
        setIsAddModalOpen(true);
      }
    } catch {
      toast.error('Lỗi khi lấy dữ liệu nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    try {
      const res = await deleteEmployee(id);
      if (res.data?.Success) {
        toast.success(res.data.Message);
        loadEmployees();
      } else toast.error(res.data.Message);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.Message || 'Lỗi khi xóa nhân viên');
    }
  };

  // Utility action
  const openUtilityDrawer = (id, key) => {
    setSelectedEmpId(id);
    setActiveTab(key);
    setIsDrawerOpen(true);
  };

  const utilityMenu = record => (
    <Menu onClick={({ key }) => openUtilityDrawer(record.id, key)}>
      <Menu.Item key="detail">Chi tiết nhân viên</Menu.Item>
      <Menu.Item key="contracts">Hợp đồng</Menu.Item>
      <Menu.Item key="insurances">Bảo hiểm</Menu.Item>
      <Menu.Item key="leaves" >Nghỉ phép</Menu.Item>
      <Menu.Item key="trainings" >Đào tạo</Menu.Item>
      <Menu.Item key="rewards" >Khen thưởng</Menu.Item>
      <Menu.Item key="discipline" >Kỷ luật</Menu.Item>
    </Menu>
  );

  const columns = [
    { title: 'Mã NV', dataIndex: 'id', key: 'id' },
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Dropdown overlay={utilityMenu(record)} trigger={['click']} getPopupContainer={trigger => trigger.parentNode}>
          <div
            style={{
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              color: '#1890ff',
              padding: '8px'  // giữ padding giống ô table
            }}
          >
            {text}
          </div>
        </Dropdown>
      )
    },
    { title: 'Phòng ban', dataIndex: 'department', key: 'department' },
    { title: 'Ngày vào làm', dataIndex: 'joinDate', key: 'joinDate' },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => {
        let bg = '#d4edda', c = '#155724';
        if (s === 'Chưa kí hợp đồng') { bg = '#fff3cd'; c = '#ff9800'; }
        if (s === 'Đã nghỉ việc') { bg = '#f8d7da'; c = '#dc3545'; }
        return <span style={{ background: bg, color: c, padding: '2px 10px', borderRadius: 20 }}>{s}</span>;
      }
    },
    {
      title: 'Tùy chọn', key: 'actions', render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} size='small' onClick={() => handleEdit(r.id)} />
          <Popconfirm title='Bạn có chắc?' onConfirm={() => handleDelete(r.id)} okText='Xóa' cancelText='Hủy'>
            <Button icon={<DeleteOutlined />} danger size='small' />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ background: '#fff' }}>
      <Content style={{ padding: 20 }}>
        <Space style={{ marginBottom: 20 }}>
          <Input placeholder='Tìm kiếm...' prefix={<SearchOutlined />} value={searchTerm} onChange={handleSearch} style={{ width: 300 }} />

          {/* BEGIN FILTER: Select trạng thái */}
          <Select
            placeholder="Chọn trạng thái"
            style={{ width: 180 }}
           allowClear
            value={statusFilter}
            onChange={val => {
              setStatusFilter(val);
              // Sau khi chọn trạng thái, gọi loadEmployees page=1
              loadEmployees(1, pagination.pageSize, val, showDeleted);
            }}
          >
            <Select.Option value="Chưa kí hợp đồng">Chưa kí hợp đồng</Select.Option>
            <Select.Option value="Đang làm việc">Đang làm việc</Select.Option>
            <Select.Option value="Đã nghỉ việc">Đã nghỉ việc</Select.Option>
          </Select>
          {/* END FILTER */}

          {/* BEGIN FILTER: Switch hiển thị nhân viên đã xóa */}
          <span style={{ display: 'flex', alignItems: 'center' }}>
            Hiển thị đã xóa:&nbsp;
            <Switch
             checked={showDeleted}
              onChange={checked => {
               setShowDeleted(checked);
               // Sau khi toggle showDeleted, gọi loadEmployees page=1
               loadEmployees(1, pagination.pageSize, statusFilter, checked);              }}            />
         </span>          {/* END FILTER */}
          <Button type='primary' icon={<PlusOutlined />} onClick={() => setIsAddModalOpen(true)}>Thêm nhân viên</Button>
          {/* Import */}
          <Upload
            accept=".xlsx"
            showUploadList={false}
            beforeUpload={file => {
              importEmployees(file)
                .then(res => {
                  message.success('Import thành công');
                  loadEmployees();
                })
                .catch(err => {
                  console.error(err.response.data);
                  message.error(err.response?.data?.Message || 'Import thất bại');
                });
              // Không tự động upload lại
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Import Excel</Button>
          </Upload>
          {/* Export */}
          <Button
            icon={<DownloadOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={() => {
              exportEmployees(selectedRowKeys)
                .then(({ data }) => {
                  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `DanhSachNhanVien_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                })
                .catch(() => message.error('Export thất bại'));
            }}
          >
            Export Excel
          </Button>
        </Space>
        <Table

          rowSelection={{
            selectedRowKeys,
            onChange: keys => setSelectedRowKeys(keys)
          }}
          columns={columns}
          dataSource={filteredEmployees}
          rowKey='id'
          loading={loading}
          pagination={{
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    onChange: loadEmployees,
    pageSizeOptions: ['10'], // Chỉ cho phép chọn 10
    showSizeChanger: false // Vô hiệu hóa tùy chọn thay đổi số lượng
  }}
        />

        <EmployeeAddModal
          visible={isAddModalOpen}
          onCancel={() => { setIsAddModalOpen(false); setEditEmployee(null); }}
          onFinish={(vals) => handleAddOrEdit(vals, !!editEmployee)}
          form={form}
          fileList={fileList}
          onFileChange={({ fileList }) => setFileList(fileList)}
          loading={loading}
          departments={departments}
          positions={positions}
          educationLevels={educationLevels}
          specializations={specializations}
          employeeTypes={employeeTypes}
          isEdit={!!editEmployee}
          initialValues={editEmployee}
        />

        <Drawer
          title='Tiện ích nhân viên'
          width={1200}
          onClose={() => setIsDrawerOpen(false)}
          zIndex={1001}
          visible={isDrawerOpen}
          bodyStyle={{ paddingBottom: 20 }}
        >
          <Tabs activeKey={activeTab} onChange={key => setActiveTab(key)}>
            <TabPane tab="Chi tiết nhân viên" key="detail">
              <EmployeeDetailTab employeeId={selectedEmpId} />
            </TabPane>
            <TabPane tab="Hợp đồng" key="contracts">
              <EmployeeContractsTab employeeId={selectedEmpId} />
            </TabPane>
            <TabPane key="insurances" tab="Bảo hiểm">
              <EmployeeInsurancesTab employeeId={selectedEmpId} />
            </TabPane>
            <TabPane tab="Nghỉ phép" key="leaves">
              <EmployeeLeavesTab employeeId={selectedEmpId} />
              </TabPane>
            <TabPane tab="Đào tạo" key="trainings">
              <EmployeeTrainingsTab employeeId={selectedEmpId} />
            </TabPane>
            <TabPane tab="Khen thưởng" key="rewards">
              <EmployeeRewardsTab  employeeId={selectedEmpId} />
            </TabPane>
            <TabPane tab="Kỷ luật" key="discipline">
              <EmployeeKyLuatTab  employeeId={selectedEmpId} />
            </TabPane>
          </Tabs>
        </Drawer>

        <EmployeeDetailModal
          visible={isDetailModalOpen}
          onCancel={() => setIsDetailModalOpen(false)}
          employee={selectedEmployeeDetail}
        />
      </Content>
    </Layout>
  );
};

export default EmployeeListPage;