import { supabase } from '../../lib/supabaseClient';

/**
 * Order Service
 * Handles order-related database operations
 */

export const orderService = {
  /**
   * Get all orders (admin only)
   * @returns {Promise} - Array of orders with items
   */
  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        ),
        users (id, name, email)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  /**
   * Get orders for current user
   * @param {string} userId - User UUID
   * @returns {Promise} - Array of orders with items
   */
  async getUserOrders(userId) {
    console.log('getUserOrders called with userId:', userId);

    if (!userId) {
      console.error('No userId provided');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error in getUserOrders:', error);
        throw error;
      }

      console.log('getUserOrders data:', data);

      if (!data || !Array.isArray(data)) {
        console.log('No orders data or invalid format, returning empty array');
        return [];
      }

      return data;
    } catch (err) {
      console.error('Error in getUserOrders:', err);
      throw err;
    }
  },

  /**
   * Get order by ID
   * @param {string} orderId - Order UUID
   * @returns {Promise} - Order data with items
   */
  async getOrderById(orderId) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('id', orderId)
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Create new order
   * @param {object} orderData - Order data with items
   * @returns {Promise} - Created order data
   */
  async createOrder(orderData) {
    console.log('createOrder called with:', orderData);
    const { items, ...orderInfo } = orderData;

    console.log('Order info:', orderInfo);
    console.log('Items:', items);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderInfo)
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw orderError;
    }

    console.log('Order created:', order);

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    console.log('Order items to insert:', orderItems);

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      throw itemsError;
    }

    console.log('Order items created successfully');

    // Update product stock
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();

      if (product) {
        await supabase
          .from('products')
          .update({ stock: product.stock - item.quantity })
          .eq('id', item.product_id);
      }
    }

    return order;
  },

  /**
   * Update order status (admin only)
   * @param {string} orderId - Order UUID
   * @param {string} status - New status
   * @returns {Promise} - Updated order data
   */
  async updateOrderStatus(orderId, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  /**
   * Delete order (admin only)
   * @param {string} orderId - Order UUID
   * @returns {Promise} - Deletion result
   */
  async deleteOrder(orderId) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
    
    if (error) throw error;
  }
};
