// import * as logos from "@/assets/logos";
import { createClient } from "@/auth/server";

type Order = {
  id: number;
  customer_email: string;
  customer_name: string;
  order_status: string;
  total_amount: number;
  order_number: string;
  created_at: string;
  items: { name: string; quantity: number }[];
};

export async function getOrdersOverviewData() {
  try {
    // Get real orders data to calculate statistics
    const orders: Order[] = await getOrdersData();
    
    // Calculate overview statistics from real data
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.total_amount, 0);
    const deliveredOrders = orders.filter((order: Order) => order.order_status.toLowerCase() === 'delivered').length;
    const pendingOrders = orders.filter((order: Order) => 
      ['pending', 'shipped', 'processing'].includes(order.order_status.toLowerCase())
    ).length;

    // For growth rates, you might want to compare with previous period data
    // For now, using placeholder growth rates - you can enhance this later
    return {
      totalOrders,
      ordersGrowthRate: 12.5, // You can calculate this by comparing with previous period
      totalRevenue: Math.round(totalRevenue),
      revenueGrowthRate: 8.3, // You can calculate this by comparing with previous period
      deliveredOrders,
      deliveredGrowthRate: 15.2, // You can calculate this by comparing with previous period
      pendingOrders,
      pendingGrowthRate: -3.1, // You can calculate this by comparing with previous period
    };
  } catch (error) {
    console.error('Error fetching orders overview data:', error);
    
    // Return default values in case of error
    return {
      totalOrders: 0,
      ordersGrowthRate: 0,
      totalRevenue: 0,
      revenueGrowthRate: 0,
      deliveredOrders: 0,
      deliveredGrowthRate: 0,
      pendingOrders: 0,
      pendingGrowthRate: 0,
    };
  }
}

export async function getOrdersData(): Promise<Order[]> {
  try {
    // Use Supabase client directly instead of fetch to avoid URL parsing issues
    const supabase = await createClient();
    const { data: orders, error } = await supabase.from("orders").select("*");

    if (error) {
      console.error('Error fetching orders from Supabase:', error);
      return [];
    }

    if (!orders) {
      return [];
    }

    // Transform the data to match our expected format if needed
    return orders.map((order: any): Order => ({
      id: order.id || 0,
      customer_email: order.customer_email || order.email || '',
      customer_name: order.customer_name || order.name || `Customer ${order.id}`,
      order_status: order.order_status || order.status || 'pending',
      total_amount: parseFloat(order.total_amount) || parseFloat(order.amount) || 0,
      order_number: order.order_number || order.number || `ORD-${order.id}`,
      created_at: order.created_at || new Date().toISOString(),
      items: Array.isArray(order.items) ? order.items : []
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    
    // Return empty array in case of error
    return [];
  }
}






