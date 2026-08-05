import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Calendar, CreditCard, Users, Newspaper, LogOut, Scissors, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Ringkasan' },
    { path: '/admin/create-order', icon: ShoppingCart, label: 'Tambah Pesanan' },
    { path: '/admin/payments', icon: CreditCard, label: 'Konfirmasi Pembayaran' },
    { path: '/admin/news', icon: Newspaper, label: 'Berita' },
    { path: '/admin/grooming', icon: Scissors, label: 'Grooming' },
    { path: '/admin/products', icon: Package, label: 'Produk' },
    { path: '/admin/reservations', icon: Calendar, label: 'Reservasi' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 glass-dark transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link to="/admin" className="flex items-center space-x-2">
              <span className="text-2xl font-bold gradient-text">Mixy</span>
              <span className="text-2xl font-light text-white">Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-white border border-primary-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-4 px-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-red-500/20 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="glass-dark border-b border-white/10 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-xl font-semibold gradient-text hidden lg:block">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                View Customer Dashboard
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
