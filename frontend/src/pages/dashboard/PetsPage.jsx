import React, { useState, useEffect } from 'react';
import { PawPrint, Plus, Edit, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PetsPage = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Kucing',
    age: '',
    gender: 'jantan',
    health: 'Sehat',
    image: ''
  });

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const res = await api.get(`/pets?userId=${user.id}`);
      setPets(res.data);
    } catch (err) {
      console.error('Failed to load pets:', err);
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
      const petData = { ...formData, userId: user.id, age: parseInt(formData.age) };
      if (editingPet) {
        await api.put(`/pets/${editingPet.id}`, petData);
      } else {
        await api.post('/pets', petData);
      }
      setShowModal(false);
      setEditingPet(null);
      setFormData({ name: '', type: 'Kucing', age: '', gender: 'jantan', health: 'Sehat', image: '' });
      loadPets();
    } catch (err) {
      console.error('Failed to save pet:', err);
      alert('Failed to save pet. Please try again.');
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      type: pet.type,
      age: pet.age,
      gender: pet.gender,
      health: pet.health,
      image: pet.image || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;
    
    try {
      await api.delete(`/pets/${id}`);
      loadPets();
    } catch (err) {
      console.error('Failed to delete pet:', err);
      alert('Failed to delete pet. Please try again.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPet(null);
    setFormData({ name: '', type: 'Kucing', age: '', gender: 'jantan', health: 'Sehat', image: '' });
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
        <h1 className="text-3xl font-bold gradient-text">My Pets</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Pet</span>
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No pets yet</h3>
          <p className="text-gray-400 mb-6">Add your first pet to get started</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div key={pet.id} className="glass-dark rounded-2xl overflow-hidden card-hover">
              <div className="h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                {pet.image ? (
                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                ) : (
                  <PawPrint className="w-20 h-20 text-primary-400/50" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{pet.name}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-400">
                    <span className="text-gray-300">Type:</span> {pet.type}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-gray-300">Age:</span> {pet.age} years
                  </p>
                  <p className="text-gray-400">
                    <span className="text-gray-300">Gender:</span> {pet.gender}
                  </p>
                  <p className="text-gray-400">
                    <span className="text-gray-300">Health:</span> {pet.health}
                  </p>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(pet)}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(pet.id)}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl py-2 flex items-center justify-center space-x-2 text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
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
              {editingPet ? 'Edit Pet' : 'Add New Pet'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pet Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter pet name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="Kucing">Cat</option>
                  <option value="Anjing">Dog</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Age (years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter age"
                  required
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="jantan">Male</option>
                  <option value="betina">Female</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Health Status</label>
                <select
                  name="health"
                  value={formData.health}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="Sehat">Healthy</option>
                  <option value="Sakit">Sick</option>
                  <option value="Pemulihan">Recovering</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL (optional)</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
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
                  {editingPet ? 'Update' : 'Add Pet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetsPage;
