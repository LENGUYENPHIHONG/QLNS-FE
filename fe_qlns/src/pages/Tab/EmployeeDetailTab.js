// File: src/pages/EmployeePage/EmployeeDetailTab.js
import React, { useEffect, useState } from "react";
import { Descriptions, Image, Spin, message, Row, Col } from "antd";
import { getEmployeeDetail } from "../../api/employeeApi";
import { toast } from 'react-toastify';
//const API_URL = process.env.REACT_APP_API_URL;

const EmployeeDetailTab = ({ employeeId }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employeeId) loadDetail();
  }, [employeeId]);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const res = await getEmployeeDetail(employeeId);
      if (res.data?.Success) setEmployee(res.data.Data);
      else toast.error("Không tải được chi tiết nhân viên");
      console.log("Employee Detail:", res);
    } catch {
      toast.error("Lỗi khi gọi API chi tiết");
    } finally {
      setLoading(false);
    }
    
  };

  if (loading) return <Spin />;
  if (!employee) return <p>Chưa chọn nhân viên</p>;

  return (
    <Row gutter={24} style={{ padding: 16 }}>
      <Col span={6}>
        {employee.ANH
          ? <Image
              src={employee.ANH.replace(/^http:\/\//, 'https://')}
              width={200}
              height={240}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
          : <div style={{ width:200, height:240, background:'#f0f0f0', borderRadius:8 }} />
        }
      </Col>
      <Col span={18}>
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="Mã nhân viên">{employee.MANV}</Descriptions.Item>
          <Descriptions.Item label="Tên nhân viên">{employee.TENNV}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{employee.SODIENTHOAI}</Descriptions.Item>
          <Descriptions.Item label="CCCD">{employee.CCCD}</Descriptions.Item>
          <Descriptions.Item label="Ngày vào làm">{employee.NGAYVAOLAM?.split('T')[0]}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{employee.TRANGTHAI}</Descriptions.Item>
          <Descriptions.Item label="Trình độ">{employee.TrinhDo?.TENTD}</Descriptions.Item>
          <Descriptions.Item label="Chuyên môn">{employee.ChuyenMon?.TENCM}</Descriptions.Item>
          <Descriptions.Item label="Loại nhân viên">{employee.LoaiNhanVien?.TENLNV}</Descriptions.Item>
          <Descriptions.Item label="Phòng ban">{employee.PhongBanStr}</Descriptions.Item>
          <Descriptions.Item label="Chức vụ">{employee.ChucVuStr}</Descriptions.Item>
          <Descriptions.Item label="Loại hợp đồng">{employee.HopDongTENLHD}</Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
  );
};

export default EmployeeDetailTab;