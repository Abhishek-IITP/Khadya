// app/actions/verifyPhone.ts
'use server';

import { createClient } from '../../auth/server';

export async function markPhoneVerified() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('User not authenticated', authError);
    return { success: false, error: 'User not authenticated' };
  }

  const { error } = await supabase
    .from('UserDet')
    .update({ phoneVerified: true })
    .eq('uid', user.id);

  if (error) {
    console.error('Error updating phone_verified:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
