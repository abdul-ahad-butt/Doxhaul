import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { AuthLayout } from './layouts/AuthLayout';
import { AppLayout } from './layouts/AppLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import DashboardPage from './pages/DashboardPage';
import LoadBoardPage from './pages/LoadBoardPage';
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import TripsPage from './pages/TripsPage';
import InvoicesPage from './pages/InvoicesPage';
import { SupportAssistantWidget } from './components/support/SupportAssistantWidget';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/signup" element={<RegisterPage />} />
            <Route path="/complete-profile" element={<CompleteProfilePage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/loads" element={<LoadBoardPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          {/* Admin Redirects in User Web */}
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
          <Route path="/admin/*" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <SupportAssistantWidget />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
