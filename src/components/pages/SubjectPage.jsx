import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Space, Modal, Form, Input, notification, Select } from "antd";
import { getAllSubjects, getAllMajors, addSubject } from "../../services/api";
import dayjs from "dayjs";

const SubjectPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();

  const fetchSubjects = async () => {
    try {
      const res = await getAllSubjects();
      setSubjects(res.data);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMajors = async () => {
    try {
      const res = await getAllMajors();
      setMajors(res.data);
    } catch (error) {
      console.error("Failed to fetch majors", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchMajors();
  }, []);

  const handleView = (record) => {
    console.log("View subject id:", record.id);
  };

  const handleEdit = (record) => {
    console.log("Edit subject id:", record.id);
  };

  const handleDelete = (record) => {
    console.log("Delete subject id:", record.id);
  };

  const showModal = () => {
    form.resetFields(); 
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  
  const handleModalOk = () => {
    form
        .validateFields()
        .then(async (values) => {
        const { majorId, ...subjectData } = values;
        try {
            await addSubject(majorId, subjectData);
            notification.success({
            message: "Thành công",
            description: "Thêm môn học thành công",
            placement: "topRight",
            });
            setIsModalVisible(false);
            fetchSubjects(); 
        } catch (error) {
            notification.error({
            message: "Lỗi",
            description: error.message,
            placement: "topRight",
            });
            console.error(error);
        }
        })
        .catch((info) => {
        console.log("Validate failed:", info);
        });
    };

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 80,
    },
    {
      title: "Tên môn học",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mã môn",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "delete",
      key: "delete",
      render: (value) =>
        value ? (
          <Tag color="red">Đã xóa</Tag>
        ) : (
          <Tag color="green">Hoạt động</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleView(record)}>
            Xem
          </Button>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Danh sách môn học</h2>

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={showModal}>
          + Thêm môn học
        </Button>
      </Space>

      <Table
        dataSource={subjects}
        columns={columns}
        rowKey="id"
        loading={loading}
        rowSelection={{
          type: "radio",
          selectedRowKeys: selectedRowKey ? [selectedRowKey] : [],
          onChange: (selectedKeys) => setSelectedRowKey(selectedKeys[0]),
        }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showSizeChanger: false,
        }}
      />

      <Modal
        title="Thêm môn học"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          name="add_subject_form"
          initialValues={{ name: "", code: "" }}
        >
          <Form.Item
            name="name"
            label="Tên môn học"
            rules={[{ required: true, message: "Vui lòng nhập tên môn học" }]}
          >
            <Input placeholder="Nhập tên môn học" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Mã môn"
            rules={[{ required: true, message: "Vui lòng nhập mã môn" }]}
          >
            <Input placeholder="Nhập mã môn" />
          </Form.Item>
          <Form.Item
            name="majorId"
            label="Chọn ngành học"
            rules={[{ required: true, message: "Vui lòng chọn ngành học" }]}
          >
            <Select placeholder="Chọn ngành học" allowClear>
              {majors.map((major) => (
                <Select.Option key={major.id} value={major.id}>
                  {major.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubjectPage;
