import {
  DashboardOutlined,
  TeamOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

export const adminRoutes = [
  {
    key: 'dashboard',
    path: '/',
    label: 'Dashboard',
    icon: <DashboardOutlined />,
  },
  {
    key: 'department',
    path: '/department',
    label: 'Quản lý khoa',
    icon: <TeamOutlined />,
  },
  {
    key: 'logout',
    label: 'Đăng xuất',
    icon: <LogoutOutlined />,
  },
];
