import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', formData);
      login(res.data.user, res.data.token); // Update context
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-full max-w-md"
    >
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <input
        name="email"
        onChange={handleChange}
        placeholder="Email"
        type="email"
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <input
        name="password"
        onChange={handleChange}
        placeholder="Password"
        type="password"
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
        Login
      </button>
    </form>
  );
}
