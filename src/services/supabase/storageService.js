import { supabase } from '../../lib/supabaseClient';

/**
 * Storage Service
 * Handles file uploads to Supabase Storage
 */

const BUCKETS = {
  PRODUCTS: 'products',
  PETS: 'pets',
  PAYMENTS: 'payments'
};

export const storageService = {
  /**
   * Upload image to storage
   * @param {File} file - File to upload
   * @param {string} bucket - Bucket name
   * @param {string} folder - Folder path within bucket
   * @returns {Promise} - Public URL of uploaded file
   */
  async uploadImage(file, bucket = BUCKETS.PRODUCTS, folder = '') {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;
      
      // Upload file
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  /**
   * Delete image from storage
   * @param {string} url - Public URL of file to delete
   * @param {string} bucket - Bucket name
   * @returns {Promise} - Deletion result
   */
  async deleteImage(url, bucket = BUCKETS.PRODUCTS) {
    try {
      // Extract path from URL
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf(bucket) + 1).join('/');
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  /**
   * Upload product image
   * @param {File} file - Product image file
   * @returns {Promise} - Public URL
   */
  async uploadProductImage(file) {
    return this.uploadImage(file, BUCKETS.PRODUCTS, 'products');
  },

  /**
   * Upload pet image
   * @param {File} file - Pet image file
   * @returns {Promise} - Public URL
   */
  async uploadPetImage(file) {
    return this.uploadImage(file, BUCKETS.PETS, 'pets');
  },

  /**
   * Upload payment proof
   * @param {File} file - Payment proof file
   * @returns {Promise} - Public URL
   */
  async uploadPaymentProof(file) {
    return this.uploadImage(file, BUCKETS.PAYMENTS, 'proofs');
  }
};
