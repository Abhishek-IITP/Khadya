import { showErrorToast, showSuccessToast } from "@/app/(admin)/lib/toast-utils";
import { makeBankVerified } from "@/app/actions/verifyBank";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BankVerificationInfo() {


  const router = useRouter();

  const [formState, setFormState] = useState({
    amount: "",

  });



  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
     const formData = new FormData();
    formData.set("beneficiary_name", formState.amount);
  
       if (formState.amount !== "1.88") {
        showErrorToast("Verification Failed. Amount is incorrect!")
     
      return;
    }
  

  
     
      const res = await makeBankVerified();
  
      if (!res.success) {
        showErrorToast("Error saving bank details: " + res.error);
        return;
      }
  
  showSuccessToast("Bank Verified!");
  showSuccessToast("🎉Welcome To Krydha Manufaturer Portal.")
router.replace("/dashboard");
      // Move to next step after success
    };



    
  return (
    <ShowcaseSection title="Verify Your Bank Account" className="!p-6.5">
      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Enter amount to verify"
            type="text"
              handleChange={(e) =>
              setFormState({ ...formState, amount: e.target.value })
            }
            placeholder="Enter the amount you received"
            className="w-full"
            required
          />
        </div>

      
        <button
          type="submit"
          className="mt-6 flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
        >
          Verify
        </button>
      </form>
    </ShowcaseSection>
  );
}
