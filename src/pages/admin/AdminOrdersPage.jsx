import React, { useState, useEffect } from 'react';
import { Package, Edit, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { orderService } from '../../services/supabase';
import { useToast } from '../../context/ToastContext';

const AdminOrdersPage = () => {
  const { success, error } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [formData, setFormData] = useState({
    status: 'menunggu'
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Gagal memuat pesanan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await orderService.updateOrderStatus(editingOrder.id, formData.status);
      success('Status pesanan berhasil diperbarui');
      setShowModal(false);
      setEditingOrder(null);
      setFormData({ status: 'menunggu' });
      loadOrders();
    } catch (err) {
      console.error('Gagal memperbarui pesanan:', err);
      error('Gagal memperbarui pesanan. Silakan coba lagi.');
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({ status: order.status });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) return;
    
    try {
      await orderService.deleteOrder(id);
      success('Pesanan berhasil dihapus');
      loadOrders();
    } catch (err) {
      console.error('Gagal menghapus pesanan:', err);
      error('Gagal menghapus pesanan. Silakan coba lagi.');
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
      <h1 className="text-3xl font-bold gradient-text">Manajemen Pesanan</h1>

      {orders.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <Package className="w-16 h-16 dark:text-gray-400 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2">Tidak ada pesanan</h3>
          <p className="dark:text-gray-400 text-gray-600">Pesanan akan muncul di sini</p>
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
                      <h3 className="text-lg font-semibold dark:text-white text-gray-900">Pesanan #{order.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="dark:text-gray-400 text-gray-600 text-sm">
                      ID Pengguna: {order.userId} • {new Date(order.date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl font-bold gradient-text">Rp {order.total.toLocaleString()}</p>
                    <p className="dark:text-gray-400 text-gray-600 text-sm">{order.items.length} item</p>
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
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="dark:text-white text-gray-900 font-medium">Item Pesanan</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(order)}
                        className="btn-secondary flex items-center space-x-2 text-sm py-2 px-4"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Status</span>
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl py-2 px-4 flex items-center space-x-2 text-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg flex items-center justify-center">
                            <Package className="w-6 h-6 text-primary-400" />
                          </div>
                          <div>
                            <p className="dark:text-white text-gray-900 font-medium">Produk #{item.productId}</p>
                            <p className="dark:text-gray-400 text-gray-600 text-sm">Jumlah: {item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative glass rounded-2xl p-8 w-full max-w-md">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold gradient-text mb-6">Update Status Pesanan</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="menunggu">Menunggu</option>
                  <option value="dikonfirmasi">Dikonfirmasi</option>
                  <option value="selesai">Selesai</option>
                  <option value="dibatalkan">Dibatalkan</option>
                </select>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
