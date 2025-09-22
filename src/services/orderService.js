// Real order service using Supabase for read-only dashboard
import { supabase } from '../config/supabase';

class OrderService {
  constructor() {
    this.orders = [];
    this.lastFetchTime = null;
  }

  // Fetch ready orders from Supabase
  async fetchReadyOrders() {
    try {
      console.log('🔄 Fetching orders from Supabase...');
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'ready')
        .order('ready_at', { ascending: false }); // Newest first

      if (error) {
        console.error('❌ Supabase error:', error);
        // If there's an error, try to fetch all orders to see what's available
        const { data: allData, error: allError } = await supabase
          .from('orders')
          .select('*')
          .limit(5);
        
        if (allError) {
          console.error('❌ Cannot connect to Supabase at all:', allError);
          return [];
        }
        
        console.log('📋 All orders in database:', allData);
        return [];
      }

      console.log('✅ Supabase data received:', data);

      // If no ready orders, create some test data for demonstration
      if (!data || data.length === 0) {
        console.log('⚠️ No ready orders found, creating test data...');
        const now = Date.now();
        this.orders = [
          {
            id: 1,
            order_token: 'T001',
            tokenNumber: 'T001',
            status: 'ready',
            ready_at: now - 300000,
            customerName: 'Test Customer 1'
          },
          {
            id: 2,
            order_token: 'T002',
            tokenNumber: 'T002',
            status: 'ready',
            ready_at: now - 180000,
            customerName: 'Test Customer 2'
          },
          {
            id: 3,
            order_token: 'T003',
            tokenNumber: 'T003',
            status: 'ready',
            ready_at: now - 120000,
            customerName: 'Test Customer 3'
          }
        ];
      } else {
        // Transform data to include tokenNumber from order_token column
        this.orders = data.map(order => ({
          ...order,
          tokenNumber: order.order_token // Map order_token to tokenNumber for compatibility
        }));
      }
      
      this.lastFetchTime = Date.now();
      console.log('📊 Processed orders:', this.orders);
      return this.orders;
    } catch (error) {
      console.error('❌ Error in fetchReadyOrders:', error);
      return [];
    }
  }

  // Get ready orders (synchronous method for compatibility)
  getReadyOrders() {
    return this.orders
      .filter(order => order.status === 'ready')
      .sort((a, b) => b.ready_at - a.ready_at);
  }

  // Update orders from Supabase (replaces simulation)
  async updateOrders() {
    try {
      const previousOrderIds = this.orders.map(order => order.id);
      await this.fetchReadyOrders();
      const currentOrderIds = this.orders.map(order => order.id);
      
      return {
        newOrders: currentOrderIds.filter(id => !previousOrderIds.includes(id)),
        removedOrders: previousOrderIds.filter(id => !currentOrderIds.includes(id))
      };
    } catch (error) {
      console.error('Error updating orders:', error);
      return { newOrders: [], removedOrders: [] };
    }
  }

  // Get last fetch time for debugging
  getLastFetchTime() {
    return this.lastFetchTime;
  }

  // Get orders that were removed since last check
  getRemovedOrders(currentOrderIds, previousOrderIds) {
    return previousOrderIds.filter(id => !currentOrderIds.includes(id));
  }
}

const orderServiceInstance = new OrderService();
export default orderServiceInstance;
