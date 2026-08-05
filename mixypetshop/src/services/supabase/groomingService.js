import { supabase } from '../../lib/supabaseClient';

export const groomingService = {
  // Get all grooming services
  getAllGroomingServices: async () => {
    const { data, error } = await supabase
      .from('grooming_services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get grooming service by ID
  getGroomingServiceById: async (id) => {
    const { data, error } = await supabase
      .from('grooming_services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new grooming service
  createGroomingService: async (serviceData) => {
    const { data, error } = await supabase
      .from('grooming_services')
      .insert([serviceData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update grooming service
  updateGroomingService: async (id, serviceData) => {
    const { data, error } = await supabase
      .from('grooming_services')
      .update(serviceData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete grooming service
  deleteGroomingService: async (id) => {
    const { error } = await supabase
      .from('grooming_services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
