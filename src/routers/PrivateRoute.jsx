import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../global/AuthenticationContext';
import { notification } from 'antd';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (isAuthenticated && (!user || user.role.toLowerCase() !== 'admin')) {
      notification.error({
        message: 'Truy cập bị từ chối',
        description: 'Bạn không có quyền truy cập vào trang này.',
        duration: 3,
      });
      setRedirect(true);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (redirect) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
