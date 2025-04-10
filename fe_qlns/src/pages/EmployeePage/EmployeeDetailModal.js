// src/components/Employee/EmployeeDetailModal.js
import React from "react";
import { Modal, Descriptions, Image } from "antd";

const EmployeeDetailModal = ({ visible, onCancel, data }) => {
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      title="Chi tiết nhân viên"
      width={700}
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="Mã NV">{data?.MANV}</Descriptions.Item>
        <Descriptions.Item label="Tên NV">{data?.TENNV}</Descriptions.Item>
        <Descriptions.Item label="SĐT">{data?.SODIENTHOAI}</Descriptions.Item>
        <Descriptions.Item label="CCCD">{data?.CCCD}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">{data?.NGAYSINH}</Descriptions.Item>
        <Descriptions.Item label="Giới tính">{data?.GIOITINH}</Descriptions.Item>
        <Descriptions.Item label="Trình độ">{data?.TrinhDo?.TENTD}</Descriptions.Item>
        <Descriptions.Item label="Chuyên môn">{data?.ChuyenMon?.TENCM}</Descriptions.Item>
        <Descriptions.Item label="Loại nhân viên">{data?.LoaiNhanVien?.TENLNV}</Descriptions.Item>
        <Descriptions.Item label="Tôn giáo">{data?.TONGIAO}</Descriptions.Item>
        <Descriptions.Item label="Hôn nhân">{data?.HONNHAN}</Descriptions.Item>
        <Descriptions.Item label="Nơi sinh">{data?.NOISINH}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{data?.DIACHI}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{data?.TRANGTHAI}</Descriptions.Item>
        <Descriptions.Item label="Phòng ban">{data?.PhongBanStr}</Descriptions.Item>
        <Descriptions.Item label="Chức vụ">{data?.ChucVuStr}</Descriptions.Item>
        <Descriptions.Item label="Ngày vào làm">{data?.NGAYVAOLAM}</Descriptions.Item>
        <Descriptions.Item label="Hợp đồng">{data?.HopDongTENLHD}</Descriptions.Item>
        <Descriptions.Item label="Ảnh">
          {data?.ANH ? (
            <Image src={data?.ANH} width={100} />
          ) : (
            "Không có ảnh"
          )}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default EmployeeDetailModal;
