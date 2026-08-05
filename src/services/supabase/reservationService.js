import { supabase } from '../../lib/supabaseClient';

/**
 * Reservation Service
 * Handles reservation-related database operations
 */

export const reservationService = {
  /**
   * Get all reservations (admin only)
   * @returns {Promise} - Array of reservations
   */
  async getAllReservations() {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        users (id, name, email),
        pets (id, name, type)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Get reservations for current user
   * @param {string} userId - User UUID
   * @returns {Promise} - Array of reservations
   */
  async getUserReservations(userId) {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        pets (id, name, type)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Get reservation by ID
   * @param {string} reservationId - Reservation UUID
   * @returns {Promise} - Reservation data
   */
  async getReservationById(reservationId) {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        users (id, name, email),
        pets (id, name, type)
      `)
      .eq('id', reservationId)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Create new reservation
   * @param {object} reservationData - Reservation data
   * @returns {Promise} - Created reservation data
   */
  async createReservation(reservationData) {
    const { data, error } = await supabase
      .from('reservations')
      .insert(reservationData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Update reservation
   * @param {string} reservationId - Reservation UUID
   * @param {object} updates - Fields to update
   * @returns {Promise} - Updated reservation data
   */
  async updateReservation(reservationId, updates) {
    const { data, error } = await supabase
      .from('reservations')
      .update(updates)
      .eq('id', reservationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Update reservation status (admin only)
   * @param {string} reservationId - Reservation UUID
   * @param {string} status - New status
   * @returns {Promise} - Updated reservation data
   */
  async updateReservationStatus(reservationId, status) {
    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', reservationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Delete reservation
   * @param {string} reservationId - Reservation UUID
   * @returns {Promise} - Deletion result
   */
  async deleteReservation(reservationId) {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', reservationId);
    
    if (error) throw error;
  }
};
