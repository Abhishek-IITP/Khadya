'use server'

import { createClient } from '@/auth/server'

export async function savePickupDetails(formData: FormData) {
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
unit_number : formData.get("unit_number") as string,
building_name : formData.get("building_name") as string,
road_name : formData.get("road_name") as string,
area : formData.get("area") as string,
city : formData.get("city") as string,
state : formData.get("state") as string,
country : formData.get("country") as string,
pincode : formData.get("pincode") as string,



   
  }

  const { error } = await supabase.from("PickupDet").upsert(payload, {
    onConflict: 'uid' // ensures single entry per user
  })

   const  {error : error2}  = await supabase.from("UserDet").upsert({lastStep : "pickup", uid: user.id}, {
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



export async function getpickupDet() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  const { data, error } = await supabase
    .from('PickupDet')
    .select('*')
    .eq('uid', user.id)
    .single()

  if (error) return null

  return data
}