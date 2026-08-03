import React, { useState, useEffect } from 'react';
import { Calendar, Edit, Trash2, X, Scissors, Home } from 'lucide-react';
import api from '../../services/api';

const AdminReservationsPage = () => {
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
      const res = await api.get('/reservations');
      setReservations(res.data);
    } catch (err) {
      console.error('Failed to load reservations:', err);
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
      await api.put(`/reservations/${editingReservation.id}`, formData);
      setShowModal(false);
      setEditingReservation(null);
      setFormData({ status: 'menunggu' });
      loadReservations();
    } catch (err) {
      console.error('Failed to update reservation:', err);
      alert('Failed to update reservation. Please try again.');
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setFormData({ status: reservation.status });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reservation?')) return;
    
    try {
      await api.delete(`/reservations/${id}`);
      loadReservations();
    } catch (err) {
      console.error('Failed to delete reservation:', err);
      alert('Failed to delete reservation. Please try again.');
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
      <h1 className="text-3xl font-bold gradient-text">Reservations Management</h1>

      {reservations.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No reservations</h3>
          <p className="text-gray-400">Reservations will appear here</p>
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
                User ID: {reservation.userId} • Pet ID: {reservation.petId}
              </p>
              
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white">{new Date(reservation.date).toLocaleDateString('id-ID')}</span>
                </div>
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
                  <span>Edit Status</span>
                </button>
                <button
                  onClick={() => handleDelete(reservation.id)}
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
            
            <h2 className="text-2xl font-bold gradient-text mb-6">Update Reservation Status</h2>
            
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
                  <option value="dikonfirmasi">Confirmed</option>
                  <option value="selesai">Completed</option>
                  <option value="dibatalkan">Cancelled</option>
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

export default AdminReservationsPage;
