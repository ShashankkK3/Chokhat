import { useEffect } from 'react'; // Add this import
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard/UserManagement';
import VendorDashboard from '../components/VendorDashboard/ProductManager';
import UserDashboard from '../components/UserDashboard/ProfileSection';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const expectedPath = `/dashboard/${user.role}`;
      if (location.pathname !== expectedPath) {
        navigate(expectedPath);
      }
    }
  }, [user, location, navigate]);

  if (!user) return <Navigate to="/login" />;
  
  return (
    <div className="dashboard-container p-4">
      <div className="mb-6 p-4 rounded-lg bg-orange-50 border border-orange-200">
        <h1 className="text-xl font-semibold text-orange-800">Hello, {user.name}</h1>
      </div>
      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'vendor' && <VendorDashboard />}
      {user.role === 'user' && <UserDashboard />}
    </div>
  );
}