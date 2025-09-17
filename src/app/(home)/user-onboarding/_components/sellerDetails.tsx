"use client";

import { useState } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { showErrorToast, showSuccessToast } from "@/app/(admin)/lib/toast-utils";

import { saveSellerDetails } from "@/app/actions/saveUserDet";
import { markPhoneVerified } from "@/app/actions/verifyPhone";



type SellerDetailsFormProps = {
  goToNextStep: () => void;
  existingData?: {
    first_name: string;
    last_name: string;
    company: string;
    email: string;
    phone: string;
    phoneVerified: boolean;
    lastStep : string;
  } | null;
};


export function SellerDetailsForm({goToNextStep, existingData} : SellerDetailsFormProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState<"pending" | "verified" | "failed">("pending");


    const [formState, setFormState] = useState({
    first_name: existingData?.first_name || '',
    last_name: existingData?.last_name || '',
    company_name: existingData?.company || '',
    email: existingData?.email || '',
    phone: existingData?.phone || '',
  });

  const isValidPhoneNumber = (phone: string) => {
  const phoneRegex = /^\+\d{10,15}$/;
  return phoneRegex.test(phone);
};



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();



    if (!isValidPhoneNumber(formState.phone)) {
    showErrorToast("Please enter a valid phone number with country code. E.g., +918727641290");
    return;
  }


  const formData = new FormData();
  formData.set("first_name", formState.first_name);
  formData.set("last_name", formState.last_name);
  formData.set("company", formState.company_name);
  formData.set("email", formState.email);
  formData.set("phone", formState.phone);
    const res = await saveSellerDetails(formData);

    if (!res.success) {
      alert("Error saving details: " + res.error);
      return;
    }


      if (
    existingData?.phone === formState.phone &&
    existingData?.phoneVerified === true
  ) {
    goToNextStep();
    return;
  }


    const confirmSend = window.confirm("Please confirm your phone number. An OTP will be sent to the number provided.");
    if (confirmSend) {
      showSuccessToast("6-digit OTP sent to your mobile number.");
      setModalOpen(true);
    }
  };

  const handleVerify = async  () => {
  
    if (otp === "123456") {
      setVerified("verified");
        const res = await markPhoneVerified();
      setModalOpen(false);
     goToNextStep();
    } else {
      setVerified("failed");
    }
  };

  return (
    <ShowcaseSection title="Seller Details" className="!p-6.5">
      <form onSubmit={handleSubmit}>
     <InputGroup
  label="First Name"
  type="text"
  name="first_name"
  value={formState.first_name}
  handleChange={(e) => setFormState({ ...formState, first_name: e.target.value })}
  placeholder="Dhruv"
  className="w-full"
  required
/>
<InputGroup
  label="Last Name"
  type="text"
  name="last_name"
  value={formState.last_name}
  handleChange={(e) => setFormState({ ...formState, last_name: e.target.value })}
  placeholder="Arne"
  className="w-full"
  required
/>
<InputGroup
  label="Company Name"
  type="text"
  name="company"
  value={formState.company_name}
  handleChange={(e) => setFormState({ ...formState, company_name: e.target.value })}
  placeholder="Registered company name"
  className="w-full"
  required
/>
<InputGroup
  label="Email ID"
  type="email"
  name="email"
  value={formState.email}
  handleChange={(e) => setFormState({ ...formState, email: e.target.value })}
  placeholder="Email"
  className="w-full"
  required
/>
<InputGroup
  label="Phone Number"
  type="tel"
  name="phone"
  value={formState.phone}
  handleChange={(e) => setFormState({ ...formState, phone: e.target.value })}
  placeholder="Phone No. With Country Code"
  className="w-full"
  required
/>
{existingData?.phone != "" ? <p>Change in value will lead to re-verification of Phone Number</p> :<></>}


        <button
          type="submit"
          className="mt-6 flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
        >
          Save
        </button>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-primary p-6 shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-white">OTP Verification</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="mb-4 w-full rounded border border-gray-300 p-2"
            />
            {verified === "verified" && <p className="font-medium mb-4 text-white">✅ Verified Successfully!</p>}
            {verified === "failed" && <p className="font-medium mb-4 text-white">❌ Invalid OTP. Try Again.</p>}

            <div className="flex justify-between space-x-2 ">
              <button
                className="rounded bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-700"
                onClick={handleVerify}
              >
                Verify
              </button>

                 <button
                className="rounded bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-700"
                
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </ShowcaseSection>
  );
}
