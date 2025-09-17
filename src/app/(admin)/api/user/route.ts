import { getUser } from "@/auth/server";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  console.log(user);
  return NextResponse.json({ user });
}
