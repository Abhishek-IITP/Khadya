"use client";

import { showSuccessToast, showWarningToast } from "@/app/(admin)/lib/toast-utils";
import { saveBankDetails } from "@/app/actions/saveBankDet";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useEffect, useState } from "react";

type BankDetailProps = {
  goToNextStep: () => void;
  bankDetail: {
    beneficiary_name: string;
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    cancelled_cheque_url: string;
  } | null;
};

export function BankDetailsInfo({ goToNextStep, bankDetail }: BankDetailProps) {


  console.log("bankDetail");
  console.log({bankDetail});
  const [formState, setFormState] = useState({
    beneficiary_name: "",
    account_number: "",
    bank_name: "",
    ifsc_code: "",
    cancelled_cheque_url: null as File | null,
  });

  const [chequePreview, setChequePreview] = useState<string | null>(null);

  // Prefill form from props
  useEffect(() => {
    if (bankDetail) {
      setFormState({
        beneficiary_name: bankDetail.beneficiary_name || "",
        account_number: bankDetail.account_number || "",
        bank_name: bankDetail.bank_name || "",
        ifsc_code: bankDetail.ifsc_code || "",
        cancelled_cheque_url: null,
      });

      if (bankDetail.cancelled_cheque_url) {
        setChequePreview(bankDetail.cancelled_cheque_url);
      }
    }
  }, [bankDetail]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormState({ ...formState, cancelled_cheque_url: file });

    if (file) {
      const localUrl = URL.createObjectURL(file);
      setChequePreview(localUrl);
    }
  };



  function isFormChanged() {
  if (!bankDetail) return true; // no initial data means form is new, so considered changed

  // Check primitive fields
  if (
    formState.beneficiary_name !== bankDetail.beneficiary_name ||
    formState.account_number !== bankDetail.account_number ||
    formState.bank_name !== bankDetail.bank_name ||
    formState.ifsc_code !== bankDetail.ifsc_code
  ) {
    return true;
  }

  // Check cancelled_cheque_url:
  // If user uploaded a new file (formState.cancelled_cheque_url != null), it's changed
  if (formState.cancelled_cheque_url !== null) {
    return true;
  }

  // Otherwise no changes
  return false;
}



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


     if (!isFormChanged()) {
    // No changes made, just proceed
    goToNextStep();
    return;
  }


    const formData = new FormData();
    formData.set("beneficiary_name", formState.beneficiary_name);
    formData.set("account_number", formState.account_number);
    formData.set("bank_name", formState.bank_name);
    formData.set("ifsc_code", formState.ifsc_code);

    if (formState.cancelled_cheque_url) {
      formData.set("cancelled_cheque_url", formState.cancelled_cheque_url);
    }

    const res = await saveBankDetails(formData, bankDetail?.cancelled_cheque_url);

    if (!res.success) {
      alert("Error saving bank details: " + res.error);
      return;
    }

showSuccessToast("Bank Details Saved");
showWarningToast("Kindly wait to deposit amount in your account for Bank Verification. Come back later");
    goToNextStep(); // Move to next step after success
  };

  return (
    <ShowcaseSection title="Bank Details" className="!p-6.5">

      <form onSubmit={handleSubmit}>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Beneficiary Name"
            type="text"
            name="beneficiary_name"
            placeholder="Enter beneficiary name"
            value={formState.beneficiary_name}
            handleChange={(e) =>
              setFormState({ ...formState, beneficiary_name: e.target.value })
            }
            className="w-full"
            required
          />
        </div>

        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Bank Account Number"
            type="text"
            name="account_number"
            placeholder="Enter bank account number"
            value={formState.account_number}
            handleChange={(e) =>
              setFormState({ ...formState, account_number: e.target.value })
            }
            className="w-full"
            required
          />
        </div>

        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Bank Name"
            type="text"
            name="bank_name"
            placeholder="Enter bank name"
            value={formState.bank_name}
            handleChange={(e) =>
              setFormState({ ...formState, bank_name: e.target.value })
            }
            className="w-full"
            required
          />
        </div>

        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Branch IFSC Code"
            type="text"
            name="ifsc_code"
            placeholder="Enter branch IFSC code"
            value={formState.ifsc_code}
            handleChange={(e) =>
              setFormState({ ...formState, ifsc_code: e.target.value })
            }
            className="w-full"
            required
          />
        </div>

        <InputGroup
          type="file"
          fileStyleVariant="style2"
          name="cancelled_cheque_url"
          label="Cancelled Cheque"
          placeholder="Attach file"
          className="pb-5"
          required
          handleChange={handleFileChange}
        />


        {/* Show image preview */}
        {chequePreview && (
          <div className="mt-2">
            <p className=" text-sm font-medium text-white-700">Preview Of Cheque:</p>
            <p className="mb-3 text-xs">Updating cheque will take some time. Refresh to see changes.</p>
            <img
              src={chequePreview}
              alt="Cancelled Cheque Preview"
              className="w-64 rounded-lg border border-gray-300"
            />
          </div>
        )}

        <button
          type="submit"
          className="mt-6 flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
        >
          Save
        </button>
      </form>
    </ShowcaseSection>
  );
}
