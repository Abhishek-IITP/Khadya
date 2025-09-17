"use server";

import { createClient } from "@/auth/server";

import { handleError } from "../lib/utils";

export const loginAction = async (
  email: string,
  password: string,
  remember: boolean,
) => {
  try {
    const supabase = await createClient(remember);

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const user = signInData.user;

    if (!user) {
      return { errorMessage: "User not found after login." };
    }

    // 🔍 Check if user exists in UserDet and get userRole
    const { data: userDet, error: fetchError } = await supabase
      .from("UserDet")
      .select("uid, userRole")
      .eq("uid", user.id)
      .single();

    const isFirstLogin = fetchError?.code === "PGRST116"; // "0 rows returned" error

    // Optionally: Insert into UserDet if first login
    if (isFirstLogin) {
      await supabase.from("UserDet").insert([{ uid: user.id, email }]);
    }

    // Get userRole if available
    const userRole = userDet?.userRole ?? null;

    return {
      errorMessage: null,
      isFirstLogin,
      userRole,
    };
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
};

export const logOutAction = async () => {
  try {
    const { auth } = await createClient();

    const { error } = await auth.signOut({});

    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const signupAction = async (email: string, password: string) => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw error;

    const user = data.user;
    const userId = user!.id;

    if (!user || !user.identities || user.identities.length === 0) {
      // Means user already exists
      return { errorMessage: "User already exists. Please login." };
    }

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
