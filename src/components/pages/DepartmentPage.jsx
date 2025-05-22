import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  message,
  Tag,
  Dropdown,
  Modal,
  Form,
  Input,
  notification,
  Radio
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  getAllDepartment,
  getMajorById,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  addMajor 
} from '../../services/api';
import dayjs from 'dayjs';

const { confirm } = Modal;

const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [majorMap, setMajorMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMajorModalVisible, setIsMajorModalVisible] = useState(false); // ➕ Modal ngành
  const [form] = Form.useForm();
  const [majorForm] = Form.useForm(); // ➕ Form ngành

  const [editingDepartment, setEditingDepartment] = useState(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

  const fetchMajorNames = async (departments) => {
    const allMajorIds = [...new Set(departments.flatMap((dep) => dep.majorIds))];
    const majorNameMap = {};

    await Promise.all(
      allMajorIds.map(async (id) => {
        try {
          const res = await getMajorById(id);
          majorNameMap[id] = res.data.name;
        } catch {
          majorNameMap[id] = 'Không rõ';
        }
      })
    );

    setMajorMap(majorNameMap);
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await getAllDepartment();
      setDepartments(response.data);
      await fetchMajorNames(response.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách khoa!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const renderMajorDropdown = (majorIds) => {
    if (!majorIds || majorIds.length === 0) {
      return <Tag color="default">Không có</Tag>;
    }
    if (majorIds.length === 1) {
      return <Tag>{majorMap[majorIds[0]] || 'Đang tải...'}</Tag>;
    }

    const menu = {
      items: majorIds.map((id) => ({
        key: id,
        label: majorMap[id] || 'Đang tải...',
      })),
    };

    return (
      <Dropdown menu={menu} trigger={['click']}>
        <Tag color="blue" style={{ cursor: 'pointer' }}>
          {majorIds.length} ngành học ▼
        </Tag>
      </Dropdown>
    );
  };

  const onDeleteDepartment = (department) => {
    confirm({
      title: `Bạn có chắc chắn muốn xóa khoa "${department.name}" không?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          const res = await deleteDepartment(department.id);
          if (res.code === 1) {
            notification.success({
              message: 'Thành công',
              description: res.message || `Khoa "${department.name}" đã được xóa.`,
              placement: 'topRight',
              duration: 3,
            });
            fetchDepartments();
          } else {
            notification.error({
              message: 'Lỗi',
              description: res.message || 'Có lỗi xảy ra khi xóa khoa.',
              placement: 'topRight',
              duration: 3,
            });
          }
        } catch (error) {
          notification.error({
            message: 'Lỗi',
            description: 'Có lỗi khi gọi API xóa khoa.',
            placement: 'topRight',
            duration: 3,
          });
        }
      },
    });
  };

  const columns = [
    {
      title: '',
      key: 'radio',
      render: (_, record) => (
        <Radio
          checked={selectedDepartmentId === record.id}
          onChange={() => setSelectedDepartmentId(record.id)}
        />
      ),
      width: 50,
    },
    {
      title: 'STT',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Tên Khoa',
      dataIndex: 'name',
    },
    {
      title: 'Mã Khoa',
      dataIndex: 'departmentCode',
    },
    {
      title: 'Ngành học',
      dataIndex: 'majorIds',
      render: renderMajorDropdown,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'deleted',
      render: (deleted) =>
        deleted ? <Tag color="red">Đã xóa</Tag> : <Tag color="green">Hoạt động</Tag>,
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => onEditDepartment(record)}>
            Chỉnh sửa
          </Button>
          <Button danger onClick={() => onDeleteDepartment(record)}>
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  const onEditDepartment = (department) => {
    setEditingDepartment(department);
    form.setFieldsValue({
      name: department.name,
      departmentCode: department.departmentCode,
    });
    setIsModalVisible(true);
  };

  const showModal = () => {
    setEditingDepartment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingDepartment(null);
  };

  const handleSaveDepartment = async () => {
    try {
      const values = await form.validateFields();

      if (editingDepartment) {
        const res = await updateDepartment(editingDepartment.id, values);
        if (res.code === 1) {
          notification.success({
            message: 'Thành công',
            description: res.message || `Khoa "${values.name}" đã được cập nhật.`,
            placement: 'topRight',
            duration: 3,
          });
          fetchDepartments();
          handleCancel();
        } else {
          notification.error({
            message: 'Lỗi',
            description: res.message || 'Có lỗi xảy ra khi cập nhật khoa.',
            placement: 'topRight',
            duration: 3,
          });
        }
      } else {
        const res = await addDepartment(values);
        if (res.code === 1) {
          notification.success({
            message: 'Thành công',
            description: res.message || `Khoa "${values.name}" đã được thêm vào hệ thống.`,
            placement: 'topRight',
            duration: 3,
          });
          fetchDepartments();
          handleCancel();
        } else {
          notification.error({
            message: 'Lỗi',
            description: res.message || 'Có lỗi xảy ra khi thêm khoa.',
            placement: 'topRight',
            duration: 3,
          });
        }
      }
    } catch (errorInfo) {
      notification.error({
        message: 'Lỗi',
        description: errorInfo.message || 'Vui lòng kiểm tra lại thông tin nhập.',
        placement: 'topRight',
        duration: 3,
      });
    }
  };

  const handleAddMajor = () => {
    if (!selectedDepartmentId) {
      return message.warning('Vui lòng chọn một khoa trước khi thêm ngành!');
    }
    majorForm.resetFields();
    setIsMajorModalVisible(true);
  };

  const handleCancelMajor = () => {
    setIsMajorModalVisible(false);
    majorForm.resetFields();
  };

  const handleSaveMajor = async () => {
    try {
      const values = await majorForm.validateFields();
      console.log(values)
      const res = await addMajor(selectedDepartmentId, values);
      if (res.code === 1) {
        notification.success({
          message: 'Thành công',
          description: res.message || `Ngành "${values.name}" đã được thêm.`,
        });
        fetchDepartments();
        handleCancelMajor();
      } else {
        notification.error({
          message: 'Lỗi',
          description: res.message || 'Không thể thêm ngành.',
        });
      }
    } catch (err) {
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin ngành!',
      });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Danh sách Khoa</h2>

      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={showModal}>
          + Thêm Khoa
        </Button>
        <Button type="primary" onClick={handleAddMajor}>
          + Thêm Ngành
        </Button>
      </Space>

      {/* Modal thêm/sửa Khoa */}
      <Modal
        title={editingDepartment ? 'Chỉnh sửa Khoa' : 'Thêm Khoa mới'}
        open={isModalVisible}
        onOk={handleSaveDepartment}
        onCancel={handleCancel}
        okText={editingDepartment ? 'Lưu' : 'Thêm'}
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên Khoa" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="departmentCode" label="Mã Khoa" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm Ngành */}
      <Modal
        title="Thêm Ngành học mới"
        open={isMajorModalVisible}
        onOk={handleSaveMajor}
        onCancel={handleCancelMajor}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={majorForm} layout="vertical">
          <Form.Item name="name" label="Tên Ngành" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="majorCode" label="Mã Ngành" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={departments}
        loading={loading}
        bordered
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
    </div>
  );
};

export default DepartmentPage;
