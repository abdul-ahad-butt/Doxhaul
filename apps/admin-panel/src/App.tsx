import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { AuthLayout } from './layouts/AuthLayout';
import { AppLayout } from './layouts/AppLayout';

import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

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
            <Route path="/admin/verifications" element={<div className="p-8">Verifications</div>} />
            <Route path="/admin/loads" element={<div className="p-8">Admin Loads</div>} />
          </Route>
          
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
