import React, { useState, useEffect } from 'react';
import { CreditCard, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PaymentsPage = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [proofUrl, setProofUrl] = useState('');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await api.get(`/payments?userId=${user.id}`);
      setPayments(res.data);
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payments', {
        orderId: selectedOrder.id,
        amount: selectedOrder.total,
        method: 'transfer',
        proof: proofUrl
      });
      
      setShowUploadModal(false);
      setSelectedOrder(null);
      setProofUrl('');
      loadPayments();
    } catch (err) {
      console.error('Failed to upload payment:', err);
      alert('Failed to upload payment. Please try again.');
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
      <h1 className="text-3xl font-bold gradient-text">Payments</h1>

      {payments.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No payments yet</h3>
          <p className="text-gray-400 mb-6">Your payment history will appear here</p>
          <a href="/dashboard/orders" className="btn-primary inline-block">
            View Orders
          </a>
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
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUploadModal(false)}></div>
          <div className="relative glass rounded-2xl p-8 w-full max-w-md">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold gradient-text mb-6">Upload Payment Proof</h2>
            
            <div className="mb-6 p-4 bg-white/5 rounded-xl">
              <p className="text-white font-medium">Order #{selectedOrder.id}</p>
              <p className="text-gray-400 text-sm">Total: Rp {selectedOrder.total.toLocaleString()}</p>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Payment Proof URL</label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="input-field"
                  placeholder="https://example.com/proof.jpg"
                  required
                />
                <p className="text-gray-500 text-xs mt-2">Upload your payment proof to an image hosting service and paste the URL here</p>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
