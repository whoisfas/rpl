import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService, orderService, userService } from '../../services/supabase';

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    loadProducts();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Gagal memuat users:', err);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data || []);
    } catch (err) {
      console.error('Gagal memuat products:', err);
    }
  };

  const addItem = () => {
    setOrderItems([...orderItems, { product_id: '', quantity: 1, price: 0 }]);
  };

  const removeItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...orderItems];
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      updated[index].price = product ? product.price : 0;
    }
    updated[index][field] = value;
    setOrderItems(updated);
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || orderItems.length === 0) {
      alert('Pilih user dan tambahkan minimal 1 produk');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        user_id: selectedUser,
        total: calculateTotal(),
        status: 'menunggu',
        items: orderItems
      };

      await orderService.createOrder(orderData);
      alert('Order berhasil dibuat');
      navigate('/admin');
    } catch (err) {
      console.error('Gagal membuat order:', err);
      alert(`Gagal membuat order: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/admin')} className="flex items-center space-x-2 dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900">
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali ke Overview</span>
      </button>

      <h1 className="text-3xl font-bold gradient-text">Tambah Order Manual</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Selection */}
        <div className="glass-dark rounded-2xl p-6">
          <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-4">Pilih User</h2>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="input-field"
            required
          >
            <option value="">Pilih User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email} - {user.email}
              </option>
            ))}
          </select>
        </div>

        {/* Order Items */}
        <div className="glass-dark rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-white text-gray-900">Item Pesanan</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Item</span>
            </button>
          </div>

          {orderItems.length === 0 ? (
            <p className="dark:text-gray-400 text-gray-600 text-center py-8">Belum ada item ditambahkan</p>
          ) : (
            <div className="space-y-4">
              {orderItems.map((item, index) => (
                <div key={index} className="flex items-end space-x-4 p-4 bg-white/5 rounded-xl">
                  <div className="flex-1">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Produk</label>
                    <select
                      value={item.product_id}
                      onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Pilih Produk</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - Rp {product.price?.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Jumlah</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="w-32">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Harga</label>
                    <input
                      type="text"
                      value={`Rp ${item.price?.toLocaleString()}`}
                      className="input-field"
                      disabled
                    />
                  </div>

                  <div className="w-32 text-right">
                    <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Subtotal</label>
                    <p className="dark:text-white text-gray-900 font-medium">
                      Rp {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total */}
        {orderItems.length > 0 && (
          <div className="glass-dark rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold dark:text-white text-gray-900">Total</span>
              <span className="text-3xl font-bold gradient-text">Rp {calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>{loading ? 'Menyimpan...' : 'Buat Order'}</span>
        </button>
      </form>
    </div>
  );
};

export default CreateOrderPage;
