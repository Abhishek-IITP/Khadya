'use server'

import { createClient } from '@/auth/server'

export async function saveDocumentDetails(formData: FormData) {
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
    gst_number: formData.get("gst_number") as string,
   
  }

  const { error } = await supabase.from("DocumentDet").upsert(payload, {
    onConflict: 'uid' // ensures single entry per user
  })

   const  {error : error2}  = await supabase.from("UserDet").upsert({lastStep : "document", uid: user.id}, {
    onConflict: 'uid' // ensures single entry per user
  })

  if (error) {
    console.error("Insert error:", error.message)
    return { success: false, error: error.message }
  }
if(error2){
    console.error("Update LastStep error:", error2.message);
    return { success: false, error: error2.message }
}
  return { success: true }
}



export async function getUserGstNumber() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null // or throw an error or return { error: 'User not authenticated' }
  }

  const { data, error } = await supabase
    .from('DocumentDet')
    .select('gst_number')
    .eq('uid', user.id)
    .single()

  if (error) {  
    console.log('Error fetching GST number:', error.message)
    return null
  }

  return data?.gst_number || null
}
