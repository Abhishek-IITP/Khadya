"use server";
import { createServerClient } from "@supabase/ssr";

import { cookies } from "next/headers";

export async function createClient(remeberMe = false) {
  const cookieStore = await cookies();

  const client = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const maxAge = remeberMe ? 60 * 60 * 24 * 30 : undefined;
              cookieStore.set(name, value, {
                ...options,
                maxAge: maxAge,
              });
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );

  return client;
}

export async function getUser() {
  const supabase = await createClient();

  const userObject = await supabase.auth.getUser();

  if (userObject.error) {
    console.log("Error getting user", userObject.error);
    return null;
  }

  const user = userObject.data.user;

  // Fetch the user's name from UserDet table
  const { data: userDet, error: userDetError } = await supabase
    .from("UserDet")
    .select(`first_name, last_name, userRole`)
    .eq("uid", user.id)
    .single();

  if (userDetError) {
    console.log("Error fetching user details:", userDetError);
    return null;
  }

  // Return an extended user object with name
  return {
    ...user,
    firstName: userDet.first_name, // dynamically added field
    lastName: userDet.last_name,
    userRole: userDet.userRole, // dynamically added field
  };
}
