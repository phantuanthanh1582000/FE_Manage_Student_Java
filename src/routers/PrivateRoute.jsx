import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../global/AuthenticationContext';
import { notification, Spin } from 'antd';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const [redirect, setRedirect] = useState(false);

  // useEffect(() => {
  //   if (!loading && isAuthenticated && user?.role.toLowerCase() !== 'admin') {
  //     notification.error({
  //       message: 'Truy cập bị từ chối',
  //       description: 'Bạn không có quyền truy cập vào trang này.',
  //       duration: 3,
  //     });
  //     setRedirect(true);
  //   }
  // }, [isAuthenticated, user, loading]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated || redirect) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
