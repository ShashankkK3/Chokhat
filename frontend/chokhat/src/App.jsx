import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import Marketplace from './components/marketplace';
import { useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Fixed Navbar (always visible) */}
        <Navbar />
        
        {/* Scrollable content area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/marketplace" 
              element={
                <PrivateRoute>
                  <Marketplace />
                </PrivateRoute>
              } 
            />
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}