import React, { useState, useEffect } from 'react';
import { PawPrint, Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import { petService, storageService } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const PetsPage = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Kucing',
    breed: '',
    age: '',
    weight: '',
    image: ''
  });

  useEffect(() => {
    loadPets();
  }, [user]);

  const loadPets = async () => {
    if (!user) return;
    try {
      const data = await petService.getUserPets(user.id);
      setPets(data);
    } catch (err) {
      console.error('Gagal memuat hewan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = formData.image;

      // Upload image if file is selected
      if (imageFile) {
        console.log('Uploading image...', imageFile.name, imageFile.size);
        try {
          imageUrl = await storageService.uploadPetImage(imageFile);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          error(`Gagal upload gambar: ${uploadError.message || uploadError}`);
          throw uploadError;
        }
      }

      const petData = {
        name: formData.name,
        type: formData.type,
        breed: formData.breed || null,
        age: formData.age ? parseInt(formData.age) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        image: imageUrl || null,
        user_id: user.id
      };

      console.log('User ID:', user.id);
      console.log('Pet data to save:', petData);

      if (editingPet) {
        await petService.updatePet(editingPet.id, petData);
        success('Hewan berhasil diperbarui');
      } else {
        await petService.createPet(petData);
        success('Hewan berhasilTambahkan');
      }
      setShowModal(false);
      setEditingPet(null);
      setImageFile(null);
      setFormData({ name: '', type: 'Kucing', breed: '', age: '', weight: '', image: '' });
      loadPets();
    } catch (err) {
      console.error('Gagal menyimpan hewan:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      error(`Gagal menyimpan hewan: ${err.message || err}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      type: pet.type,
      breed: pet.breed || '',
      age: pet.age || '',
      weight: pet.weight || '',
      image: pet.image || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus hewan ini?')) return;
    
    try {
      await petService.deletePet(id);
      success('Hewan berhasil dihapus');
      loadPets();
    } catch (err) {
      console.error('Gagal menghapus hewan:', err);
      error('Gagal menghapus hewan. Silakan coba lagi.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPet(null);
    setImageFile(null);
    setFormData({ name: '', type: 'Kucing', breed: '', age: '', weight: '', image: '' });
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
        <h1 className="text-3xl font-bold gradient-text">Hewan Saya</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Hewan</span>
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-10 h-10 dark:text-gray-400 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2">Belum ada hewan</h3>
          <p className="dark:text-gray-400 text-gray-600 mb-6">Tambahkan hewan pertama Anda untuk memulai</p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Tambah Hewan Pertama
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
                <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2">{pet.name}</h3>
                <div className="space-y-2 text-sm">
                  <p className="dark:text-gray-400 text-gray-600">
                    <span className="dark:text-gray-300 text-gray-700">Jenis:</span> {pet.type}
                  </p>
                  <p className="dark:text-gray-400 text-gray-600">
                    <span className="dark:text-gray-300 text-gray-700">Usia:</span> {pet.age} tahun
                  </p>
                  {pet.breed && (
                    <p className="dark:text-gray-400 text-gray-600">
                      <span className="dark:text-gray-300 text-gray-700">Ras:</span> {pet.breed}
                    </p>
                  )}
                  {pet.weight && (
                    <p className="dark:text-gray-400 text-gray-600">
                      <span className="dark:text-gray-300 text-gray-700">Berat:</span> {pet.weight} kg
                    </p>
                  )}
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
                    <span>Hapus</span>
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
              className="absolute top-4 right-4 dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold gradient-text mb-6">
              {editingPet ? 'Edit Hewan' : 'Tambah Hewan Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Nama Hewan</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Masukkan nama hewan"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Jenis</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="Kucing">Kucing</option>
                  <option value="Anjing">Anjing</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Usia (tahun)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Masukkan usia"
                  required
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Ras</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Masukkan ras hewan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Berat (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Masukkan berat"
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Foto Hewan (opsional)</label>
                <div className="relative">
                  <input
                    type="file"
                    id="pet-image"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor="pet-image"
                    className="flex items-center justify-center space-x-2 w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 cursor-pointer hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                  >
                    <Upload className="w-5 h-5 dark:text-gray-400 text-gray-600" />
                    <span className="dark:text-gray-400 text-gray-600">
                      {imageFile ? imageFile.name : 'Klik untuk upload gambar'}
                    </span>
                  </label>
                </div>
                {imageFile && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="mt-2 text-sm text-red-500 hover:text-red-600"
                    >
                      Hapus gambar
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={uploading}
                  className="flex-1 btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 btn-primary"
                >
                  {uploading ? 'Mengupload...' : (editingPet ? 'Update' : 'Tambah Hewan')}
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
