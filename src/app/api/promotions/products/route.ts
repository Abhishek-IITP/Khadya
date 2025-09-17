import { getUser } from "@/auth/server";
import { createClient } from "@/auth/server";
import { NextResponse } from "next/server";

// GET /api/promotions/products - Get all products uploaded by the current seller
export async function GET() {
  const user = await getUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = await createClient();
  // Assuming 'products' table has a 'user_id' or 'seller_id' column
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("userid", user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ products });
}
