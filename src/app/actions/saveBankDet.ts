'use server'

import { createClient } from '@/auth/server'
import { v4 as uuidv4 } from 'uuid'

export async function saveBankDetails(formData: FormData, existingChequeUrl?: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('User not authenticated', userError);
    return { success: false, error: 'User not authenticated' };
  }

  let cancelledChequeUrl: string | null = null;

  const chequeFile = formData.get('cancelled_cheque_url') as File;

  if (chequeFile && chequeFile.size > 0) {
    const fileExt = chequeFile.name.split('.').pop();
    const filePath = `${user.id}/cancelled-cheques/${uuidv4()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, chequeFile, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('File upload error:', uploadError.message);
      return { success: false, error: 'Failed to upload cancelled cheque' };
    }

    const { data: publicUrlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    cancelledChequeUrl = publicUrlData.publicUrl;
  } else {
    // No new file uploaded, keep existing URL
    cancelledChequeUrl = existingChequeUrl || null;
  }

  const payload = {
    uid: user.id,
    beneficiary_name: formData.get('beneficiary_name') as string,
    account_number: formData.get('account_number') as string,
    bank_name: formData.get('bank_name') as string,
    ifsc_code: formData.get('ifsc_code') as string,
    cancelled_cheque_url: cancelledChequeUrl,
  };

  const { error } = await supabase.from('BankDet').upsert(payload, {
    onConflict: 'uid',
  });

  const { error: error2 } = await supabase.from('UserDet').upsert(
    { lastStep: 'bank', uid: user.id },
    { onConflict: 'uid' }
  );

  if (error) {
    console.error('Insert error:', error.message);
    return { success: false, error: error.message };
  }

  if (error2) {
    console.error('Update LastStep error:', error2.message);
    return { success: false, error: error2.message };
  }

  return { success: true };
}




export async function getBankDet() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  const { data, error } = await supabase
    .from('BankDet')
    .select('*')
    .eq('uid', user.id)
    .single();

    console.log(data);
  if (error) return null

  return data
}