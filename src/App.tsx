import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Blog from './pages/Blog';
import Profile from './pages/Profile';
import Products from './pages/Products';
import Vehicles from './pages/Vehicles';
import Certificates from './pages/Certificates';
import FAQManager from './pages/FAQManager';
import Clients from './pages/Clients';
import Partnerships from './pages/Partnerships';
import Offers from './pages/Offers';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { Toaster } from 'sonner';
import './i18n/config';
import { useTranslation } from 'react-i18next';

import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const { i18n } = useTranslation();

  // Handle RTL setup globally
  useEffect(() => {
    const lang = i18n.language;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [i18n.language]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right" richColors />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="vehicles" element={<Vehicles />} />
                <Route path="certificates" element={<Certificates />} />
                <Route path="blog" element={<Blog />} />
                <Route path="clients" element={<Clients />} />
                <Route path="partnerships" element={<Partnerships />} />
                <Route path="offers" element={<Offers />} />
                <Route path="faq" element={<FAQManager />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
