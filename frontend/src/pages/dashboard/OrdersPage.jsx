import React, { useState, useEffect } from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get(`/orders?userId=${user.id}`);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">My Orders</h1>

      {orders.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
          <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
          <a href="/dashboard/products" className="btn-primary inline-block">
            Browse Products
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="glass-dark rounded-2xl overflow-hidden">
              <div 
                className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-white">Order #{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.date).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold gradient-text">Rp {order.total.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">{order.items.length} items</p>
                  </div>
                  
                  <div className="ml-4">
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
              
              {expandedOrder === order.id && (
                <div className="px-6 pb-6 border-t border-white/10">
                  <h4 className="text-white font-medium mb-4">Order Details</h4>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Product #{item.productId}</p>
                            <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-white font-medium">
                          Rp {(item.productId * item.quantity * 50000).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                    <span className="text-gray-400">Total</span>
                    <span className="text-xl font-bold gradient-text">Rp {order.total.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
