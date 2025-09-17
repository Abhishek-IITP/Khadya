import { showErrorToast, showSuccessToast } from "@/app/(admin)/lib/toast-utils";
import { saveDocumentDetails } from "@/app/actions/saveDocumentDet";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useState } from "react";





type DocumentInfoProps = {
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
  gst_number: string;
  
};
const isValidGST = (gstNumber: string): boolean => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gstNumber.toUpperCase());
};







  

export function DocumentsInfo({goToNextStep , existingData, gst_number} : DocumentInfoProps) {

console.log("GST NUMBER");
console.log(gst_number);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();



    if (!isValidGST(formState.gst_number)) {
    showErrorToast("Please enter a GST number with proper format. E.g., 29ABCDE1234F2Z5");
    return;
  }


  const formData = new FormData();
  formData.set("gst_number", formState.gst_number);

    const res = await saveDocumentDetails(formData);

    if (!res.success) {
      alert("Error saving details: " + res.error);
      return;
    }
   goToNextStep();

 


  
  };

    const [formState, setFormState] = useState({
    gst_number: gst_number || '',
   
  });




  return (
    <ShowcaseSection title="Upload Your Documents" className="!p-6.5">
      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="GST Number"
            type="text"
            name="gst_number"
              value={formState.gst_number}
              handleChange={(e) => setFormState({ ...formState, gst_number: e.target.value })}
            placeholder="Enter your GST number"
            className="w-full"
            required
          />
        </div>
{gst_number != "" ? <p>Change in value will lead to re-verification of GST Number</p> :<></>}
      
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
