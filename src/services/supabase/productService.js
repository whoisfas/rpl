import { supabase } from '../../lib/supabaseClient';

/**
 * Product Service
 * Handles product-related database operations
 */

export const productService = {
  /**
   * Get all products
   * @returns {Promise} - Array of products
   */
  async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Get product by ID
   * @param {string} productId - Product UUID
   * @returns {Promise} - Product data
   */
  async getProductById(productId) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Get products by category
   * @param {string} category - Product category (Kucing, Anjing)
   * @returns {Promise} - Array of products
   */
  async getProductsByCategory(category) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Create new product (admin only)
   * @param {object} productData - Product data
   * @returns {Promise} - Created product data
   */
  async createProduct(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Update product (admin only)
   * @param {string} productId - Product UUID
   * @param {object} updates - Fields to update
   * @returns {Promise} - Updated product data
   */
  async updateProduct(productId, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Delete product (admin only)
   * @param {string} productId - Product UUID
   * @returns {Promise} - Deletion result
   */
  async deleteProduct(productId) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    
    if (error) throw error;
  },

  /**
   * Update product stock
   * @param {string} productId - Product UUID
   * @param {number} quantity - Quantity to subtract
   * @returns {Promise} - Updated product data
   */
  async updateStock(productId, quantity) {
    const { data, error } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();
    
    if (error) throw error;
    
    const newStock = Math.max(0, data.stock - quantity);
    
    const { data: updatedData, error: updateError } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', productId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    return updatedData;
  }
};
