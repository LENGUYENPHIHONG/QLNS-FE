// src/components/Employee/EmployeeDetailModal.js
import React from "react";
import { Modal, Row, Col, Image } from "antd";

const EmployeeDetailModal = ({ visible, onCancel, employee }) => {
  if (!employee) return null;

  return (
    <Modal open={visible} onCancel={onCancel} footer={null} width={800} zIndex={2000} title="Thông tin nhân viên">
      <Row gutter={44}>
        <Col span={6}>
          <Image
            src={employee.ANH}
            width={160}
            height={200}
            alt="Ảnh nhân viên"
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        </Col>
        <Col span={9}>
          <p><strong>Mã nhân viên:</strong> {employee.MANV}</p>
          <p><strong>Tên nhân viên:</strong> {employee.TENNV}</p>
          <p><strong>Số điện thoại:</strong> {employee.SODIENTHOAI}</p>
          <p><strong>CCCD:</strong> {employee.CCCD}</p>
          <p><strong>Ngày vào làm:</strong> {employee.NGAYVAOLAM?.split("T")[0]}</p>
          <p><strong>Trạng thái:</strong> {employee.TRANGTHAI}</p>
        </Col>
        <Col span={9}>
          <p><strong>Trình độ:</strong> {employee.TrinhDo?.TENTD}</p>
          <p><strong>Chuyên môn:</strong> {employee.ChuyenMon?.TENCM}</p>
          <p><strong>Loại nhân viên:</strong> {employee.LoaiNhanVien?.TENLNV}</p>
          <p><strong>Phòng ban:</strong> {employee.PhongBanStr}</p>
          <p><strong>Chức vụ:</strong> {employee.ChucVuStr}</p>
          <p><strong>Loại hợp đồng:</strong> {employee.HopDongTENLHD}</p>
        </Col>
      </Row>
    </Modal>
  );
};

export default EmployeeDetailModal;
