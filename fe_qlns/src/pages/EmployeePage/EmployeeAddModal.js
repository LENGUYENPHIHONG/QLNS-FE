import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  message
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getNewEmployeeCode } from "../../api/employeeApi";
import "./EmployeeAddModal.css";
import dayjs from "dayjs";
import { toast } from 'react-toastify';
const { Option } = Select;

const EmployeeAddModal = ({
  visible,
  onCancel,
  onFinish,
  form,
  fileList,
  onFileChange,
  loading,
  departments = [],
  positions = [],
  educationLevels = [],
  specializations = [],
  employeeTypes = [],
  isEdit = false,
  initialValues = null,
}) => {
  useEffect(() => {
    if (visible) {
      if (isEdit && initialValues) {
        form.setFieldsValue({
          ...initialValues,
          birthDate: initialValues.birthDate ? dayjs(initialValues.birthDate) : null,
          joinDate: initialValues.joinDate ? dayjs(initialValues.joinDate) : null
        });
      } else {
        form.resetFields();
        const fetchCode = async () => {
          try {
            const res = await getNewEmployeeCode();
            if (res.data?.code) {
              form.setFieldsValue({ id: res.data.code });
            }
          } catch {
            toast.error("Không thể lấy mã nhân viên");
          }
        };
        fetchCode();
      }
    }
  }, [visible, isEdit, initialValues]);


  // Chuyển file ảnh sang base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (values) => {
    let imageBase64 = "";
    const imageFile = fileList[0]?.originFileObj;

    if (imageFile) {
      try {
        imageBase64 = await toBase64(imageFile);
      } catch {
        toast.error("Không thể xử lý ảnh");
      }
    }

    const fullPayload = {
      ...values,
      IMAGEBASE64: imageBase64,
    };

    delete fullPayload.status; // loại bỏ nếu tồn tại

    onFinish(fullPayload);
  };

  return (
    <Modal
      title={isEdit ? "Cập nhật nhân viên" : "Thêm nhân viên"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={950}
      zIndex={2000}
      style={{ left: 70, top: 0 }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} className="compact-form">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "12px",
            rowGap: "6px",
          }}
        >
          <Form.Item name="id" label="Mã nhân viên" rules={[{ required: true }]}>
            <Input readOnly />
          </Form.Item>

          <Form.Item name="name" label="Tên nhân viên" rules={[{ required: true }]}>
            <Input placeholder="VD: Nguyễn Văn A" />
          </Form.Item>

          <Form.Item name="avatar" label="Ảnh 3x4">
            <Upload
              fileList={fileList}
              defaultFileList={fileList}
              onChange={onFileChange}
              beforeUpload={() => false}
              maxCount={1}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Chọn tệp</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="birthDate" label="Ngày sinh">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="gender" label="Giới tính">
            <Select placeholder="Giới tính">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </Form.Item>

          <Form.Item name="cccd" label="CCCD">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>

          <Form.Item name="nationality" label="Quốc tịch">
            <Input />
          </Form.Item>

          <Form.Item name="ethnicity" label="Dân tộc">
            <Input />
          </Form.Item>

          <Form.Item name="religion" label="Tôn giáo">
            <Input />
          </Form.Item>

          <Form.Item name="maritalStatus" label="Hôn nhân">
            <Select placeholder="Hôn nhân">
              <Option value="Độc thân">Độc thân</Option>
              <Option value="Đã kết hôn">Đã kết hôn</Option>
            </Select>
          </Form.Item>

          <Form.Item name="birthPlace" label="Nơi sinh">
            <Input.TextArea rows={1} />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input.TextArea rows={1} />
          </Form.Item>

          <Form.Item name="department" label="Phòng ban">
            <Select placeholder="Chọn phòng ban">
              {departments.map((d) => (
                <Option key={d.MAPB} value={d.MAPB}>
                  {d.TENPB}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="position" label="Chức vụ">
            <Select placeholder="Chọn chức vụ">
              {positions.map((p) => (
                <Option key={p.MACV} value={p.MACV}>
                  {p.TENCV}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="education" label="Trình độ">
            <Select placeholder="Chọn trình độ">
              {educationLevels.map((e) => (
                <Option key={e.MATD} value={e.MATD}>
                  {e.TENTD}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="specialization" label="Chuyên môn">
            <Select placeholder="Chọn chuyên môn">
              {specializations.map((s) => (
                <Option key={s.MACM} value={s.MACM}>
                  {s.TENCM}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="employeeType" label="Loại nhân viên">
            <Select placeholder="Chọn loại nhân viên">
              {employeeTypes.map((t) => (
                <Option key={t.MALNV} value={t.MALNV}>
                  {t.TENLNV}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="joinDate" label="Ngày vào làm">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
        </div>

        <Form.Item style={{ textAlign: "right", marginTop: "16px" }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? "Cập nhật" : "Thêm"}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onCancel}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeAddModal;
