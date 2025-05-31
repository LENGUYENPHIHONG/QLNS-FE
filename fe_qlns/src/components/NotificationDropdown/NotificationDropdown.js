// src/components/NotificationDropdown.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Badge,
  Dropdown,
  List,
  Avatar,
  Spin,
  Typography,
  Button,
  Divider,
  Space,
  message,
  Popconfirm,
} from "antd";
import {
  BellOutlined,
  ClockCircleOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  DeleteOutlined,
  DeleteTwoTone,  
} from "@ant-design/icons";
import { deleteNotification } from "../../api/thongBaoApi"; // import hàm xóa
const { Text, Paragraph } = Typography;

export default function NotificationDropdown() {
  const [unread, setUnread] = useState([]);
  const [allNoti, setAllNoti] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);

  // 1. Load unread
  const loadUnread = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ThongBao/unread`,
        { withCredentials: true }
      );
      setUnread(data.Items);
    } catch {
      message.error("Lấy thông báo chưa đọc thất bại");
    } finally {
      setLoading(false);
    }
  };

  // 2. Load all
  const loadAll = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/ThongBao`,
        { withCredentials: true }
      );
      setAllNoti(data);
    } catch {
      message.error("Lấy tất cả thông báo thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnread();
  }, []);

  // 3. Mark single as read
  const markRead = async (item) => {
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/ThongBao/${item.MaThongBao}/read`,
        null,
        { withCredentials: true }
      );
      setUnread((u) => u.filter((x) => x.MaThongBao !== item.MaThongBao));
      if (showAll) {
        setAllNoti((arr) =>
          arr.map((x) =>
            x.MaThongBao === item.MaThongBao ? { ...x, DaDoc: true } : x
          )
        );
      }
    } catch {
      message.error("Đánh dấu đã đọc thất bại");
    } finally {
      setLoading(false);
    }
  };

  // 4. Delete all read notifications
  const clearRead = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/ThongBao/read`,
        { withCredentials: true }
      );
      if (res.data?.DeletedCount > 0) {
        message.success(res.data.Message);
      }
    } catch {
      message.error("Xóa thông báo đã đọc thất bại");
    } finally {
      setAllNoti((a) => a.filter((x) => !x.DaDoc));
      setLoading(false);
    }
  };

  // 5. Toggle xem thêm
  const toggleShowAll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!showAll) await loadAll();
    setShowAll(!showAll);
    setOpen(true);
  };

  const dataSource = showAll ? allNoti : unread.slice(0, 5);
  const unreadCount = unread.length;
  const readCount = allNoti.filter((x) => x.DaDoc).length;

  const overlay = (
    <div
      style={{
        width: 360,
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          padding: 12,
        }}
      >
        <Text strong>{showAll ? "Tất cả thông báo" : "Thông báo mới"}</Text>
        <Space>
          {showAll && readCount > 0 && (
            <Button
              type="text"
              size="small"
              icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clearRead();
              }}
            >
              Xóa tất cả
            </Button>
          )}
          <Button
            type="text"
            size="small"
            icon={showAll ? <CaretUpOutlined /> : <CaretDownOutlined />}
            onClick={toggleShowAll}
          >
            {showAll ? "Thu gọn" : `Xem thêm (${unreadCount})`}
          </Button>
        </Space>
      </Space>
      <Divider style={{ margin: 0 }} />

      {loading ? (
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin />
        </div>
      ) : (
        <List
          dataSource={dataSource}
          locale={{ emptyText: "Không có thông báo" }}
          renderItem={(item) => (
            <List.Item
              style={{
                background: item.DaDoc ? "#fff" : "#e6f7ff",
                padding: "12px 16px",
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* Vùng click đánh dấu đã đọc */}
              <div
                style={{
                  flex: 1,
                  cursor: item.DaDoc ? "default" : "pointer",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!item.DaDoc) markRead(item);
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={<ClockCircleOutlined />}
                      style={{
                        background: item.DaDoc ? "#ccc" : "#1890ff",
                      }}
                    />
                  }
                  title={<Paragraph ellipsis={{ rows: 1 }}>{item.TieuDe}</Paragraph>}
                  description={
                    <>
                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 2 }}
                        style={{ margin: "4px 0" }}
                      >
                        {item.NoiDung}
                      </Paragraph>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {item.ThoiGianTao
                          ? new Date(item.ThoiGianTao).toLocaleString("vi-VN")
                          : ""}
                      </Text>
                    </>
                  }
                />
              </div>

              {/* Nút xóa cho từng thông báo đã đọc */}
              {item.DaDoc && (
                <Popconfirm
                  title="Xóa thông báo này?"
                  onConfirm={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      await deleteNotification(item.MaThongBao);
                      setAllNoti((a) =>
                        a.filter((x) => x.MaThongBao !== item.MaThongBao)
                      );
                      setUnread((u) =>
                        u.filter((x) => x.MaThongBao !== item.MaThongBao)
                      );
                      message.success("Xóa thành công");
                    } catch {
                      message.error("Xóa thất bại");
                    }
                  }}
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popconfirm>
              )}
            </List.Item>
          )}
          style={{ maxHeight: 400, overflowY: "auto" }}
        />
      )}
    </div>
  );

  return (
    <Dropdown
      overlay={overlay}
      trigger={["click"]}
      placement="bottomRight"
      open={open}
      onOpenChange={setOpen}
      overlayStyle={{ padding: 0 }}
    >
      <Badge count={unreadCount} overflowCount={99}>
        <BellOutlined style={{ fontSize: 20, cursor: "pointer", color: "#333" }} />
      </Badge>
    </Dropdown>
  );
}
