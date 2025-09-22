import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import MainLayout from './layouts/MainLayout';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import CarListingsPage from './pages/CarListingsPage';
import CarDetailPage from './pages/CarDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfilePage from './pages/UserProfilePage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCarsPage from './pages/AdminCarsPage';
import AdminReportsPage from './pages/AdminReportsPage';
import CreateListingPage from './pages/CreateListingPage';
import FavoritesPage from './pages/FavoritesPage';
import ReportsPage from './pages/ReportsPage';

import './App.css';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path='/' element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path='cars' element={<CarListingsPage />} />
              <Route path='cars/:id' element={<CarDetailPage />} />
              <Route path='profile' element={<UserProfilePage />} />
              <Route path='favorites' element={<FavoritesPage />} />
              <Route path='reports' element={<ReportsPage />} />
              <Route path='sell' element={<CreateListingPage />} />
              <Route
                path='seller-dashboard'
                element={<SellerDashboardPage />}
              />
              <Route
                path='admin'
                element={
                  <ProtectedRoute requiredRole='admin'>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='admin/users'
                element={
                  <ProtectedRoute requiredRole='admin'>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='admin/cars'
                element={
                  <ProtectedRoute requiredRole='admin'>
                    <AdminCarsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='admin/reports'
                element={
                  <ProtectedRoute requiredRole='admin'>
                    <AdminReportsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Auth routes without main layout */}
            <Route path='login' element={<LoginPage />} />
            <Route path='register' element={<RegisterPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
