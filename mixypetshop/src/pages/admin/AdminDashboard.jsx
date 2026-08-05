import React, { useState, useEffect } from 'react';
import { Users, Package, Calendar, ShoppingCart, TrendingUp, DollarSign, CreditCard } from 'lucide-react';
import { statsService } from '../../services/supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalReservations: 0,
    totalOrders: 0,
    totalPayments: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await statsService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Gagal memuat statistik:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: 'Total Pengguna', value: stats.totalUsers, color: 'from-primary-500 to-primary-600' },
    { icon: Package, label: 'Produk', value: stats.totalProducts, color: 'from-accent-500 to-accent-600' },
    { icon: Calendar, label: 'Reservasi', value: stats.totalReservations, color: 'from-primary-500 to-accent-500' },
    { icon: ShoppingCart, label: 'Pesanan', value: stats.totalOrders, color: 'from-accent-500 to-primary-500' },
    { icon: CreditCard, label: 'Pembayaran', value: stats.totalPayments, color: 'from-primary-500 to-accent-600' },
    { icon: DollarSign, label: 'Pendapatan', value: `Rp ${stats.totalRevenue.toLocaleString()}`, color: 'from-accent-500 to-primary-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="glass rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Dashboard Admin</span>
          </h1>
          <p className="dark:text-gray-400 text-gray-600">Ringkasan bisnis toko hewan peliharaan Anda</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-dark rounded-2xl p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="dark:text-white text-gray-900 font-semibold mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-dark rounded-2xl p-6">
          <h2 className="text-xl font-bold gradient-text mb-4">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-400" />
                </div>
                <div className="flex-1">
                  <p className="dark:text-white text-gray-900 font-medium">Pesanan Baru #{100 + i}</p>
                  <p className="dark:text-gray-400 text-gray-600 text-sm">Baru saja</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-dark rounded-2xl p-6">
          <h2 className="text-xl font-bold gradient-text mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/admin/products" className="glass p-4 rounded-xl card-hover text-center">
              <Package className="w-8 h-8 text-primary-400 mx-auto mb-2" />
              <p className="dark:text-white text-gray-900 font-medium">Kelola Produk</p>
            </a>
            <a href="/admin/reservations" className="glass p-4 rounded-xl card-hover text-center">
              <Calendar className="w-8 h-8 text-accent-400 mx-auto mb-2" />
              <p className="dark:text-white text-gray-900 font-medium">Reservasi</p>
            </a>
            <a href="/admin/orders" className="glass p-4 rounded-xl card-hover text-center">
              <ShoppingCart className="w-8 h-8 text-primary-400 mx-auto mb-2" />
              <p className="dark:text-white text-gray-900 font-medium">Pesanan</p>
            </a>
            <a href="/admin/users" className="glass p-4 rounded-xl card-hover text-center">
              <Users className="w-8 h-8 text-accent-400 mx-auto mb-2" />
              <p className="dark:text-white text-gray-900 font-medium">Pengguna</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
