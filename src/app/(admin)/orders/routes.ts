// app/api/orders/route.ts
import { fetchAllOrders } from "@/app/actions/orderDetails";
import { NextResponse } from "next/server";

export async function GET() {
  const orders = await fetchAllOrders();
  return NextResponse.json(orders);
}
