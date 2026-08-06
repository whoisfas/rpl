import React, { useState, useEffect } from 'react';
import { Newspaper, Edit, Trash2, Plus, X, Upload, CheckCircle } from 'lucide-react';
import { newsService, storageService } from '../../services/supabase';
import { useToast } from '../../context/ToastContext';

const AdminNewsPage = () => {
  const { success, error } = useToast();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: ''
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await newsService.getAllNews();
      setNews(data);
    } catch (err) {
      console.error('Gagal memuat berita:', err);
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

      const newsData = {
        ...formData,
        image_url: imageUrl
      };

      if (editingNews) {
        await newsService.updateNews(editingNews.id, newsData);
        success('Berita berhasil diperbarui');
      } else {
        await newsService.createNews(newsData);
        success('Berita berhasil ditambahkan');
      }

      setShowModal(false);
      setEditingNews(null);
      setImageFile(null);
      setFormData({ title: '', content: '', image_url: '' });
      loadNews();
    } catch (err) {
      console.error('Gagal menyimpan berita:', err);
      error('Gagal menyimpan berita. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      image_url: item.image_url || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    
    try {
      await newsService.deleteNews(id);
      success('Berita berhasil dihapus');
      loadNews();
    } catch (err) {
      console.error('Gagal menghapus berita:', err);
      error('Gagal menghapus berita. Silakan coba lagi.');
    }
  };

  const handleAdd = () => {
    setEditingNews(null);
    setImageFile(null);
    setFormData({ title: '', content: '', image_url: '' });
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
        <h1 className="text-3xl font-bold gradient-text">Manajemen Berita</h1>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Berita</span>
        </button>
      </div>

      {news.length === 0 ? (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <Newspaper className="w-16 h-16 dark:text-gray-400 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2">Tidak ada berita</h3>
          <p className="dark:text-gray-400 text-gray-600">Berita akan muncul di sini</p>
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="glass-dark rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-24 h-24 object-cover rounded-xl" />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-xl flex items-center justify-center">
                      <Newspaper className="w-8 h-8 text-primary-400/50" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-2">{item.title}</h3>
                    <p className="dark:text-gray-400 text-gray-600 text-sm mb-2 line-clamp-2">
                      {item.content}
                    </p>
                    <p className="dark:text-gray-500 text-gray-500 text-xs">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
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
              {editingNews ? 'Edit Berita' : 'Tambah Berita'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Judul</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Konten</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="input-field min-h-[150px]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Gambar Berita</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                    id="news-image-upload"
                  />
                  <label
                    htmlFor="news-image-upload"
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
                    <span>{editingNews ? 'Update' : 'Simpan'}</span>
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

export default AdminNewsPage;
