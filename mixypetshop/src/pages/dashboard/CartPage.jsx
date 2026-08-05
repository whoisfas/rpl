import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { orderService } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

const CartPage = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const newCart = cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      console.log('Starting checkout process...');
      console.log('User:', user);
      console.log('Cart items:', cart);
      console.log('Cart total:', cartTotal);

      const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      console.log('Order items:', items);

      const orderData = {
        user_id: user.id,
        total: cartTotal,
        status: 'menunggu',
        items
      };

      console.log('Order data:', orderData);

      await orderService.createOrder(orderData);
      console.log('Order created successfully');

      // Clear cart
      setCart([]);
      localStorage.removeItem('cart');

      // Redirect to orders
      window.location.href = '/dashboard/orders';
    } catch (err) {
      console.error('Failed to create order:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      alert(`Gagal membuat pesanan: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-12 h-12 dark:text-gray-400 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">Keranjang Anda kosong</h2>
        <p className="dark:text-gray-400 text-gray-600 mb-6">Tambahkan beberapa produk untuk memulai</p>
        <Link to="/dashboard/products" className="btn-primary">
          Lihat Produk
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">Keranjang Belanja</h1>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="glass-dark rounded-2xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="text-3xl">📦</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm dark:text-gray-400 text-gray-600 mb-2">{item.category}</p>
                  <p className="text-xl font-bold gradient-text">Rp {item.price.toLocaleString()}</p>
                </div>
                
                <div className="flex flex-col items-end space-y-4">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="dark:text-white text-gray-900 font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="dark:text-gray-400 text-gray-600">Subtotal</span>
                <span className="text-lg font-semibold dark:text-white text-gray-900">
                  Rp {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-dark rounded-2xl p-6 sticky top-4">
            <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-6">Ringkasan Pesanan</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="dark:text-gray-400 text-gray-600">Subtotal</span>
                <span className="dark:text-white text-gray-900">Rp {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-gray-400 text-gray-600">Pengiriman</span>
                <span className="dark:text-white text-gray-900">Gratis</span>
              </div>
              <div className="flex justify-between">
                <span className="dark:text-gray-400 text-gray-600">Pajak</span>
                <span className="dark:text-white text-gray-900">Rp 0</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between">
                <span className="text-lg font-semibold dark:text-white text-gray-900">Total</span>
                <span className="text-2xl font-bold gradient-text">Rp {cartTotal.toLocaleString()}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>{loading ? 'Memproses...' : 'Checkout'}</span>
            </button>
            
            <Link
              to="/dashboard/products"
              className="block text-center mt-4 dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900 transition-colors"
            >
              Lanjut Belanja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
