// app/user-onboarding/UserOnboardingClient.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { CoreProductInfoForm } from '../_components/coreProductInfo';
import { MaleClothingInfoForm } from '../_components/maleClothingInfo';
import { SellerDetailsForm } from '../_components/sellerDetails';
import { useSearchParams } from 'next/navigation';
import { DocumentsInfo } from '../_components/documentsInfo';
import { PickupAddressInfo } from '../_components/pickupAddressInfo';
import { BankDetailsInfo } from '../_components/bankDetailsInfo';
import { BankVerificationInfo } from '../_components/bankVerificationInfo';

const steps = [
  "Seller Details",
  "Documents",
  "Pickup Address",
  "Bank Details",
  "Bank Verification"
];


type UserOnboardingClientProps = {
  existingUserDetails: {
    first_name: string;
    last_name: string;
    company: string;
    email: string;
    phone: string;
    lastStep: string;
        phoneVerified: boolean;
  } | null;
  gst_number : string;
  pickupDetails: {


    unit_number : string;
    building_name : string;
    road_name : string;
    area : string;
    city : string;
    state : string;
    country : string;
    pincode : string;
  } | null;

  bankDetail : {
beneficiary_name : string;
account_number : string;
bank_name : string;
ifsc_code : string;
cancelled_cheque_url : string;
  } | null;
  
};



const stepIndexMap: Record<string, number> = {
  userDetails: 1,
  documents: 2,
  pickupAddress: 3,
  bankDetails: 4,
  bankVerification: 5,
};



export default function UserOnboardingClient({existingUserDetails, gst_number, pickupDetails, bankDetail} : UserOnboardingClientProps) {
  const searchParams = useSearchParams();
console.log("GST NUMBER FROM USERONBOARD");
  console.log(gst_number);
  const [step, setStep] = useState(0);

useEffect(() => {
  const stepFromUrl = parseInt(searchParams.get("step") || "", 10);

  if (!isNaN(stepFromUrl)) {
    setStep(stepFromUrl);
  } else if (!existingUserDetails || !existingUserDetails.lastStep) {
    setStep(0);
  } else {
    const index = stepIndexMap[existingUserDetails.lastStep] || 0;
    setStep(index);
  }
}, [searchParams, existingUserDetails]);


  const [formData, setFormData] = useState({ brand: '', category: '', gender: '', productType: '', fabric: '', fit: '', length: '', neck: '', pattern: '', washCare: '', netQuantity: '', countryOfOrigin: '', manufacturerName: '', manufacturerAddress: '', hsnCode: '', dimensions: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else alert("Form Submitted: " + JSON.stringify(formData, null, 2));
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl text-white font-bold mb-4">User Onboarding</h1>
      <div className="flex space-x-2 mb-6">
        {steps.map((s, i) => (
          <button
            key={i}
           
            className={`px-4 py-2 rounded ${step === i ? 'bg-primary text-white' : 'bg-primary bg-opacity-55'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {step === 0 && <SellerDetailsForm  goToNextStep={handleNext} existingData={existingUserDetails} />}
        {step === 1 && <DocumentsInfo goToNextStep={handleNext} existingData={existingUserDetails} gst_number={gst_number} />}
        {step === 2 && <PickupAddressInfo goToNextStep={handleNext} existingData={existingUserDetails} pickupDetails={pickupDetails} />}
        {step === 3 && <BankDetailsInfo goToNextStep={handleNext} bankDetail={bankDetail}/>}
        {step === 4 && <BankVerificationInfo />}
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={handlePrev} disabled={step === 0} className="bg-primary text-white px-4 py-2 rounded">Previous</button>
      
      </div>
    </div>
  );
}
