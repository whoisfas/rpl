import React, { useState, useEffect } from 'react';
import { CreditCard, Edit, Trash2, X, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '../../services/api';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    status: 'menunggu'
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await api.get('/payments');
      setPayments(res.data);
    } catch (err) {
      console.error('Failed to load payments:', err);
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
      await api.put(`/payments/${editingPayment.id}`, formData);
      setShowModal(false);
      setEditingPayment(null);
      setFormData({ status: 'menunggu' });
      loadPayments();
    } catch (err) {
      console.error('Failed to update payment:', err);
      alert('Failed to update payment. Please try again.');
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({ status: payment.status });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) return;
    
    try {
      await api.delete(`/payments/${id}`);
      loadPayments();
    } catch (err) {
      console.error('Failed to delete payment:', err);
      alert('Failed to delete payment. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'terverifikasi':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'menunggu':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'ditolak':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      menunggu: 'bg-yellow-500/20 text-yellow-400',
      terverifikasi: 'bg-green-500/20 text-green-400',
      ditolak: 'bg-red-500/20 text-red-400'
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
      <h1 className="text-3xl font-bold gradient-text">Payments Management</h1>

      {payments.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No payments</h3>
          <p className="text-gray-400">Payments will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="glass-dark rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl flex items-center justify-center">
                    {getStatusIcon(payment.status)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Payment #{payment.id}</h3>
                    <p className="text-gray-400 text-sm">
                      Order #{payment.orderId} • {new Date(payment.date).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold gradient-text">Rp {payment.amount.toLocaleString()}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
              
              {payment.proof && (
                <div className="mt-4 p-4 bg-white/5 rounded-xl">
                  <p className="text-gray-400 text-sm mb-2">Payment Proof</p>
                  <img src={payment.proof} alt="Payment proof" className="w-full h-32 object-cover rounded-lg" />
                </div>
              )}
              
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => handleEdit(payment)}
                  className="flex-1 btn-secondary flex items-center justify-center space-x-2 text-sm py-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Status</span>
                </button>
                <button
                  onClick={() => handleDelete(payment.id)}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl py-2 flex items-center justify-center space-x-2 text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
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
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold gradient-text mb-6">Update Payment Status</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="menunggu">Pending</option>
                  <option value="terverifikasi">Verified</option>
                  <option value="ditolak">Rejected</option>
                </select>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
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

export default AdminPaymentsPage;
