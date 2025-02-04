import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart } from 'lucide-react';

export default function Marketplace() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Remove "http://localhost:5000" if using proxy
        const response = await fetch('/marketplace');

        console.log('Response:', response); // Debug log

        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        console.log('Products data:', data); // Debug log
        setProducts(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Search functionality
  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  if (loading) return <div className="p-4">Loading products...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      {/* Top Section (from your image) */}
      <div className="mb-8">
        {/* Orange Header Section */}
        <div className="bg-orange-500 text-white p-6 rounded-lg mb-6 mx-auto ">
  <div className="flex items-center justify-center gap-6">
    {/* Large Cart Icon - Left Side */}
    <ShoppingCart size={87} className="text-white" />

    {/* Centered Text and Button */}
    <div className="text-center">
      <br />
      <h1 className="text-4xl font-bold">Marketplace</h1>
      
      <p className="font-bold mb-3">Discover authentic Indian home essentials</p>
      {(user?.role === 'vendor' || user?.role === 'admin') && (
        <button 
          className="bg-white text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-100 transition-colors"
          onClick={() => {}}
        >
          + Add Product
        </button>
      )}
    </div>
  </div>
</div>
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Furniture', 'Decor', 'Kitchen', 'Lighting', 'Textiles', 'Storage'].map((category) => (
              <div
                key={category}
                className="p-4 border rounded-lg hover:bg-orange-50 cursor-pointer transition-colors"
                onClick={() => setSearchTerm(category)}
              >
                <h3 className="font-medium">{category}</h3>
                <p className="text-sm text-gray-500">
                  {products.filter(p => p.category === category).length} items
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Add Product Button (Orange) */}

      </div>

      {/* Products Grid (Keep your existing style) */}
      <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No products found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <div key={product._id} className="border p-4 rounded-lg shadow">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
              )}
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-gray-800">₹{product.price.toLocaleString()}</p>
              <p className="text-sm text-gray-600 capitalize">{product.category}</p>
              <p className="text-xs text-gray-500 mt-2">
                Sold by: {product.vendorId?.name || 'Unknown vendor'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}