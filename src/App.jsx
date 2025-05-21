import React from 'react';
import AdminLayout from '../src/components/layouts/AdminLayout';
import StudentPage from '../src/components/pages/StudentPage';

function App() {
  return (
    <AdminLayout>
      <StudentPage />
    </AdminLayout>
  );
}

export default App;
