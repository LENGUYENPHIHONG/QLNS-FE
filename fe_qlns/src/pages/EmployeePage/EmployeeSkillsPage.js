// File: EmployeeSkillsPage.jsx
import React, { useEffect, useState } from 'react';
import { Form, Select, Button, Table, Popconfirm, message, Layout } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {
  fetchSkillTypes,
  getSkillTypeDetails,
  addSkillToEmployee,
  fetchAssignedSkills,
  deleteEmployeeSkill
} from '../../api/EmployeeSkillsApi';
import { toast } from 'react-toastify';
import { fetchEmployees } from "../../api/employeeApi";
const { Option } = Select;

export default function EmployeeSkillsPage() {
  const [form] = Form.useForm();
  const [employees, setEmployees] = useState([]);
  const [skillTypes, setSkillTypes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [levels, setLevels] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [selectedNV, setSelectedNV] = useState(null);

  useEffect(() => {
    async function loadInit() {
      try {
        const [empRes, typeRes] = await Promise.all([
          fetchEmployees(),
          fetchSkillTypes()
        ]);
        setEmployees(empRes.data.Data || []);
        setSkillTypes(typeRes.data.Data || []);
      } catch {
        toast.error('Lỗi tải danh sách');
      }
    }
    loadInit();
  }, []);

  useEffect(() => {
    if (selectedNV) {
      fetchAssignedSkills(selectedNV)
        .then(res => setAssigned(res.data.Data || []))
        .catch(() => message.error('Lỗi tải kỹ năng nhân viên'));
    } else {
      setAssigned([]);
    }
  }, [selectedNV]);

  const onTypeChange = async (maLKN) => {
    form.setFieldsValue({ MaKN: undefined, MaCD: undefined });
    try {
      const res = await getSkillTypeDetails(maLKN);
      setSkills(res.data.Data.DanhSachKyNang || []);
      setLevels(res.data.Data.DanhSachCapDo || []);
    } catch {
      toast.error('Lỗi tải chi tiết loại');
    }
  };

  const handleAdd = async () => {
    try {
      const { MaNV, LoaiKN, MaKN, MaCD } = await form.validateFields([
        'MaNV', 'LoaiKN', 'MaKN', 'MaCD'
      ]);
      await addSkillToEmployee({ MANV: MaNV, MAKN: MaKN, MACD: MaCD });
      toast.success('Thêm kỹ năng thành công');
      const res = await fetchAssignedSkills(MaNV);
      setAssigned(res.data.Data || []);
    } catch (err) {
      if (err.errorFields) return;
      toast.error('Lỗi thêm kỹ năng');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployeeSkill(id);
      setAssigned(prev => prev.filter(x => x.Id !== id));
      toast.success('Xóa thành công');
    } catch {
      toast.error('Lỗi xóa');
    }
  };

  const columns = [
    {
      title: 'Mã NV',
      dataIndex: 'MANV',
      key: 'MANV',
      render: () => selectedNV
    },
    {
      title: 'Tên NV',
      dataIndex: 'TENNV',
      key: 'TENNV',
      render: () => {
        const emp = employees.find(e => e.MANV === selectedNV);
        return emp ? emp.TENNV : '';
      }
    },
    { title: 'Kỹ năng', dataIndex: 'TenKyNang', key: 'TenKyNang' },
    { title: 'Cấp độ', dataIndex: 'TenCapDo', key: 'TenCapDo' },
    { title: 'Mức độ', dataIndex: 'MucDo', key: 'MucDo' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, rec) => (
        <Popconfirm title="Xóa?" onConfirm={() => handleDelete(rec.Id)}>
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      )
    }
  ];

  return (
    <Layout style={{ background: '#fff', padding: 24 }}>
      <Form form={form} layout="inline">
        <Form.Item name="MaNV" label="Nhân viên" rules={[{ required: true, message: 'Chọn nhân viên' }]}>  
          <Select
            placeholder="Chọn nhân viên"
            style={{ width: 200 }}
            onChange={val => setSelectedNV(val)}
          >
            {employees.map(e => (
              <Option key={e.MANV} value={e.MANV}>{e.TENNV}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="LoaiKN" label="Loại KN" rules={[{ required: true, message: 'Chọn loại kỹ năng' }]}>  
          <Select
            placeholder="Chọn loại"
            style={{ width: 200 }}
            onChange={onTypeChange}
          >
            {skillTypes.map(t => (
              <Option key={t.MALKN} value={t.MALKN}>{t.TENLKN}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="MaKN" label="Kỹ năng" rules={[{ required: true, message: 'Chọn kỹ năng' }]}>  
          <Select placeholder="Chọn kỹ năng" style={{ width: 200 }}>
            {skills.map(s => (
              <Option key={s.MAKN} value={s.MAKN}>{s.TENKN}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="MaCD" label="Cấp độ" rules={[{ required: true, message: 'Chọn cấp độ' }]}>  
          <Select placeholder="Chọn cấp độ" style={{ width: 200 }}>
            {levels.map(l => (
              <Option key={l.MACD} value={l.MACD}>{l.TENCD}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleAdd}>Thêm</Button>
        </Form.Item>
      </Form>
      <Table
        rowKey="Id"
        columns={columns}
        dataSource={assigned}
        style={{ marginTop: 16 }}
      />
    </Layout>
  );
}
