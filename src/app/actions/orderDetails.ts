import { createClient } from '@/auth/server';

export async function fetchAllOrders() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Orders")
    .select("*");

  if (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }

  return data;
}
