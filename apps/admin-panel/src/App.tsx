import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { AuthLayout } from './layouts/AuthLayout';
import { AppLayout } from './layouts/AppLayout';

import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { UsersDirectoryPage } from './pages/UsersDirectoryPage';
import { SupportTicketsPage } from './pages/SupportTicketsPage';
import { PlatformLoadsPage } from './pages/PlatformLoadsPage';
import { IntegrationsSettingsPage } from './pages/IntegrationsSettingsPage';
import { VerificationsQueuePage } from './pages/VerificationsQueue';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          {/* Default redirect to login or dashboard */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Protected Routes (Admin) */}
          <Route element={<AppLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/verifications" element={<VerificationsQueuePage />} />
            <Route path="/admin/loads" element={<PlatformLoadsPage />} />
            <Route path="/admin/users" element={<UsersDirectoryPage />} />
            <Route path="/admin/tickets" element={<SupportTicketsPage />} />
            <Route path="/admin/integrations" element={<IntegrationsSettingsPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
