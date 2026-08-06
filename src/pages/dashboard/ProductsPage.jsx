import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import { productService, storageService } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ProductsPage = () => {
  const { user, isAdmin } = useAuth();
  const { success, error } = useToast();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
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
    loadCart();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

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

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const newCart = cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = formData.image;

      // Upload image if file is selected
      if (imageFile) {
        console.log('Uploading product image...', imageFile.name, imageFile.size);
        try {
          imageUrl = await storageService.uploadProductImage(imageFile);
          console.log('Product image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Product image upload failed:', uploadError);
          error(`Gagal upload gambar produk: ${uploadError.message || uploadError}`);
          throw uploadError;
        }
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        image: imageUrl || null
      };

      console.log('Product data to save:', productData);

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        success('Produk berhasil diperbarui');
      } else {
        await productService.createProduct(productData);
        success('Produk berhasil ditambahkan');
      }

      setShowAdminModal(false);
      setEditingProduct(null);
      setImageFile(null);
      setFormData({ name: '', category: 'Kucing', price: '', stock: '', description: '', image: '' });
      loadProducts();
    } catch (err) {
      console.error('Gagal menyimpan produk:', err);
      console.error('Error details:', JSON.stringify(err, null, 2));
      error(`Gagal menyimpan produk: ${err.message || err}`);
    } finally {
      setUploading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setImageFile(null);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      image: product.image
    });
    setShowAdminModal(true);
  };

  const handleDeleteProduct = async (id) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredProducts.length === 0 && (
        <div className="glass-dark rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">📦</span>
          </div>
          <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2">Tidak ada produk</h3>
          <p className="dark:text-gray-400 text-gray-600">Produk akan muncul di sini</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold gradient-text">Produk</h1>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative btn-secondary flex items-center space-x-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Keranjang ({cart.length})</span>
          </button>
          
          {isAdmin && (
            <button
              onClick={() => setShowAdminModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Tambah Produk</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
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

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)}></div>
          <div className="relative glass-dark w-full max-w-md h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">Keranjang Belanja</h2>
              <button onClick={() => setShowCart(false)} className="dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 dark:text-gray-400 text-gray-600 mx-auto mb-4" />
                <p className="dark:text-gray-400 text-gray-600">Keranjang Anda kosong</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-2xl">📦</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="dark:text-white text-gray-900 font-medium truncate">{item.name}</h3>
                        <p className="text-primary-400 font-semibold">Rp {item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          -
                        </button>
                        <span className="dark:text-white text-gray-900 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-white/10 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="dark:text-gray-400 text-gray-600">Total</span>
                    <span className="text-2xl font-bold gradient-text">Rp {cartTotal.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => {
                      window.location.href = '/dashboard/cart';
                    }}
                    className="w-full btn-primary"
                  >
                    Lanjut ke Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="glass-dark rounded-2xl overflow-hidden card-hover">
            <div className="h-48 bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center relative">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">📦</span>
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
              <button
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  product.stock > 0
                    ? 'btn-primary'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? 'Tambah ke Keranjang' : 'Habis'}
              </button>
              
              {isAdmin && (
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-2 text-sm py-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl py-2 flex items-center justify-center space-x-2 text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAdminModal(false)}></div>
          <div className="relative glass rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold gradient-text mb-6">
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h2>
            
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Nama Produk</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field min-h-[80px]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Foto Produk (opsional)</label>
                <div className="relative">
                  <input
                    type="file"
                    id="product-image"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                  />
                  <label
                    htmlFor="product-image"
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
                  onClick={() => setShowAdminModal(false)}
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
                  {uploading ? 'Mengupload...' : (editingProduct ? 'Update' : 'Tambah Produk')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
