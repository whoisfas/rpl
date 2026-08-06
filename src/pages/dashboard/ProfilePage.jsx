import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/supabase';
import { useToast } from '../../context/ToastContext';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedUser = await userService.updateUser(user.id, formData);
      updateUser(updatedUser);
      success('Profil berhasil diperbarui');
      setEditing(false);
    } catch (err) {
      console.error('Gagal memperbarui profil:', err);
      error('Gagal memperbarui profil. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold gradient-text">Profil</h1>

      <div className="glass-dark rounded-2xl p-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold dark:text-white text-gray-900">{user.name}</h2>
              <p className="dark:text-gray-400 text-gray-600">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                {user.role}
              </span>
            </div>
          </div>
          
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Edit className="w-5 h-5" />
              <span>Edit Profil</span>
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Telepon</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">Alamat</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Batal</span>
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="dark:text-gray-400 text-gray-600 text-sm">Nama Lengkap</p>
                <p className="dark:text-white text-gray-900 font-medium">{user.name}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="dark:text-gray-400 text-gray-600 text-sm">Email</p>
                <p className="dark:text-white text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="dark:text-gray-400 text-gray-600 text-sm">Telepon</p>
                <p className="dark:text-white text-gray-900 font-medium">{user.phone || 'Belum diatur'}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="dark:text-gray-400 text-gray-600 text-sm">Alamat</p>
                <p className="dark:text-white text-gray-900 font-medium">{user.address || 'Belum diatur'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="glass-dark rounded-2xl p-6">
        <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-4">Informasi Akun</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-white/10">
            <span className="dark:text-gray-400 text-gray-600">Username</span>
            <span className="dark:text-white text-gray-900">{user.username}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/10">
            <span className="dark:text-gray-400 text-gray-600">Role</span>
            <span className="dark:text-white text-gray-900 capitalize">{user.role}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/10">
            <span className="dark:text-gray-400 text-gray-600">Anggota Sejak</span>
            <span className="dark:text-white text-gray-900">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
