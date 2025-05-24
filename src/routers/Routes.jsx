import {
  DashboardOutlined,
  TeamOutlined,
  LogoutOutlined,
  ApartmentOutlined,
  BookOutlined,
  AppstoreOutlined,
  ScheduleOutlined
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
    key: 'room',
    path: '/room',
    label: 'Quản lý phòng học',
    icon: <AppstoreOutlined />,
  },
  {
    key: 'schedule',
    path: '/schedule',
    label: 'Quản lý lịch học',
    icon: <ScheduleOutlined />,
  },
  {
    key: 'logout',
    label: 'Đăng xuất',
    icon: <LogoutOutlined />,
  },
];

export const teacherRoutes = [
  {
    key: 'dashboard',
    path: '/',
    label: 'Dashboard',
    icon: <DashboardOutlined />,
  },
  {
    key: 'lesson',
    path: '/lesson',
    label: 'Lịch học',
    icon: <TeamOutlined />,
  },
  {
    key: 'logout',
    label: 'Đăng xuất',
    icon: <LogoutOutlined />,
  },
];
