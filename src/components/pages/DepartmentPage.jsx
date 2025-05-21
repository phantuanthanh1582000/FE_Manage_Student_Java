import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Tag, Dropdown, Menu } from 'antd';
import { getAllDepartment, getMajorById } from '../../services/api';
import dayjs from 'dayjs';

const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [majorMap, setMajorMap] = useState({});

  const fetchMajorNames = async (departments) => {
    const allMajorIds = [...new Set(departments.flatMap(dep => dep.majorIds))];
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

    const menu = (
      <Menu>
        {majorIds.map((id) => (
          <Menu.Item key={id}>
            {majorMap[id] || 'Đang tải...'}
          </Menu.Item>
        ))}
      </Menu>
    );

    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <Tag color="blue" style={{ cursor: 'pointer' }}>
          {majorIds.length} ngành học ▼
        </Tag>
      </Dropdown>
    );
  };

  const columns = [
    {
      title: 'Tên Khoa',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mã Khoa',
      dataIndex: 'departmentCode',
      key: 'departmentCode',
    },
    {
      title: 'Ngành học',
      dataIndex: 'majorIds',
      key: 'majorIds',
      render: renderMajorDropdown,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'deleted',
      key: 'deleted',
      render: (deleted) =>
        deleted ? (
          <Tag color="red">Đã xóa</Tag>
        ) : (
          <Tag color="green">Hoạt động</Tag>
        ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => message.info(`Chỉnh sửa khoa ID: ${record.id}`)}>
            Chỉnh sửa
          </Button>
          <Button danger onClick={() => message.info(`Xoá khoa ID: ${record.id}`)}>
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Danh sách Khoa</h2>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => message.info('Thêm khoa')}>
        + Thêm Khoa
      </Button>
      <Table rowKey="id" columns={columns} dataSource={departments} loading={loading} bordered />
    </div>
  );
};

export default DepartmentPage;
