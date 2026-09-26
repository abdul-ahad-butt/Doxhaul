import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { AuthLayout } from './layouts/AuthLayout';
import { AppLayout } from './layouts/AppLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LoadBoardPage from './pages/LoadBoardPage';
import ProfilePage from './pages/ProfilePage';

import BookingsPage from './pages/BookingsPage';
import TripsPage from './pages/TripsPage';

// Placeholder Pages (will be replaced)
// Unused placeholder removed
// Unused placeholder removed
// Unused placeholder removed
// Unused placeholder removed

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
          </Route>

          {/* Protected Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/loads" element={<LoadBoardPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
