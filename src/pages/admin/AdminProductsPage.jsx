import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, X, Search, Filter, Upload, CheckCircle } from 'lucide-react';
import { productService, storageService } from '../../services/supabase';
import { useToast } from '../../context/ToastContext';

const AdminProductsPage = () => {
  const { success, error } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Kucing',
    price: '',
    stock: '',
    description: '',
    image: '',
    is_premium: false
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      console.log('Products loaded:', data);
      console.log('Product images:', data.map(p => p.image));
      setProducts(data);
    } catch (err) {
      console.error('Gagal memuat produk:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = formData.image;

      // Upload new image if file is selected
      if (imageFile) {
        imageUrl = await storageService.uploadProductImage(imageFile);
      }

      const productData = {
        ...formData,
        image: imageUrl,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        is_premium: formData.is_premium
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        success('Produk berhasil diperbarui');
      } else {
        await productService.createProduct(productData);
        success('Produk berhasil ditambahkan');
      }

      setShowModal(false);
      setEditingProduct(null);
      setImageFile(null);
      setFormData({ name: '', category: 'Kucing', price: '', stock: '', description: '', image: '', is_premium: false });
      loadProducts();
    } catch (err) {
      console.error('Gagal menyimpan produk:', err);
      error('Gagal menyimpan produk. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      image: product.image,
      is_premium: product.is_premium || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    
    try {
      await productService.deleteProduct(id);
      success('Produk berhasil dihapus');
      loadProducts();
    } catch (err) {
      console.error('Gagal menghapus produk:', err);
      error('Gagal menghapus produk. Silakan coba lagi.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setImageFile(null);
    setFormData({ name: '', category: 'Kucing', price: '', stock: '', description: '', image: '', is_premium: false });
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold gradient-text">Manajemen Produk</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Produk</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 dark:text-gray-400 text-gray-600" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 dark:text-gray-400 text-gray-600" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">Semua Kategori</option>
            <option value="Kucing">Kucing</option>
            <option value="Anjing">Anjing</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="glass-dark rounded-2xl overflow-hidden card-hover">
            <div className="h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center relative">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover img-loading"
                  loading="lazy"
                  onLoad={(e) => {
                    e.target.classList.remove('img-loading');
                    e.target.classList.add('img-loaded');
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <Package className="w-16 h-16 text-primary-400/50" style={{ display: product.image ? 'none' : 'block' }} />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.stock > 0
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {product.stock > 0 ? `${product.stock} tersedia` : 'Habis'}
                </span>
              </div>
            </div>
            <div className="p-6">
              <span className="text-xs text-primary-400 font-medium">{product.category}</span>
              <h3 className="text-lg font-semibold dark:text-white text-gray-900 mb-2">{product.name}</h3>
              <p className="dark:text-gray-400 text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold gradient-text">Rp {product.price.toLocaleString()}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="flex-1 btn-secondary flex items-center justify-center space-x-2 text-sm py-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative glass rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold gradient-text mb-6">
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Nama Produk</label>
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
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Kategori</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="Kucing">Kucing</option>
                  <option value="Anjing">Anjing</option>
                </select>
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
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Stok</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="input-field"
                  required
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field min-h-[80px]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Gambar Produk</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                    id="product-image-upload"
                  />
                  <label
                    htmlFor="product-image-upload"
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-primary-500 transition-colors"
                  >
                    {imageFile ? (
                      <div className="text-center">
                        <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
                        <p className="dark:text-white text-gray-900 font-medium">{imageFile.name}</p>
                        <p className="dark:text-gray-400 text-gray-600 text-sm">Klik untuk ganti</p>
                      </div>
                    ) : formData.image ? (
                      <div className="text-center">
                        <img src={formData.image} alt="Current" className="w-16 h-16 object-cover rounded-lg mx-auto mb-2" />
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

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_premium"
                    checked={formData.is_premium}
                    onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium dark:text-gray-300 text-gray-700">Tampilkan sebagai Produk Premium di halaman utama</span>
                </label>
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
                  disabled={uploading}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <span>{editingProduct ? 'Update' : 'Tambah Produk'}</span>
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

export default AdminProductsPage;
