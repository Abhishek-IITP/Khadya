'use server'

import { createClient } from '@/auth/server'

export async function saveSellerDetails(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated", userError)
    return { success: false, error: 'User not authenticated' }
  }

  const payload = {
    uid: user.id,
    email: user.email,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    phone: formData.get("phone") as string,
    lastStep : "sellerDetails"
  }

  const { error } = await supabase.from("UserDet").upsert(payload, {
    onConflict: 'uid' // ensures single entry per user
  })

  if (error) {
    console.error("Insert error:", error.message)
    return { success: false, error: error.message }
  }

  return { success: true }
}
