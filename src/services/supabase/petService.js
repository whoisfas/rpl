import { supabase } from '../../lib/supabaseClient';

/**
 * Pet Service
 * Handles pet-related database operations
 */

export const petService = {
  /**
   * Get all pets for a user
   * @param {string} userId - User UUID
   * @returns {Promise} - Array of pets
   */
  async getUserPets(userId) {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Get pet by ID
   * @param {string} petId - Pet UUID
   * @returns {Promise} - Pet data
   */
  async getPetById(petId) {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', petId)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Create new pet
   * @param {object} petData - Pet data
   * @returns {Promise} - Created pet data
   */
  async createPet(petData) {
    const { data, error } = await supabase
      .from('pets')
      .insert(petData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Update pet
   * @param {string} petId - Pet UUID
   * @param {object} updates - Fields to update
   * @returns {Promise} - Updated pet data
   */
  async updatePet(petId, updates) {
    const { data, error } = await supabase
      .from('pets')
      .update(updates)
      .eq('id', petId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Delete pet
   * @param {string} petId - Pet UUID
   * @returns {Promise} - Deletion result
   */
  async deletePet(petId) {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', petId);
    
    if (error) throw error;
  }
};
