import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const res = await fetch(`http://localhost:5000${endpoint}`, { // Add full backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Server error');
      }
  
      // Backend returns { message, token, user } - use token and user
      login(data.user, data.token); // Pass both to AuthContext
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err); // Debugging
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Create Account'}
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
        {!isLogin && (
  <>
    {/* Name field */}
    <input 
      name="name"
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      placeholder="Full Name"
      className="w-full mb-4 p-2 border rounded"
      required
    />
    
    {/* Role dropdown (only user/vendor) */}
    <select
      name="role"
      value={formData.role || 'user'} // Default to 'user'
      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      className="w-full mb-4 p-2 border rounded"
    >
      <option value="user">User</option>
      <option value="vendor">Vendor</option>
      <option value="admin">Admin</option>
    </select>
  </>
)}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            placeholder="Password"
            className="w-full mb-6 p-2 border rounded"
            required
            minLength={6}
          />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded font-medium transition"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          {isLogin ? 'New to Chokhat? ' : 'Already have an account? '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-orange-500 hover:underline focus:outline-none"
          >
            {isLogin ? 'Create account' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}