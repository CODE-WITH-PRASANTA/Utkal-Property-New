import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './Layout/MainLayout/MainLayout';
import Dashboard from './Pages/Dashboard/Dashboard';
import Login from './Components/Login/Login';
import ProtectedRoutes from './Components/ProtectedRoutes/ProtectedRoutes'; // Adjust path if needed

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<MainLayout />}>
            {/* Default route rendered at "/" */}
            <Route index element={<Dashboard />} />

            {/* Optional explicit dashboard alias */}
            <Route path="dashboard" element={<Navigate to="/" replace />} />
          </Route>
        </Route>

        {/* Fallback for unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;