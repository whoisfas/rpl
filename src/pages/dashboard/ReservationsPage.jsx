import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Scissors, Home, X, Edit, Trash2 } from 'lucide-react';
import { reservationService, petService } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ReservationsPage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [reservations, setReservations] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [formData, setFormData] = useState({
    petId: '',
    service: 'grooming',
    date: '',
    time: ''
  });

  const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
      const [reservationsData, petsData] = await Promise.all([
        reservationService.getUserReservations(user.id),
        petService.getUserPets(user.id)
      ]);
      setReservations(reservationsData);
      setPets(petsData);
    } catch (err) {
      console.error('Gagal memuat data:', err);
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
      const reservationData = {
        pet_id: formData.petId,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        user_id: user.id,
        price: formData.service === 'grooming' ? 150000 : 300000
      };

      if (editingReservation) {
        await reservationService.updateReservation(editingReservation.id, reservationData);
        success('Reservasi berhasil diperbarui');
      } else {
        await reservationService.createReservation(reservationData);
        success('Reservasi berhasil dibuat');
      }

      setShowModal(false);
      setEditingReservation(null);
      setFormData({ petId: '', service: 'grooming', date: '', time: '' });
      loadData();
    } catch (err) {
      console.error('Gagal menyimpan reservasi:', err);
      error(`Gagal menyimpan reservasi: ${err.message || err}`);
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setFormData({
      petId: reservation.petId,
      service: reservation.service,
      date: reservation.date,
      time: reservation.time
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus reservasi ini?')) return;
    
    try {
      await reservationService.deleteReservation(id);
      success('Reservasi berhasil dibatalkan');
      loadData();
    } catch (err) {
      console.error('Gagal menghapus reservasi:', err);
      error('Gagal menghapus reservasi. Silakan coba lagi.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReservation(null);
    setFormData({ petId: '', service: 'grooming', date: '', time: '' });
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold gradient-text">Reservasi</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Booking Layanan</span>
        </button>
      </div>

      {reservations.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 dark:text-gray-400 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2">Belum ada reservasi</h3>
          <p className="dark:text-gray-400 text-gray-600 mb-6">Booking layanan grooming atau hotel pertama Anda</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Booking Layanan
          </button>
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
                {new Date(reservation.date).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              
              <div className="space-y-2 text-sm mb-4">
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
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(reservation.id)}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl py-2 flex items-center justify-center space-x-2 text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Batal</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative glass rounded-2xl p-8 w-full max-w-md">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold gradient-text mb-6">
              {editingReservation ? 'Edit Reservasi' : 'Booking Layanan'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Pilih Hewan</label>
                <select
                  name="petId"
                  value={formData.petId}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Pilih hewan</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Jenis Layanan</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, service: 'grooming' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.service === 'grooming'
                        ? 'border-primary-500 bg-primary-500/20'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Scissors className="w-6 h-6 mx-auto mb-2 text-primary-400" />
                    <span className="text-sm dark:text-white text-gray-900">Grooming</span>
                    <p className="text-xs dark:text-gray-400 text-gray-600 mt-1">Rp 150.000</p>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, service: 'hotel' })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.service === 'hotel'
                        ? 'border-accent-500 bg-accent-500/20'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Home className="w-6 h-6 mx-auto mb-2 text-accent-400" />
                    <span className="text-sm dark:text-white text-gray-900">Hotel Hewan</span>
                    <p className="text-xs dark:text-gray-400 text-gray-600 mt-1">Rp 300.000</p>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Tanggal</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input-field"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Waktu</label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Pilih waktu</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {editingReservation ? 'Update' : 'Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;
