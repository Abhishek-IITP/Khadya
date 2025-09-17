import { createClient } from "@/auth/server"; // or correct path
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient(); // ⛔ don’t await this
  const { data: orders, error } = await (await supabase).from("orders").select("*");


  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(orders);
}
