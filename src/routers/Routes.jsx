import {
  DashboardOutlined,
  TeamOutlined,
  LogoutOutlined,
  ApartmentOutlined,
  BookOutlined
} from '@ant-design/icons';

export const adminRoutes = [
  {
    key: 'dashboard',
    path: '/',
    label: 'dashboard',
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
    key: 'subject',
    path: '/subject',
    label: 'Quản lý môn học',
    icon: <BookOutlined />,
  },
  {
    key: 'logout',
    label: 'Đăng xuất',
    icon: <LogoutOutlined />,
  },
];
