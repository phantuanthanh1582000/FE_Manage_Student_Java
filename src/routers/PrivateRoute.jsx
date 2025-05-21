import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    // Nếu chưa có token => chuyển về login
    return <Navigate to="/login" replace />;
  }
  // Nếu có token => cho phép truy cập component con
  return children;
};

export default PrivateRoute;
