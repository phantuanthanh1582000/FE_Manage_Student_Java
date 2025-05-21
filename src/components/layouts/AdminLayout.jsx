import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useAuth } from '../../global/AuthenticationContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

import { adminRoutes } from '../../routers/Routes';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const { onLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const pathToKeyMap = adminRoutes.reduce((acc, route) => {
    if (route.path) acc[route.path] = route.key;
    return acc;
  }, {});

  const selectedKey = pathToKeyMap[location.pathname] ?? 'dashboard';

  // Xử lý click menu sider
  const onMenuClick = ({ key }) => {
    if (key === 'logout') {
      onLogout();
    } else {
      const route = adminRoutes.find(r => r.key === key);
      if (route && route.path) {
        navigate(route.path);
      }
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
      </Header>

      <Layout style={{ marginTop: 64 }}>
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div
            className="logo"
            style={{
              color: 'white',
              padding: '16px',
              fontSize: '20px',
              fontWeight: 'bold',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {!collapsed ? 'Admin Panel' : 'A'}
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={adminRoutes}
            onClick={onMenuClick}
          />
        </Sider>

        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
