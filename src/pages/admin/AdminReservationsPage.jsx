import React, { useState, useEffect } from 'react';
import { Calendar, Edit, Trash2, X, Scissors, Home } from 'lucide-react';
import { reservationService } from '../../services/supabase';
import { useToast } from '../../context/ToastContext';

const AdminReservationsPage = () => {
  const { success, error } = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [formData, setFormData] = useState({
    status: 'menunggu'
  });

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await reservationService.getAllReservations();
      setReservations(data);
    } catch (err) {
      console.error('Gagal memuat reservasi:', err);
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
      await reservationService.updateReservationStatus(editingReservation.id, formData.status);
      success('Status reservasi berhasil diperbarui');
      setShowModal(false);
      setEditingReservation(null);
      setFormData({ status: 'menunggu' });
      loadReservations();
    } catch (err) {
      console.error('Gagal memperbarui reservasi:', err);
      error('Gagal memperbarui reservasi. Silakan coba lagi.');
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setFormData({ status: reservation.status });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus reservasi ini?')) return;
    
    try {
      await reservationService.deleteReservation(id);
      success('Reservasi berhasil dihapus');
      loadReservations();
    } catch (err) {
      console.error('Gagal menghapus reservasi:', err);
      error('Gagal menghapus reservasi. Silakan coba lagi.');
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
      <h1 className="text-3xl font-bold gradient-text">Manajemen Reservasi</h1>

      {reservations.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <Calendar className="w-16 h-16 dark:text-gray-400 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2">Tidak ada reservasi</h3>
          <p className="dark:text-gray-400 text-gray-600">Reservasi akan muncul di sini</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="glass-dark rounded-2xl p-6 card-hover">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  reservation.service === 'grooming'
                    ? 'bg-primary-500/20'
                    : 'bg-accent-500/20'
                }`}>
                  {reservation.service === 'grooming' ? (
                    <Scissors className="w-7 h-7 text-primary-400" />
                  ) : (
                    <Home className="w-7 h-7 text-accent-400" />
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                  {reservation.status}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-1 capitalize">
                {reservation.service}
              </h3>
              <p className="dark:text-gray-400 text-gray-600 text-sm mb-4">
                ID Pengguna: {reservation.userId} • ID Hewan: {reservation.petId}
              </p>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="dark:text-gray-400 text-gray-600">Tanggal</span>
                  <span className="dark:text-white text-gray-900">{new Date(reservation.date).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="dark:text-gray-400 text-gray-600">Waktu</span>
                  <span className="dark:text-white text-gray-900">{reservation.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="dark:text-gray-400 text-gray-600">Harga</span>
                  <span className="gradient-text font-semibold">Rp {reservation.price.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(reservation)}
                  className="flex-1 btn-secondary flex items-center justify-center space-x-2 text-sm py-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Status</span>
                </button>
                <button
                  onClick={() => handleDelete(reservation.id)}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl py-2 flex items-center justify-center space-x-2 text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
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
              className="absolute top-4 right-4 dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold gradient-text mb-6">Update Status Reservasi</h2>
            
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

export default AdminReservationsPage;
