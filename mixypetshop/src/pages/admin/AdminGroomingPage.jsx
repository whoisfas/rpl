import React, { useState, useEffect } from 'react';
import { Scissors, Edit, Trash2, Plus, X, Upload, CheckCircle } from 'lucide-react';
import { groomingService, storageService } from '../../services/supabase';

const AdminGroomingPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image_url: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await groomingService.getAllGroomingServices();
      setServices(data);
    } catch (err) {
      console.error('Gagal memuat layanan grooming:', err);
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
      let imageUrl = formData.image_url;

      // Upload new image if file is selected
      if (imageFile) {
        imageUrl = await storageService.uploadProductImage(imageFile);
      }

      const serviceData = {
        ...formData,
        image_url: imageUrl,
        price: parseFloat(formData.price)
      };

      if (editingService) {
        await groomingService.updateGroomingService(editingService.id, serviceData);
      } else {
        await groomingService.createGroomingService(serviceData);
      }

      setShowModal(false);
      setEditingService(null);
      setImageFile(null);
      setFormData({ name: '', description: '', price: '', duration: '', image_url: '' });
      loadServices();
    } catch (err) {
      console.error('Gagal menyimpan layanan grooming:', err);
      alert('Gagal menyimpan layanan grooming. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration || '',
      image_url: service.image_url || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus layanan ini?')) return;

    try {
      await groomingService.deleteGroomingService(id);
      loadServices();
    } catch (err) {
      console.error('Gagal menghapus layanan:', err);
      alert('Gagal menghapus layanan. Silakan coba lagi.');
    }
  };

  const handleAdd = () => {
    setEditingService(null);
    setImageFile(null);
    setFormData({ name: '', description: '', price: '', duration: '', image_url: '' });
    setShowModal(true);
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
        <h1 className="text-3xl font-bold gradient-text">Manajemen Layanan Grooming</h1>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Layanan</span>
        </button>
      </div>

      {services.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <Scissors className="w-16 h-16 dark:text-gray-400 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2">Tidak ada layanan grooming</h3>
          <p className="dark:text-gray-400 text-gray-600">Layanan grooming akan muncul di sini</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="glass-dark rounded-2xl overflow-hidden card-hover">
              <div className="h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center relative">
                {service.image_url ? (
                  <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                ) : (
                  <Scissors className="w-16 h-16 text-primary-400/50" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-2">{service.name}</h3>
                <p className="dark:text-gray-400 text-gray-600 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold gradient-text">Rp {service.price.toLocaleString()}</span>
                  {service.duration && (
                    <span className="dark:text-gray-400 text-gray-600 text-sm">{service.duration}</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-2 text-sm py-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative glass rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold gradient-text mb-6">
              {editingService ? 'Edit Layanan Grooming' : 'Tambah Layanan Grooming'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Nama Layanan</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field min-h-[100px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Harga</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Durasi (Opsional)</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Contoh: 30 menit, 1 jam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Gambar Layanan</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                    id="grooming-image-upload"
                  />
                  <label
                    htmlFor="grooming-image-upload"
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary-500 transition-colors"
                  >
                    {imageFile ? (
                      <div className="text-center">
                        <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
                        <p className="dark:text-white text-gray-900 font-medium">{imageFile.name}</p>
                        <p className="dark:text-gray-400 text-gray-600 text-sm">Klik untuk ganti</p>
                      </div>
                    ) : formData.image_url ? (
                      <div className="text-center">
                        <img src={formData.image_url} alt="Current" className="w-16 h-16 object-cover rounded-lg mx-auto mb-2" />
                        <p className="dark:text-white text-gray-900 font-medium">Gambar saat ini</p>
                        <p className="dark:text-gray-400 text-gray-600 text-sm">Klik untuk ganti</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-10 h-10 dark:text-gray-400 text-gray-600 mx-auto mb-2" />
                        <p className="dark:text-white text-gray-900 font-medium">Klik untuk upload</p>
                        <p className="dark:text-gray-400 text-gray-600 text-sm">PNG, JPG hingga 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
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
                  disabled={uploading}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <span>{editingService ? 'Update' : 'Simpan'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGroomingPage;
