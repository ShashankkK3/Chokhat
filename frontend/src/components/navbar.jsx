import { Link } from 'react-router-dom';
import { User, ShoppingCart, ImageIcon, Hammer, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import navLogo from '../assets/navLogo.png';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full px-6 h-[57px] bg-white shadow flex justify-between items-center">
      {/* Left Section: Logo */}
      <div className="flex items-center gap-7">
        <Link to={user?.role === 'user' ? '/dashboard/user' : '/'}>
          <img
            src={navLogo}
            alt="logo"
            style={{
              height: '45px',
              width: 'auto',
              borderRadius: '8px',
              zIndex: 10
            }}
          />
        </Link>
      </div>

      {/* Middle Section: Navigation Links */}
      <div className="flex gap-16 items-center">
        <Link to="/marketplace" className="flex items-center gap-5 px-4 py-2 rounded-full font-medium text-orange-800 hover:bg-orange-100">
          <ShoppingCart size={18} /><span>Marketplace</span>
        </Link>
        <Link to="/inspiration" className="flex items-center gap-4 px-4 py-2 rounded-full font-medium text-orange-800 hover:bg-orange-100">
          <ImageIcon size={18} /><span>Inspiration</span>
        </Link>
        <Link to="/services" className="flex items-center gap-4 px-4 py-2 rounded-full font-medium text-orange-800 hover:bg-orange-100">
          <Hammer size={18} /><span>Services</span>
        </Link>

        {/* 👇 Add ADMIN-ONLY link (example) */}

      </div>

      {/* Right Section: User/Auth */}
      {user ? (
        <div className="flex items-center gap-2">
          {/* 👇 Show role badge if not a regular user */}
          {user.role !== 'user' && (
            <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin'
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
              }`}>
              {user.role}
            </span>
          )}

          <Link
            to={`/dashboard/${user.role}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-orange-800 hover:bg-orange-100"
          >
            <User size={18} />
            <span>{user.name}</span>
          </Link>
          <button onClick={logout} className="text-sm text-gray-500 hover:underline">
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-medium">
          Get Started
        </Link>
      )}
    </nav>
  );
}