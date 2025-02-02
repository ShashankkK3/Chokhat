import { Link } from 'react-router-dom';
import { User, ShoppingCart, ImageIcon, Hammer } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import navLogo from '../assets/navLogo.png'

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full px-6 h-[57px] bg-white shadow flex justify-between items-center">
      <div className="flex items-center gap-7">
        <Link to="/">
          <img src={navLogo} alt="logo" style={{
            height: '45px',
            width: 'auto',
            borderRadius: '8px',
            // position: 'absolute',

            zIndex: 10
          }} />

        </Link>

      </div>

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
      </div>

      {user ? (
        <div className="flex items-center gap-2">
          <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-orange-800 hover:bg-orange-100">
            <User size={18} /><span>{user.name}</span>
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
