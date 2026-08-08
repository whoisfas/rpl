import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Upload, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { orderService, paymentService, storageService } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const PaymentDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error, warning } = useToast();

  console.log('PaymentDetailPage mounted');
  console.log('OrderId from params:', orderId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('bca');
  const [proofFile, setProofFile] = useState(null);
  const [existingPayment, setExistingPayment] = useState(null);

  const BCA_ACCOUNT = '7773118550';
  const QRIS_IMAGE = '/qris.jpg'; // Path ke QRIS image di folder gambar

  useEffect(() => {
    loadOrder();
    loadExistingPayment();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      console.error('Gagal memuat pesanan:', err);
      error('Gagal memuat pesanan');
      navigate('/dashboard/orders');
    } finally {
      setLoading(false);
    }
  };

  const loadExistingPayment = async () => {
    try {
      const { data } = await paymentService.getUserPayments(user.id);
      const payment = data?.find(p => p.order_id === orderId);
      if (payment) {
        setExistingPayment(payment);
      }
    } catch (err) {
      console.error('Gagal memuat pembayaran:', err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!proofFile) {
      warning('Silakan pilih bukti pembayaran');
      return;
    }

    setUploading(true);
    try {
      console.log('Starting payment upload...');
      console.log('Order ID:', orderId);
      console.log('User ID:', user.id);
      console.log('File:', proofFile.name);

      // Upload bukti pembayaran ke Supabase Storage
      console.log('Uploading payment proof to storage...');
      const proofUrl = await storageService.uploadPaymentProof(proofFile);
      console.log('Payment proof uploaded successfully:', proofUrl);

      // Create payment record
      console.log('Creating payment record...');
      await paymentService.createPayment({
        order_id: orderId,
        user_id: user.id,
        amount: order.total,
        method: selectedMethod,
        proof: proofUrl,
        status: 'menunggu'
      });
      console.log('Payment record created successfully');

      success('Bukti pembayaran berhasil diunggah. Menunggu konfirmasi admin.');
      navigate('/dashboard/payments');
    } catch (err) {
      console.error('Gagal mengunggah pembayaran:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      error(`Gagal mengunggah pembayaran: ${err.message || err}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="dark:text-gray-400 text-gray-600">Pesanan tidak ditemukan</p>
        <button onClick={() => navigate('/dashboard/orders')} className="btn-primary mt-4">
          Kembali ke Pesanan
        </button>
      </div>
    );
  }

  if (existingPayment) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate('/dashboard/payments')} className="flex items-center space-x-2 dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900">
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali ke Pembayaran</span>
        </button>

        <div className="glass-dark rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-2">Pembayaran Sedang Diproses</h2>
          <p className="dark:text-gray-400 text-gray-600 mb-4">
            Bukti pembayaran Anda telah diunggah dan sedang menunggu konfirmasi dari admin.
          </p>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-full">
            <Clock className="w-4 h-4" />
            <span>Status: {existingPayment.status}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => navigate('/dashboard/orders')} className="flex items-center space-x-2 dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900">
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali ke Pesanan</span>
      </button>

      <h1 className="text-3xl font-bold gradient-text">Pembayaran</h1>

      {/* Order Summary */}
      <div className="glass-dark rounded-2xl p-6">
        <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-4">Ringkasan Pesanan</h2>
        <div className="flex justify-between items-center mb-4">
          <span className="dark:text-gray-400 text-gray-600">Nomor Pesanan</span>
          <span className="dark:text-white text-gray-900 font-medium">#{order.id?.substring(0, 8)}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="dark:text-gray-400 text-gray-600">Total Pembayaran</span>
          <span className="text-2xl font-bold gradient-text">Rp {order.total?.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="glass-dark rounded-2xl p-6">
        <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-4">Pilih Metode Pembayaran</h2>

        <div className="space-y-4">
          {/* Bank BCA */}
          <label
            className={`flex items-center p-4 rounded-xl cursor-pointer transition-colors ${
              selectedMethod === 'bca'
                ? 'bg-primary-500/20 border-2 border-primary-500'
                : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="bca"
              checked={selectedMethod === 'bca'}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="mr-4"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold dark:text-white text-gray-900">Transfer Bank BCA</h3>
              <p className="dark:text-gray-400 text-gray-600 text-sm">Nomor Rekening: {BCA_ACCOUNT}</p>
            </div>
          </label>

          {/* QRIS */}
          <label
            className={`flex items-center p-4 rounded-xl cursor-pointer transition-colors ${
              selectedMethod === 'qris'
                ? 'bg-primary-500/20 border-2 border-primary-500'
                : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="qris"
              checked={selectedMethod === 'qris'}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="mr-4"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold dark:text-white text-gray-900">QRIS</h3>
              <p className="dark:text-gray-400 text-gray-600 text-sm">Scan QR code untuk pembayaran</p>
            </div>
          </label>
        </div>

        {/* QRIS Image Display */}
        {selectedMethod === 'qris' && (
          <div className="mt-6 p-4 bg-white/5 rounded-xl text-center">
            <p className="dark:text-gray-400 text-gray-600 text-sm mb-4">Scan QR Code di bawah ini:</p>
            <img src={QRIS_IMAGE} alt="QRIS" className="max-w-xs mx-auto rounded-lg" />
          </div>
        )}

        {/* BCA Account Display */}
        {selectedMethod === 'bca' && (
          <div className="mt-6 p-4 bg-white/5 rounded-xl">
            <p className="dark:text-gray-400 text-gray-600 text-sm mb-2">Transfer ke rekening BCA:</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold gradient-text">{BCA_ACCOUNT}</span>
              <button
                onClick={() => navigator.clipboard.writeText(BCA_ACCOUNT)}
                className="text-sm dark:text-primary-400 text-primary-600 hover:underline"
              >
                Salin
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Proof Upload */}
      <div className="glass-dark rounded-2xl p-6">
        <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-4">Unggah Bukti Pembayaran</h2>

        <form onSubmit={handleSubmitPayment} className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">
              Bukti Transfer (Screenshot/Photo)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="proof-upload"
              />
              <label
                htmlFor="proof-upload"
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary-500 transition-colors"
              >
                {proofFile ? (
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <p className="dark:text-white text-gray-900 font-medium">{proofFile.name}</p>
                    <p className="dark:text-gray-400 text-gray-600 text-sm">Klik untuk ganti</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 dark:text-gray-400 text-gray-600 mx-auto mb-2" />
                    <p className="dark:text-white text-gray-900 font-medium">Klik untuk upload</p>
                    <p className="dark:text-gray-400 text-gray-600 text-sm">PNG, JPG hingga 5MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>{uploading ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentDetailPage;
