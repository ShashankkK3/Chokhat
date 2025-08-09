import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function UserDashboard() {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const { user, login } = useAuth();

  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setCartItems(Array.isArray(storedCart) ? storedCart : []);
      setOrders(Array.isArray(storedOrders) ? storedOrders : []);
      setName(user?.name || '');
    } catch (_) {
      setCartItems([]);
      setOrders([]);
    }
  }, [user]);

  const updateCartStorage = (nextCart) => {
    setCartItems(nextCart);
    localStorage.setItem('cart', JSON.stringify(nextCart));
  };

  const updateCartQuantity = (productId, nextQuantity) => {
    const quantity = Number.isFinite(nextQuantity) ? Math.max(1, Math.floor(nextQuantity)) : 1;
    const nextCart = cartItems.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    updateCartStorage(nextCart);
  };

  const removeFromCart = (productId) => {
    const nextCart = cartItems.filter((item) => item._id !== productId);
    updateCartStorage(nextCart);
  };

  const totalCartAmount = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <div className="p-4 space-y-8">
      <section className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-3">Your Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input className="w-full border rounded px-3 py-2 bg-gray-50" value={user?.email || ''} disabled />
          </div>
        </div>
        <div className="mt-3">
          <button
            className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60"
            disabled={saving || !name.trim()}
            onClick={async () => {
              try {
                setSaving(true);
                const res = await fetch('/api/users/me', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                  body: JSON.stringify({ name: name.trim() }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Update failed');
                // Update AuthContext user to reflect new name
                const currentToken = localStorage.getItem('token');
                login(data.user, currentToken);
              } catch (err) {
                // eslint-disable-next-line no-alert
                alert(err.message || 'Failed to update profile');
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-3">Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">No items in cart.</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2 text-center">Product</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Subtotal</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="px-4 py-2">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded" />
                      ) : (
                        <div className="h-12 w-12 bg-gray-100 rounded" />
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Link to="/marketplace" className="text-orange-600 hover:underline">
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2 capitalize">{item.category}</td>
                    <td className="px-4 py-2">₹{(item.price || 0).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
                          onClick={() => updateCartQuantity(item._id, (item.quantity || 1) - 1)}
                          disabled={(item.quantity || 1) <= 1}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          className="w-16 px-2 py-1 border rounded"
                          value={item.quantity || 1}
                          onChange={(e) => updateCartQuantity(item._id, parseInt(e.target.value, 10) || 1)}
                        />
                        <button
                          type="button"
                          className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
                          onClick={() => updateCartQuantity(item._id, (item.quantity || 1) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2">₹{(((item.price || 0) * (item.quantity || 1)) || 0).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        className="px-3 py-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t bg-gray-50">
                  <td className="px-4 py-2 font-semibold" colSpan={4}>Total</td>
                  <td className="px-4 py-2 font-semibold">₹{totalCartAmount.toLocaleString()}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Your Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2 text-center">Product</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Placed At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId} className="border-t">
                    <td className="px-4 py-2">{order.orderId}</td>
                    <td className="px-4 py-2">
                      {order.image ? (
                        <img src={order.image} alt={order.name} className="h-12 w-12 object-cover rounded" />
                      ) : (
                        <div className="h-12 w-12 bg-gray-100 rounded" />
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Link to="/marketplace" className="text-orange-600 hover:underline">
                        {order.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2">₹{(order.price || 0).toLocaleString()}</td>
                    <td className="px-4 py-2">{order.quantity || 1}</td>
                    <td className="px-4 py-2">{order.placedAt ? new Date(order.placedAt).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}