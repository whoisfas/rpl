import React, { useState, useEffect } from 'react';
import { CreditCard, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';
import { paymentService } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const PaymentsPage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [proofUrl, setProofUrl] = useState('');

  useEffect(() => {
    loadPayments();
  }, [user]);

  const loadPayments = async () => {
    if (!user) return;
    try {
      console.log('Loading payments for user:', user.id);
      const data = await paymentService.getUserPayments(user.id);
      console.log('Payments loaded:', data);
      setPayments(data);
      setError(null);
    } catch (err) {
      console.error('Gagal memuat pembayaran:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      setError(err.message || 'Gagal memuat pembayaran');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await paymentService.createPayment({
        orderId: selectedOrder.id,
        userId: user.id,
        amount: selectedOrder.total,
        proof: proofUrl
      });
      
      setShowUploadModal(false);
      setSelectedOrder(null);
      setProofUrl('');
      success('Bukti pembayaran berhasil diunggah');
      loadPayments();
    } catch (err) {
      console.error('Gagal mengunggah pembayaran:', err);
      error('Gagal mengunggah pembayaran. Silakan coba lagi.');
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

  if (error) {
    return (
      <div className="glass-dark rounded-2xl p-6">
        <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
        <p className="dark:text-gray-400 text-gray-600">{error}</p>
        <button
          onClick={loadPayments}
          className="mt-4 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-xl transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">Pembayaran</h1>

      {payments.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 dark:text-gray-400 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2">Belum ada pembayaran</h3>
          <p className="dark:text-gray-400 text-gray-600 mb-6">Riwayat pembayaran Anda akan muncul di sini</p>
          <a href="/dashboard/orders" className="btn-primary inline-block">
            Lihat Pesanan
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
                    <h3 className="text-lg font-semibold dark:text-white text-gray-900">Pembayaran #{payment.id}</h3>
                    <p className="dark:text-gray-400 text-gray-600 text-sm">
                      Pesanan #{payment.orderId} • {new Date(payment.date).toLocaleDateString('id-ID')}
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
                  <p className="dark:text-gray-400 text-gray-600 text-sm mb-2">Bukti Pembayaran</p>
                  <img
                    src={payment.proof}
                    alt="Payment proof"
                    className="w-full max-h-96 object-contain rounded-lg cursor-pointer hover:opacity-80 transition-opacity bg-black/10"
                    onClick={() => window.open(payment.proof, '_blank')}
                  />
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
              className="absolute top-4 right-4 dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900"
            >
              <XCircle className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold gradient-text mb-6">Unggah Bukti Pembayaran</h2>
            
            <div className="mb-6 p-4 bg-white/5 rounded-xl">
              <p className="dark:text-white text-gray-900 font-medium">Pesanan #{selectedOrder.id}</p>
              <p className="dark:text-gray-400 text-gray-600 text-sm">Total: Rp {selectedOrder.total.toLocaleString()}</p>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">URL Bukti Pembayaran</label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  className="input-field"
                  placeholder="https://example.com/proof.jpg"
                  required
                />
                <p className="dark:text-gray-500 text-gray-500 text-xs mt-2">Unggah buti pembayaran Anda ke layanan hosting gambar dan tempel URL di sini</p>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Unggah</span>
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
