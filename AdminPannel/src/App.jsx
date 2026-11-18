import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Auth
import MainLayout from './Layout/MainLayout/MainLayout';
import ProtectedRoutes from './Components/ProtectedRoutes/ProtectedRoutes';
import Login from './Components/Login/Login';

// Pages & Features
import Dashboard from './Pages/Dashboard/Dashboard';
import Profile from './Components/Profile/Profile';
import TeamMember from './Components/TeamMember/TeamMember';

// Content Management
import BlogManagement from './Components/BlogManagement/BlogManagement';
import BlogPost from './Components/BlogPost/BlogPost';
import ManageGallery from './Components/ManageGallery/ManageGallery';
import AddGallery from './Components/AddGallery/AddGallery';

// Real Estate & Leads
import PropertyManagement from './Components/PropertyManagement/PropertyManagement';
import SellManagement from './Components/SellManagement/SellManagement';
import RentManagement from './Components/RentManagement/RentManagement';
import Enquiry from './Components/Enquiry/Enquiry';
import ColdLead from './Components/ColdLead/ColdLead';
import Property from './Components/Property/Property';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Navigate to="/" replace />} />

            {/* Blog */}
            <Route path="blog">
              <Route index element={<BlogManagement />} />
              <Route path="new" element={<BlogPost />} />
            </Route>

            {/* Gallery */}
            <Route path="gallery">
              <Route index element={<ManageGallery />} />
              <Route path="add" element={<AddGallery />} />
            </Route>

            {/* Properties & Listings */}
            <Route path="properties" element={<PropertyManagement />} />
            <Route path="/properties/add" element={<Property/>} />
            <Route path="sell" element={<SellManagement />} />
            <Route path="rent" element={<RentManagement />} />

            {/* Leads & CRM */}
            <Route path="enquiry" element={<Enquiry />} />
            <Route path="leads" element={<ColdLead />} />

            {/* Organization & Account */}
            <Route path="team" element={<TeamMember />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;