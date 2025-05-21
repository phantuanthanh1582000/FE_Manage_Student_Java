import React from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  TeamOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  // Menu dropdown cho avatar (header)
  const dropdownMenuItems = [
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: () => {
        // Xử lý logout ở đây
        console.log('Logout clicked');
      },
    },
  ];

  // Menu sider
  const siderMenuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '2',
      icon: <TeamOutlined />,
      label: 'Quản lý sinh viên',
    },
    {
      key: '3',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        // Xử lý logout ở đây
        console.log('Logout clicked');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header nằm trên cùng, cố định */}
      <Header
        style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px #f0f1f2',
          zIndex: 1000,
          position: 'fixed',
          width: '100%',
          height: 64,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 'bold' }}>
          🎓 Hệ thống quản trị sinh viên
        </div>

        <Dropdown menu={{ items: dropdownMenuItems }} placement="bottomRight" trigger={['click']}>
          <div style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
          </div>
        </Dropdown>
      </Header>

      {/* Layout chính, cách header 64px */}
      <Layout style={{ marginTop: 64 }}>
        <Sider collapsible>
          <div
            className="logo"
            style={{
              color: 'white',
              padding: '16px',
              fontSize: '20px',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Admin Panel
          </div>

          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={siderMenuItems}
          />
        </Sider>

        <Content>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
