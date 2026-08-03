import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Package, Calendar, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pets: 0,
    orders: 0,
    reservations: 0,
    payments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [petsRes, ordersRes, reservationsRes, paymentsRes] = await Promise.all([
        api.get(`/pets?userId=${user.id}`),
        api.get(`/orders?userId=${user.id}`),
        api.get(`/reservations?userId=${user.id}`),
        api.get(`/payments?userId=${user.id}`)
      ]);
      
      setStats({
        pets: petsRes.data.length,
        orders: ordersRes.data.length,
        reservations: reservationsRes.data.length,
        payments: paymentsRes.data.length
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: PawPrint, label: 'Add Pet', path: '/dashboard/pets', color: 'from-primary-500 to-primary-600' },
    { icon: Package, label: 'Shop Products', path: '/dashboard/products', color: 'from-accent-500 to-accent-600' },
    { icon: Calendar, label: 'Book Service', path: '/dashboard/reservations', color: 'from-primary-500 to-accent-500' },
    { icon: ShoppingCart, label: 'View Cart', path: '/dashboard/cart', color: 'from-accent-500 to-primary-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="glass rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-gray-400">Here's what's happening with your pets today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-dark rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-primary-400" />
            </div>
            <span className="text-2xl font-bold gradient-text">{stats.pets}</span>
          </div>
          <h3 className="text-white font-semibold mb-1">My Pets</h3>
          <p className="text-gray-400 text-sm">Registered pets</p>
        </div>

        <div className="glass-dark rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-accent-400" />
            </div>
            <span className="text-2xl font-bold gradient-text">{stats.orders}</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Orders</h3>
          <p className="text-gray-400 text-sm">Total orders</p>
        </div>

        <div className="glass-dark rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-400" />
            </div>
            <span className="text-2xl font-bold gradient-text">{stats.reservations}</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Reservations</h3>
          <p className="text-gray-400 text-sm">Booked services</p>
        </div>

        <div className="glass-dark rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent-500/20 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-accent-400" />
            </div>
            <span className="text-2xl font-bold gradient-text">{stats.payments}</span>
          </div>
          <h3 className="text-white font-semibold mb-1">Payments</h3>
          <p className="text-gray-400 text-sm">Completed payments</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6 gradient-text">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.path}
                className="glass-dark rounded-2xl p-6 card-hover group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">{action.label}</h3>
                <p className="text-gray-400 text-sm">Quick access</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-dark rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Recent Activity</h2>
        <div className="space-y-4">
          {stats.orders === 0 && stats.reservations === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400">No recent activity</p>
              <p className="text-gray-500 text-sm mt-2">Start by adding a pet or placing an order</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.orders > 0 && (
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-accent-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Recent Order</p>
                    <p className="text-gray-400 text-sm">You have {stats.orders} order(s)</p>
                  </div>
                  <Link to="/dashboard/orders" className="text-primary-400 hover:text-primary-300 text-sm">
                    View
                  </Link>
                </div>
              )}
              {stats.reservations > 0 && (
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">Upcoming Reservation</p>
                    <p className="text-gray-400 text-sm">You have {stats.reservations} reservation(s)</p>
                  </div>
                  <Link to="/dashboard/reservations" className="text-primary-400 hover:text-primary-300 text-sm">
                    View
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
