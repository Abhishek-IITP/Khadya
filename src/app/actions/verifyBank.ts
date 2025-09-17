// app/actions/verifyPhone.ts
'use server';

import { createClient } from '../../auth/server';

export async function makeBankVerified() {
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
    .from('BankDet')
    .update({ bankVerified: true })
    .eq('uid', user.id);

  const { error: error2 } = await supabase.from('UserDet').upsert(
    { lastStep: 'bankVerification', uid: user.id },
    { onConflict: 'uid' }
  );


    



  if (error) {
    console.error('Error verifiying bank:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
