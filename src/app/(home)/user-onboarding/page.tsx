// app/user-onboarding/page.tsx
import { Suspense } from 'react';
import UserOnboardingClient from './_components/UserOnBoardingPage';
import { getUserDetails } from '@/app/actions/getUserDetails';
import { getUserGstNumber } from '@/app/actions/saveDocumentDet';
import { getpickupDet } from '@/app/actions/savePickUpDet';
import { getBankDet } from '@/app/actions/saveBankDet';

export default async function Page() {
   const userDetails = await getUserDetails();
   const gst_number = await getUserGstNumber();
   const pickupDet = await getpickupDet();
   const bankDetails = await getBankDet();
   
  return (
    <Suspense fallback={<div className="text-white p-6">Loading...</div>}>
      <UserOnboardingClient existingUserDetails = {userDetails} gst_number={gst_number} pickupDetails={pickupDet} bankDetail={bankDetails} />
    </Suspense>
  );
}
