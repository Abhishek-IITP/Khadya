// app/actions/getUserDetails.ts
'use server'

import { createClient } from '@/auth/server'

export async function getUserDetails() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  const { data, error } = await supabase
    .from('UserDet')
    .select('*')
    .eq('uid', user.id)
    .single()

  if (error) return null

  return data
}
