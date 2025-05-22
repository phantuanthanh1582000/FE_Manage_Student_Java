import {
  DashboardOutlined,
  TeamOutlined,
  LogoutOutlined,
  ApartmentOutlined,
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
    icon: <ApartmentOutlined />,
  },
  {
    key: 'major',
    path: '/major',
    label: 'Quản lý ngành học',
    icon: <TeamOutlined />,
  },
  {
    key: 'logout',
    label: 'Đăng xuất',
    icon: <LogoutOutlined />,
  },
];
