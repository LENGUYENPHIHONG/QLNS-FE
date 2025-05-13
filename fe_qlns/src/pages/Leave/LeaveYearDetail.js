import React, { useState, useEffect } from "react";
import { Layout, Form, Input, Button, DatePicker, Select, Table, Space, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { toast } from 'react-toastify';
// API
import { getYearDetails } from "../../api/yearDetailApi";

const { Content } = Layout;
const { Option } = Select;

const LeaveYearDetail = () => {
  const [form] = Form.useForm();
  const [rawData, setRawData] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDetails = async (year) => {
    setLoading(true);
    try {
      const res = await getYearDetails(year);
      if (res.data.Success) {
        const items = res.data.Data;
        setRawData(items);
        if (items.length > 0) {
          const types = items[0].ChiTietPhep.map(p => p.LoaiPhep);
          setLeaveTypes(types);
          setSelectedType(types[0]);
        }
      } else {
        toast.info(res.data.Message);
        setRawData([]);
        setLeaveTypes([]);
        setSelectedType(null);
      }
    } catch {
      toast.error("Không tải được dữ liệu chi tiết năm phép");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentYear = moment().year();
    form.setFieldsValue({ year: moment() });
    fetchDetails(currentYear);
  }, []);

  const onFinish = ({ year, leaveType }) => {
    const y = year ? year.year() : null;
    setSelectedType(leaveType);
    fetchDetails(y);
  };

  // prepare filtered and flattened data
  const displayData = rawData
    .map(item => {
      const p = item.ChiTietPhep.find(lp => lp.LoaiPhep === selectedType) || {};
      return {
        MaNhanVien: item.MaNhanVien,
        TenNhanVien: item.TenNhanVien,
        Nam: item.Nam,
        SoNgayPhep: p.SoNgayPhep || 0,
        SoNgayPhepSuDung: p.SoNgayPhepSuDung || 0,
        SoPhepConLai: p.SoPhepConLai || 0
      };
    })
    .filter(item =>
      item.MaNhanVien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.TenNhanVien.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const columns = [
    { title: "Mã NV", dataIndex: "MaNhanVien", key: "MaNhanVien" },
    { title: "Tên NV", dataIndex: "TenNhanVien", key: "TenNhanVien" },
    { title: "Năm", dataIndex: "Nam", key: "Nam" },
    { title: "Số ngày phép", dataIndex: "SoNgayPhep", key: "SoNgayPhep" },
    { title: "Đã sử dụng", dataIndex: "SoNgayPhepSuDung", key: "SoNgayPhepSuDung" },
    { title: "Còn lại", dataIndex: "SoPhepConLai", key: "SoPhepConLai" }
  ];

  return (
    <Layout style={{ background: '#fff', padding: 20 }}>
      <Content>
        <Form form={form} layout="inline" onFinish={onFinish} style={{ marginBottom: 16 }}>
          <Form.Item name="year" label="Chọn năm">
            <DatePicker picker="year" />
          </Form.Item>
          <Form.Item name="leaveType" label="Loại phép" rules={[{ required: true }] }>
            <Select style={{ width: 180 }} onChange={val => setSelectedType(val)} value={selectedType}>
              {leaveTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Lọc</Button>
          </Form.Item>
          <Form.Item>
            <Input
              placeholder="Tìm mã hoặc tên NV"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: 200 }}
            />
          </Form.Item>
        </Form>
        <Table
          columns={columns}
          dataSource={displayData}
          rowKey="MaNhanVien"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Content>
    </Layout>
  );
};

export default LeaveYearDetail;
