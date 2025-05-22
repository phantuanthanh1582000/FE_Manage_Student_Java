import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Dropdown,
  Modal,
  Input,
  notification,
  Radio,
  Form,
} from 'antd';
import {
  getAllMajors,
  getClassById,
  addClass,
  updateMajor,
  deleteMajor,
  updateClass
} from '../../services/api';
import dayjs from 'dayjs';

const MajorManagement = () => {
  const [data, setData] = useState([]);

  const [classDetails, setClassDetails] = useState({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedMajorId, setSelectedMajorId] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingMajor, setEditingMajor] = useState(null);

  const [isClassModalVisible, setIsClassModalVisible] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedClassName, setSelectedClassName] = useState('');

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editClassForm] = Form.useForm();

  useEffect(() => {
    fetchMajors();
  }, []);

  useEffect(() => {
    if (isModalVisible) form.resetFields();
  }, [isModalVisible, form]);

  useEffect(() => {
    if (isEditModalVisible && editingMajor) {
      editForm.setFieldsValue({
        name: editingMajor.name,
        majorCode: editingMajor.majorCode,
      });
    }
  }, [isEditModalVisible, editingMajor, editForm]);

  useEffect(() => {
    if (isEditModalVisible && editingMajor) {
      editForm.setFieldsValue({
        name: editingMajor.name,
        majorCode: editingMajor.majorCode,
      });
    }
  }, [isEditModalVisible, editingMajor, editForm]);

  useEffect(() => {
    if (selectedClassId) {
      const classInfo = classDetails[selectedClassId];
      form.setFieldsValue({
        className: classInfo?.className || '',
        createdAt: classInfo?.createdAt
          ? dayjs(classInfo.createdAt).format('DD/MM/YYYY')
          : '',
        isDeleted: classInfo?.delete ? 'Tạm khóa' : 'Hoạt động',
      });
    }
  }, [selectedClassId, classDetails, editClassForm]);

  const fetchMajors = async () => {
    try {
      const res = await getAllMajors();
      setData(res.data);

      const allClassIds = res.data.flatMap((major) => major.classIds || []);
      const uniqueClassIds = [...new Set(allClassIds)];

      const classes = await Promise.all(
        uniqueClassIds.map(async (id) => {
          try {
            const res = await getClassById(id);
            return { id, ...res.data };
          } catch {
            return { id, className: 'Không tìm thấy' };
          }
        })
      );

      const classMap = {};
      classes.forEach((cls) => {
        classMap[cls.id] = cls;
      });

      setClassDetails(classMap);
    } catch (error) {
      console.error('Lỗi lấy danh sách ngành hoặc lớp:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách ngành hoặc lớp học.',
      });
    }
  };

  const handleAddClassClick = () => {
    if (!selectedMajorId) {
      notification.warning({
        message: 'Cảnh báo',
        description: 'Vui lòng chọn ngành trước khi thêm lớp học.',
      });
      return;
    }
    setIsModalVisible(true);
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedData = {
          className: values.className,
        };

        updateClass(selectedClassId, selectedMajorId, updatedData)
          .then((res) => {
            console.log('Cập nhật thành công:', res.data);
            notification.success({
              message: 'Thành công',
              description: 'Cập nhật lớp học thành công!',
              placement: 'topRight',
            });
            setIsClassModalVisible(false);
            fetchMajors()
          })
          .catch((err) => {
            console.error('Cập nhật thất bại:', err);
            notification.error({
              message: 'Lỗi',
              description: err.message,
              placement: 'topRight',
            });
          });
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      }
    );
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        if (!selectedMajorId) {
          notification.warning({
            message: 'Cảnh báo',
            description: 'Vui lòng chọn ngành trước khi thêm lớp học.',
          });
          return;
        }
        try {
          await addClass(selectedMajorId, { className: values.className });
          notification.success({
            message: 'Thành công',
            description: `Đã thêm lớp học: ${values.className}`,
          });
          setIsModalVisible(false);
          fetchMajors();
        } catch (error) {
          console.error('Lỗi khi thêm lớp học:', error);
          notification.error({
            message: 'Lỗi',
            description: error.message || 'Có lỗi xảy ra khi thêm lớp học.',
          });
        }
      })
      .catch((errorInfo) => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  const handleEditClick = (major) => {
    setEditingMajor(major);
    setIsEditModalVisible(true);
  };

  const handleEditModalOk = () => {
    editForm
      .validateFields()
      .then(async (values) => {
        try {
          await updateMajor(editingMajor.id, {
            name: values.name,
            majorCode: values.majorCode,
          });

          notification.success({
            message: 'Thành công',
            description: `Đã cập nhật ngành học: ${values.name}`,
          });

          setIsEditModalVisible(false);
          setEditingMajor(null);
          fetchMajors();
        } catch (error) {
          console.error('Lỗi cập nhật ngành học:', error);
          notification.error({
            message: 'Lỗi',
            description:
              error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật ngành học.',
          });
        }
      })
      .catch((errorInfo) => {
        console.log('Validate Failed:', errorInfo);
      });
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc muốn xóa ngành "${record.name}" không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteMajor(record.id);
          notification.success({
            message: 'Thành công',
            description: `Đã xóa ngành: ${record.name}`,
          });
          fetchMajors();
        } catch (error) {
          console.error('Lỗi khi xóa ngành:', error);
          notification.error({
            message: 'Lỗi',
            description: error.response?.data?.message || 'Có lỗi xảy ra khi xóa ngành.',
          });
        }
      },
    });
  };

  const handleClassClick = (classId, majorId) => {
    setSelectedClassId(classId);
    setSelectedMajorId(majorId);
    setSelectedClassName(classDetails[classId]?.className || 'Không có tên lớp');
    setIsClassModalVisible(true);
  };

  const columns = [
    {
      title: '',
      key: 'radio',
      render: (_, record) => (
        <Radio
          checked={selectedMajorId === record.id}
          onChange={() => setSelectedMajorId(record.id)}
        />
      ),
      width: 50,
    },
    {
      title: 'STT',
      key: 'index',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 70,
    },
    {
      title: 'Tên ngành',
      dataIndex: 'name',
      key: 'name',
      width: 220,
    },
    {
      title: 'Mã ngành',
      dataIndex: 'majorCode',
      key: 'majorCode',
      width: 220,
    },
    {
  title: 'Danh sách lớp',
  dataIndex: 'classIds',
  key: 'classIds',
  render: (classIds, record) => {  
    if (!classIds || classIds.length === 0) {
      return <Tag color="default">Không có lớp</Tag>;
    }

    if (classIds.length === 1) {
      const classId = classIds[0];
      return (
        <Tag
          color="blue"
          key={classId}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            handleClassClick(classId, record.id);  
          }}
        >
          {classDetails[classId]?.className || classId}
        </Tag>
      );
    }

    const menuItems = classIds.map((id) => ({
      key: id,
      label: (
        <span
          onClick={() => handleClassClick(id, record.id)}
          style={{ cursor: 'pointer' }}
        >
          {classDetails[id]?.className || id}
        </span>
      ),
    }));

    return (
      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomLeft"
        trigger={['click']}
      >
        <Tag color="blue" style={{ cursor: 'pointer' }}>
          {`${classIds.length} lớp học ▼`}
        </Tag>
      </Dropdown>
    );
  },
  width: 200,
},
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      width: 200,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'delete',
      key: 'status',
      render: (deleted) => (
        <Tag color={deleted ? 'red' : 'green'}>
          {deleted ? 'Tạm khóa' : 'Hoạt động'}
        </Tag>
      ),
      width: 120,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEditClick(record)}>
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </Space>
      ),
      width: 150,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Danh sách ngành học</h2>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAddClassClick}>
          + Thêm lớp học
        </Button>
      </Space>
      <Table
        rowKey={(record) => record._id || record.id || record.majorCode}
        columns={columns}
        dataSource={data}
        pagination={{
          current: currentPage,
          pageSize,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          showSizeChanger: false,
        }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={`Cập nhật lớp: ${selectedClassName}`}
        open={isClassModalVisible}
        onCancel={() => setIsClassModalVisible(false)}
        onOk={handleUpdate}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        {selectedClassId ? (
          <Form form={form} layout="vertical">
            <Form.Item
              label="Tên lớp"
              name="className"
              rules={[{ required: true, message: 'Vui lòng nhập tên lớp!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Ngày tạo"
              name="createdAt"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="Trạng thái"
              name="isDeleted"
            >
              <Input disabled />
            </Form.Item>
          </Form>
        ) : (
          <p>Không có thông tin lớp học.</p>
        )}
      </Modal>

      {/* Modal Thêm Lớp */}
      <Modal
        title="Thêm lớp học"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" name="add-class-form">
          <Form.Item
            name="className"
            label="Tên lớp học"
            rules={[{ required: true, message: 'Vui lòng nhập tên lớp học!' }]}
          >
            <Input placeholder="Nhập tên lớp học" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Sửa ngành học */}
      <Modal
        title="Sửa ngành học"
        open={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={editForm} layout="vertical" name="edit-major-form">
          <Form.Item
            name="name"
            label="Tên ngành"
            rules={[{ required: true, message: 'Vui lòng nhập tên ngành!' }]}
          >
            <Input placeholder="Tên ngành" />
          </Form.Item>
          <Form.Item
            name="majorCode"
            label="Mã ngành"
            rules={[{ required: true, message: 'Vui lòng nhập mã ngành!' }]}
          >
            <Input placeholder="Mã ngành" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MajorManagement;
