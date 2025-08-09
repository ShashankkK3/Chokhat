import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AddProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock:'',
    category: 'Furniture',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/marketplace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          vendorId: user._id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      navigate('/marketplace');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isBlockedVendor = user?.role === 'vendor' && user?.status !== 'active';

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      {isBlockedVendor && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
          You are blocked and cannot add products.
        </div>
      )}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Product Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Stock</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: e.target.value})}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Price (₹)</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Category</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {['Furniture', 'Decor', 'Kitchen', 'Lighting', 'Textiles', 'Storage'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Image URL</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button
          type="submit"
          className={`text-white px-4 py-2 rounded ${isBlockedVendor ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'} disabled:opacity-50`}
          disabled={loading || isBlockedVendor}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}