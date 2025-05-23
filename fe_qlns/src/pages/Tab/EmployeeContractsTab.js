// File: src/pages/EmployeePage/EmployeeContractsTab.js
import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Tag } from "antd";
import { fetchContracts, renewContracts } from "../../api/contractApi";
import dayjs from "dayjs";

const EmployeeContractsTab = ({ employeeId }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renewing, setRenewing] = useState({});

  useEffect(() => {
    if (employeeId) loadContracts();
  }, [employeeId]);

  const loadContracts = async () => {
    setLoading(true);
    try {
      const res = await fetchContracts({ manv: employeeId });
      setContracts(res.data?.Data || []);
    } catch (err) {
      message.error("Lỗi khi tải hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (contractId) => {
    setRenewing(prev => ({ ...prev, [contractId]: true }));
    try {
      await renewContracts([contractId]);
      message.success("Gia hạn hợp đồng thành công");
      loadContracts();
    } catch (err) {
      message.error("Gia hạn thất bại");
    } finally {
      setRenewing(prev => ({ ...prev, [contractId]: false }));
    }
  };

  const columns = [
    {
      title: 'Mã hợp đồng',
      key: 'code',
      render: (_, record) => record.MAHOPDONG || record.MAHD || record.Id || '-'  
    },
    {
      title: 'Tên hợp đồng',
      key: 'name',
      render: (_, record) => record.TENHOPDONG || record.TENLHD || '-'  
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'NGAYBATDAU',
      key: 'start',
      render: date => date ? dayjs(date).format('YYYY-MM-DD') : '-'  
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'NGAYKETTHUC',
      key: 'end',
      render: date => date ? dayjs(date).format('YYYY-MM-DD') : '-'  
    },
    {
      title: 'File',
      key: 'file',
      render: (_, record) => record.ANH
        ? <a href={`${record.ANH}`} target="_blank" rel="noopener noreferrer">PDF</a>
        : '-'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'TRANGTHAI',
      key: 'status',
      render: st => {
        let color = 'default';
        if (st === 'Chờ phê duyệt') color = 'orange';
        else if (st === 'Đang hiệu lực') color = 'green';
        else if (st === 'Sắp hết hiệu lực') color = 'gold';
        else if (st === 'Hết hiệu lực') color = 'red';
        return <Tag color={color}>{st || '-'}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc muốn gia hạn?"
          onConfirm={() => handleRenew(record.ID)}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <Button type="link" loading={renewing[record.ID]}>Gia hạn</Button>
        </Popconfirm>
      )
    }
  ];

  return (
    <Table
      dataSource={contracts}
      columns={columns}
      rowKey="ID"
      loading={loading}
      pagination={false}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default EmployeeContractsTab;
