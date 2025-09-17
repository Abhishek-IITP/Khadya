import { getUser } from "@/auth/server";
import { NextResponse } from "next/server";
import userInfo from "@/app/(admin)/components/UserInfo";

export async function GET() {
    const user = await getUser();
    const info = userInfo(user); // If userInfo is a function that takes user
    return NextResponse.json({ user, info });
}
