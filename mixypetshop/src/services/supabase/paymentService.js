import { supabase } from '../../lib/supabaseClient';

/**
 * Payment Service
 * Handles payment-related database operations
 */

export const paymentService = {
  /**
   * Get all payments (admin only)
   * @returns {Promise} - Array of payments
   */
  async getAllPayments() {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        users (id, name, email),
        orders (id, total, status)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Get payments for current user
   * @param {string} userId - User UUID
   * @returns {Promise} - Array of payments
   */
  async getUserPayments(userId) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        orders (id, total, status)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Get payment by ID
   * @param {string} paymentId - Payment UUID
   * @returns {Promise} - Payment data
   */
  async getPaymentById(paymentId) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        users (id, name, email),
        orders (id, total, status)
      `)
      .eq('id', paymentId)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Create new payment
   * @param {object} paymentData - Payment data
   * @returns {Promise} - Created payment data
   */
  async createPayment(paymentData) {
    const { data, error } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Update payment
   * @param {string} paymentId - Payment UUID
   * @param {object} updates - Fields to update
   * @returns {Promise} - Updated payment data
   */
  async updatePayment(paymentId, updates) {
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', paymentId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Update payment status (admin only)
   * @param {string} paymentId - Payment UUID
   * @param {string} status - New status
   * @returns {Promise} - Updated payment data
   */
  async updatePaymentStatus(paymentId, status) {
    const { data, error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', paymentId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Delete payment (admin only)
   * @param {string} paymentId - Payment UUID
   * @returns {Promise} - Deletion result
   */
  async deletePayment(paymentId) {
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', paymentId);
    
    if (error) throw error;
  }
};
