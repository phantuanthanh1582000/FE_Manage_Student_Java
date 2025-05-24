import React, { useEffect, useState } from "react";
import {
  Table,
  Radio,
  Spin,
  Tag,
  Button,
  notification,
  Space,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllRoom, addRoom } from "../../services/api";

const { Option } = Select;

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await getAllRoom();
      setRooms(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng:", error);
      notification.error({
        message: "Lỗi",
        description: "Tải danh sách phòng thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleView = (room) => {
    notification.info({
      message: "Thông tin phòng",
      description: `Xem thông tin phòng: ${room.name}`,
    });
  };

  const handleEdit = (room) => {
    notification.success({
      message: "Chỉnh sửa phòng",
      description: `Chỉnh sửa phòng: ${room.name}`,
    });
  };

  const handleDelete = (room) => {
    if (window.confirm(`Xác nhận xoá phòng ${room.name}?`)) {
      notification.warning({
        message: "Xóa phòng",
        description: `Đã xoá phòng: ${room.name}`,
      });
      // TODO: Gọi API xoá phòng
    }
  };

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        try {
          const response = await addRoom(values);
          const newRoom = response.data;
          setRooms((prev) => [newRoom, ...prev]);

          notification.success({
            message: "Thêm phòng",
            description: `Đã thêm phòng: ${newRoom.name}`,
          });
          setIsModalOpen(false);
          form.resetFields();
        } catch (error) {
          console.error("Lỗi khi thêm phòng:", error);
          notification.error({
            message: "Lỗi",
            description: error.message,
          });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const columns = [
    {
      title: "",
      dataIndex: "radio",
      render: (_, record) => (
        <Radio
          checked={selectedRoomId === record.id}
          onChange={() => setSelectedRoomId(record.id)}
        />
      ),
    },
    {
      title: "STT",
      dataIndex: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Tên phòng",
      dataIndex: "name",
    },
    {
      title: "Loại phòng",
      dataIndex: "type",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const color = status === "ACTIVE" ? "green" : "volcano";
        const text = status === "ACTIVE" ? "Còn trống" : "Được sử dụng";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
          />
          <Button
            icon={<EditOutlined />}
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            size="small"
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý Phòng học</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={showModal}>
          + Thêm phòng học
        </Button>
      </Space>

      <Spin spinning={loading} tip="Đang tải danh sách phòng...">
        <Table
          dataSource={rooms}
          columns={columns}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: false,
          }}
        />
      </Spin>

      <Modal
        title="Thêm phòng học mới"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ type: "phòng học" }}
        >
          <Form.Item
            name="name"
            label="Tên phòng"
            rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
          >
            <Input placeholder="Ví dụ: A101" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại phòng"
            rules={[{ required: true, message: "Vui lòng chọn loại phòng!" }]}
          >
            <Select>
              <Option value="phòng học">phòng học</Option>
              <Option value="phòng lab">phòng lab</Option>
              <Option value="phòng họp">phòng họp</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomPage;
