import { getUser } from "@/auth/server";
import { createClient } from "@/auth/server";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  const supabase = await createClient();

  // Fetch bank details for the user using uid as foreign key
  let bank = null;
  let pickup = null;
  if (user?.id) {
    const { data: bankData, error: bankError } = await supabase
      .from("BankDet")
      .select("*")
      .eq("uid", user.id)
      .single();
    if (!bankError) bank = bankData;

    const { data: pickupData, error: pickupError } = await supabase
      .from("PickupDet")
      .select("*")
      .eq("uid", user.id)
      .single();
    if (!pickupError) pickup = pickupData;
  }

  return NextResponse.json({ user, bank, pickup });
}