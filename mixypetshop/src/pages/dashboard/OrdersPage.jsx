import React, { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { orderService } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user || !user.id) {
        console.log('No user or user.id');
        setOrders([]);
        setLoading(false);
        return;
      }

      console.log('Loading orders for user:', user.id);
      const data = await orderService.getUserOrders(user.id);
      console.log('Orders loaded:', data);

      if (!data || !Array.isArray(data)) {
        console.log('Invalid orders data, setting empty array');
        setOrders([]);
      } else {
        setOrders(data);
      }
    } catch (err) {
      console.error('Gagal memuat pesanan:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      setError('Gagal memuat pesanan. Silakan refresh halaman.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      menunggu: 'bg-yellow-500/20 text-yellow-400',
      dikonfirmasi: 'bg-green-500/20 text-green-400',
      selesai: 'bg-blue-500/20 text-blue-400',
      dibatalkan: 'bg-red-500/20 text-red-400'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <Package className="w-12 h-12 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">Terjadi Kesalahan</h2>
        <p className="dark:text-gray-400 text-gray-600 mb-6">{error}</p>
        <button onClick={loadOrders} className="btn-primary">
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">Pesanan Saya</h1>

      {orders.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 dark:text-gray-400 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2">Belum ada pesanan</h3>
          <p className="dark:text-gray-400 text-gray-600 mb-6">Mulai belanja untuk melihat pesanan Anda di sini</p>
          <a href="/dashboard/products" className="btn-primary inline-block">
            Lihat Produk
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, orderIndex) => {
            if (!order) return null;
            return (
              <div key={order.id || orderIndex} className="glass-dark rounded-2xl overflow-hidden">
                <div
                  className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold dark:text-white text-gray-900">
                          Pesanan #{order.id ? order.id.substring(0, 8) : 'N/A'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status || 'menunggu')}`}>
                          {order.status || 'menunggu'}
                        </span>
                      </div>
                      <p className="dark:text-gray-400 text-gray-600 text-sm">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold gradient-text">Rp {(order.total || 0).toLocaleString()}</p>
                      <p className="dark:text-gray-400 text-gray-600 text-sm">
                        {order.items && Array.isArray(order.items) ? order.items.length : 0} item
                      </p>
                    </div>

                    <div className="ml-4">
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-5 h-5 dark:text-gray-400 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 dark:text-gray-400 text-gray-600" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="px-6 pb-6 border-t border-white/10">
                    <h4 className="dark:text-white text-gray-900 font-medium mb-4">Detail Pesanan</h4>
                    <div className="space-y-3">
                      {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                        order.items.map((item, itemIndex) => {
                          if (!item) return null;
                          return (
                            <div key={item.id || itemIndex} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg flex items-center justify-center">
                                  {item.products && item.products.image ? (
                                    <img src={item.products.image} alt={item.products.name} className="w-full h-full object-cover rounded-lg" />
                                  ) : (
                                    <Package className="w-6 h-6 text-primary-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="dark:text-white text-gray-900 font-medium">
                                    {item.products ? item.products.name : `Produk #${item.product_id || item.productId || 'N/A'}`}
                                  </p>
                                  <p className="dark:text-gray-400 text-gray-600 text-sm">Jumlah: {item.quantity || 0}</p>
                                </div>
                              </div>
                              <span className="dark:text-white text-gray-900 font-medium">
                                Rp {((item.price || 0) * (item.quantity || 0)).toLocaleString()}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="dark:text-gray-400 text-gray-600 text-center py-4">Tidak ada detail item</p>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                      <span className="dark:text-gray-400 text-gray-600">Total</span>
                      <span className="text-xl font-bold gradient-text">Rp {(order.total || 0).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
