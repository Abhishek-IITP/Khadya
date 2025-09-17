import { getUser } from "@/auth/server";
import { createClient } from "@/auth/server";
import { NextResponse } from "next/server";

// GET /api/products/[id] - Get individual product details by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await createClient();
  
  const { data: product, error } = await supabase
    .from("products")
    .select("*") // Select all fields to get complete product details
    .eq("id", id)
    .eq("userid", user.id) // Ensure user can only access their own products
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

