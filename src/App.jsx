import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from '../src/components/layouts/AdminLayout';
import DepartmentPage from '../src/components/pages/DepartmentPage';
import Login from '../src/components/pages/LoginPage';
import PrivateRoute from '../src/routers/PrivateRoute';
import { useAuth } from '../src/global/AuthenticationContext';
import MajorPage from './components/pages/MajorPage';
import Dashboard from './components/pages/Dashboard';
import SubjectPage from './components/pages/SubjectPage';
import RoomPage from './components/pages/RoomPage';
import SchedulePage from '../src/components/pages/Schedule/view/SchedulePage';
import LessonPage from './components/pages/teacher/LessonPage';


const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; 

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
          <Route index element={<Dashboard />} />
          <Route path="department" element={<DepartmentPage />} />
          <Route path="major" element={<MajorPage />} />
          <Route path="subject" element={<SubjectPage />} />
          <Route path="room" element={<RoomPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="lesson" element={<LessonPage />} />

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
