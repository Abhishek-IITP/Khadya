// pages/api/user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getUser } from "@/auth/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getUser();
   
  console.log("USER", user);    
  if (!user) return res.status(401).json({ user: null });
  return res.status(200).json({ user });
}
