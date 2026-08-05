import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, X, Search, Filter } from 'lucide-react';
import { productService } from '../../services/supabase';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Kucing',
    price: '',
    stock: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
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
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };
      
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
      } else {
        await productService.createProduct(productData);
      }
      
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', category: 'Kucing', price: '', stock: '', description: '', image: '' });
      loadProducts();
    } catch (err) {
      console.error('Gagal menyimpan produk:', err);
      alert('Gagal menyimpan produk. Silakan coba lagi.');
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
      image: product.image
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    
    try {
      await productService.deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error('Gagal menghapus produk:', err);
      alert('Gagal menghapus produk. Silakan coba lagi.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: '', category: 'Kucing', price: '', stock: '', description: '', image: '' });
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
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <Package className="w-16 h-16 text-primary-400/50" />
              )}
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
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">URL Gambar</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="input-field"
                />
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
                  {editingProduct ? 'Update' : 'Tambah Produk'}
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
