import { supabase } from '../../lib/supabaseClient';

/**
 * Statistics Service
 * Handles dashboard statistics aggregation
 */

export const statsService = {
  /**
   * Get dashboard statistics
   * @returns {Promise} - Statistics object
   */
  async getDashboardStats() {
    // Get total users
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (usersError) throw usersError;
    
    // Get total products
    const { count: totalProducts, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (productsError) throw productsError;
    
    // Get total reservations
    const { count: totalReservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true });
    
    if (reservationsError) throw reservationsError;
    
    // Get total orders
    const { count: totalOrders, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    if (ordersError) throw ordersError;
    
    // Get total payments
    const { count: totalPayments, error: paymentsError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true });

    if (paymentsError) throw paymentsError;

    // Get pending payments count
    const { count: pendingPayments, error: pendingPaymentsError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'menunggu');

    if (pendingPaymentsError) throw pendingPaymentsError;

    // Get total revenue (sum of completed orders)
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('total')
      .eq('status', 'selesai');
    
    if (revenueError) throw revenueError;
    
    const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;
    
    // Get recent orders
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from('orders')
      .select(`
        *,
        users (name)
      `)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentOrdersError) throw recentOrdersError;
    
    return {
      totalUsers: totalUsers || 0,
      totalProducts: totalProducts || 0,
      totalReservations: totalReservations || 0,
      totalOrders: totalOrders || 0,
      totalPayments: totalPayments || 0,
      pendingPayments: pendingPayments || 0,
      totalRevenue,
      recentOrders: recentOrders || []
    };
  },

  /**
   * Get order statistics by status
   * @returns {Promise} - Order status statistics
   */
  async getOrderStats() {
    const { data, error } = await supabase
      .from('orders')
      .select('status')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const stats = {
      menunggu: 0,
      dikonfirmasi: 0,
      selesai: 0,
      dibatalkan: 0
    };
    
    data.forEach(order => {
      if (stats[order.status] !== undefined) {
        stats[order.status]++;
      }
    });
    
    return stats;
  },

  /**
   * Get reservation statistics by status
   * @returns {Promise} - Reservation status statistics
   */
  async getReservationStats() {
    const { data, error } = await supabase
      .from('reservations')
      .select('status')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const stats = {
      menunggu: 0,
      dikonfirmasi: 0,
      selesai: 0,
      dibatalkan: 0
    };
    
    data.forEach(reservation => {
      if (stats[reservation.status] !== undefined) {
        stats[reservation.status]++;
      }
    });
    
    return stats;
  }
};
