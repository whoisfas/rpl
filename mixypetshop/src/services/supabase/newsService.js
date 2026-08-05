import { supabase } from '../../lib/supabaseClient';

/**
 * News Service
 * Handles CRUD operations for news/articles
 */

export const newsService = {
  /**
   * Get all news
   * @returns {Promise} - Array of news
   */
  async getAllNews() {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get news by ID
   * @param {string} id - News ID
   * @returns {Promise} - News object
   */
  async getNewsById(id) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create news
   * @param {Object} newsData - News data
   * @returns {Promise} - Created news
   */
  async createNews(newsData) {
    const { data, error } = await supabase
      .from('news')
      .insert(newsData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update news
   * @param {string} id - News ID
   * @param {Object} newsData - Updated news data
   * @returns {Promise} - Updated news
   */
  async updateNews(id, newsData) {
    const { data, error } = await supabase
      .from('news')
      .update({
        ...newsData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete news
   * @param {string} id - News ID
   * @returns {Promise} - Deleted news
   */
  async deleteNews(id) {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
