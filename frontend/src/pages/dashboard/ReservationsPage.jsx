import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Scissors, Home, X, Edit, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ReservationsPage = () => {
  const { user } = useAuth();
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
  }, []);

  const loadData = async () => {
    try {
      const [reservationsRes, petsRes] = await Promise.all([
        api.get(`/reservations?userId=${user.id}`),
        api.get(`/pets?userId=${user.id}`)
      ]);
      setReservations(reservationsRes.data);
      setPets(petsRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
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
        ...formData,
        userId: user.id,
        price: formData.service === 'grooming' ? 150000 : 300000
      };
      
      if (editingReservation) {
        await api.put(`/reservations/${editingReservation.id}`, reservationData);
      } else {
        await api.post('/reservations', reservationData);
      }
      
      setShowModal(false);
      setEditingReservation(null);
      setFormData({ petId: '', service: 'grooming', date: '', time: '' });
      loadData();
    } catch (err) {
      console.error('Failed to save reservation:', err);
      alert('Failed to save reservation. Please try again.');
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
    if (!window.confirm('Are you sure you want to delete this reservation?')) return;
    
    try {
      await api.delete(`/reservations/${id}`);
      loadData();
    } catch (err) {
      console.error('Failed to delete reservation:', err);
      alert('Failed to delete reservation. Please try again.');
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
        <h1 className="text-3xl font-bold gradient-text">Reservations</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Book Service</span>
        </button>
      </div>

      {reservations.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No reservations yet</h3>
          <p className="text-gray-400 mb-6">Book your first grooming or hotel service</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Book a Service
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
              
              <h3 className="text-xl font-semibold text-white mb-1 capitalize">
                {reservation.service}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {new Date(reservation.date).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Time</span>
                  <span className="text-white">{reservation.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price</span>
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
                  <span>Cancel</span>
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
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold gradient-text mb-6">
              {editingReservation ? 'Edit Reservation' : 'Book Service'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Select Pet</label>
                <select
                  name="petId"
                  value={formData.petId}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Choose a pet</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Service Type</label>
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
                    <span className="text-sm text-white">Grooming</span>
                    <p className="text-xs text-gray-400 mt-1">Rp 150.000</p>
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
                    <span className="text-sm text-white">Pet Hotel</span>
                    <p className="text-xs text-gray-400 mt-1">Rp 300.000</p>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select time</option>
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {editingReservation ? 'Update' : 'Book'}
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
