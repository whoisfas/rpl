import { supabase } from '../../lib/supabaseClient';

/**
 * User Service
 * Handles user-related database operations
 */

export const userService = {
  /**
   * Get user profile by ID
   * @param {string} userId - User UUID
   * @returns {Promise} - User profile data
   */
  async getUserById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get all users (admin only)
   * @returns {Promise} - Array of users
   */
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Update user profile
   * @param {string} userId - User UUID
   * @param {object} updates - Fields to update
   * @returns {Promise} - Updated user data
   */
  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Delete user (admin only)
   * @param {string} userId - User UUID
   * @returns {Promise} - Deletion result
   */
  async deleteUser(userId) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
  },

  /**
   * Check if user is admin
   * @param {string} userId - User UUID
   * @returns {Promise} - Boolean indicating if user is admin
   */
  async isAdmin(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data?.role === 'admin';
  }
};
