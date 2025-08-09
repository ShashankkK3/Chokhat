import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import AddProduct from './pages/AddProduct';
import Marketplace from './components/marketplace';
import { useAuth } from './contexts/AuthContext';
import DashboardPage from './pages/DashboardPage'; // New import
import AdminDashboard from './components/AdminDashboard/UserManagement';
import VendorDashboard from './components/VendorDashboard/ProductManager';
import UserDashboard from './components/UserDashboard/ProfileSection';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function RoleBasedRoute({ roles, children }) {
  const { user } = useAuth();
  return user && roles.includes(user.role) ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />

            {/* Protected routes */}
            <Route path="/add-product" element={
              <PrivateRoute>
                <RoleBasedRoute roles={['vendor', 'admin']}>
                  <AddProduct />
                </RoleBasedRoute>
              </PrivateRoute>
            } />

            <Route path="/marketplace" element={
              <PrivateRoute>
                <Marketplace />
              </PrivateRoute>
            } />

            {/* Dashboard routes */}
            // In your App.jsx
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            >
              <Route
                path="admin"
                element={
                  <RoleBasedRoute roles={['admin']}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="vendor"
                element={
                  <RoleBasedRoute roles={['vendor']}>
                    <VendorDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="user"
                element={
                  <RoleBasedRoute roles={['user']}>
                    <UserDashboard />
                  </RoleBasedRoute>
                }
              />
            </Route>

        
        </Routes>
      </main>
    </div>
    </Router >
  );
}