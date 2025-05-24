import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { useAuth } from '../../global/AuthenticationContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

import { adminRoutes, teacherRoutes } from '../../routers/Routes';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const { onLogout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Lấy routes theo role
  const roleRoutes = user?.role === 'teacher' ? teacherRoutes : adminRoutes;

  // Map path => key
  const pathToKeyMap = roleRoutes.reduce((acc, route) => {
    if (route.path) acc[route.path] = route.key;
    return acc;
  }, {});

  // Xác định menu đang được chọn dựa vào URL
  const selectedKey = pathToKeyMap[location.pathname] ?? 'dashboard';

  // Xử lý khi click vào menu
  const onMenuClick = ({ key }) => {
    if (key === 'logout') {
      onLogout();
    } else {
      const route = roleRoutes.find(r => r.key === key);
      if (route?.path) {
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
            {!collapsed ? (user?.role === 'teacher' ? 'Teacher Panel' : 'Admin Panel') : 'A'}
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={roleRoutes}
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
