import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from '../src/components/layouts/AdminLayout';
import DashboardPage from '../src/components/pages/DashboardPage';
import DepartmentPage from '../src/components/pages/DepartmentPage';
import Login from '../src/components/pages/LoginPage';
import PrivateRoute from '../src/routers/PrivateRoute';
import { useAuth } from '../src/global/AuthenticationContext';
import MajorPage from './components/pages/MajorPage';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="department" element={<DepartmentPage />} />
          <Route path="major" element={<MajorPage />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
