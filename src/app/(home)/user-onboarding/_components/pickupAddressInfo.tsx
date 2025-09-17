import { savePickupDetails } from "@/app/actions/savePickUpDet";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useState } from "react";





type PickupInfoProps = {
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
  pickupDetails?: {


    unit_number : string;
    building_name : string;
    road_name : string;
    area : string;
    city : string;
    state : string;
    country : string;
    pincode : string;
  } | null;
  
};



export function PickupAddressInfo({goToNextStep, pickupDetails, existingData}:PickupInfoProps ) {




 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();




  const formData = new FormData();
formData.set("unit_number", formState.unit_number);
formData.set("building_name", formState.building_name);
formData.set("road_name", formState.road_name);
formData.set("area", formState.area);
formData.set("city", formState.city);
formData.set("state", formState.state);
formData.set("country", formState.country);
formData.set("pincode", formState.pincode);







    const res = await savePickupDetails(formData);

    if (!res.success) {
      alert("Error saving details: " + res.error);
      return;
    }
   goToNextStep();

 


  
  };





      const [formState, setFormState] = useState({

unit_number : pickupDetails?.unit_number || '',
building_name : pickupDetails?.building_name || '',
road_name : pickupDetails?.road_name || '',
area : pickupDetails?.area || '',
city : pickupDetails?.city || '',
state : pickupDetails?.state || '',
country : pickupDetails?.country || '',
pincode : pickupDetails?.pincode || '',











     
    });
  
  
  return (
    <ShowcaseSection title="Pickup Address Details" className="!p-6.5">
      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Unit Number"
            type="text"
            name="unit_number"

             value={formState.unit_number}
              handleChange={(e) => setFormState({ ...formState, unit_number: e.target.value })}
            placeholder="Unit Number"
            className="w-full"
            required
          />


               <InputGroup
            label="Building Name"
            type="text"
            name="building_name"
            
             value={formState.building_name}
              handleChange={(e) => setFormState({ ...formState, building_name: e.target.value })}
            placeholder="Building Name"
            className="w-full"
            required
          />
        </div>






          <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Road Number/Name"
            type="text"
             name="road_name"
            
             value={formState.road_name}
              handleChange={(e) => setFormState({ ...formState, road_name: e.target.value })}
            placeholder="Road Number/Name"
            className="w-full"
            required
          />
        </div>



          <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Area"
            type="text"
            placeholder="Area"
                         name="area"
            
             value={formState.area}
              handleChange={(e) => setFormState({ ...formState, area: e.target.value })}
            className="w-full"
            required
          />
        </div>



        
          <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="City"
            type="text"
            placeholder="City"
                                     name="city"
            
             value={formState.city}
              handleChange={(e) => setFormState({ ...formState, city: e.target.value })}
            className="w-full"
            required
          />
        </div>



        
          <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
  


         <Select
            label="State"
            placeholder="State"
            className="w-full xl:w-1/2 dark:text-white"
            defaultValue={formState.country}
          onChange={(value) => setFormState({ ...formState, state: value })}
            items={[
       // States
{ label: "Andhra Pradesh", value: "Andhra Pradesh" },
{ label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
{ label: "Assam", value: "Assam" },
{ label: "Bihar", value: "Bihar" },
{ label: "Chhattisgarh", value: "Chhattisgarh" },
{ label: "Goa", value: "Goa" },
{ label: "Gujarat", value: "Gujarat" },
{ label: "Haryana", value: "Haryana" },
{ label: "Himachal Pradesh", value: "Himachal Pradesh" },
{ label: "Jharkhand", value: "Jharkhand" },
{ label: "Karnataka", value: "Karnataka" },
{ label: "Kerala", value: "Kerala" },
{ label: "Madhya Pradesh", value: "Madhya Pradesh" },
{ label: "Maharashtra", value: "Maharashtra" },
{ label: "Manipur", value: "Manipur" },
{ label: "Meghalaya", value: "Meghalaya" },
{ label: "Mizoram", value: "Mizoram" },
{ label: "Nagaland", value: "Nagaland" },
{ label: "Odisha", value: "Odisha" },
{ label: "Punjab", value: "Punjab" },
{ label: "Rajasthan", value: "Rajasthan" },
{ label: "Sikkim", value: "Sikkim" },
{ label: "Tamil Nadu", value: "Tamil Nadu" },
{ label: "Telangana", value: "Telangana" },
{ label: "Tripura", value: "Tripura" },
{ label: "Uttar Pradesh", value: "Uttar Pradesh" },
{ label: "Uttarakhand", value: "Uttarakhand" },
{ label: "West Bengal", value: "West Bengal" },

// Union Territories
{ label: "Andaman and Nicobar Islands", value: "Andaman and Nicobar Islands" },
{ label: "Chandigarh", value: "Chandigarh" },
{ label: "Dadra and Nagar Haveli and Daman and Diu", value: "Dadra and Nagar Haveli and Daman and Diu" },
{ label: "Delhi", value: "Delhi" },
{ label: "Jammu and Kashmir", value: "Jammu and Kashmir" },
{ label: "Ladakh", value: "Ladakh" },
{ label: "Lakshadweep", value: "Lakshadweep" },
{ label: "Puducherry", value: "Puducherry" }

            ]}
          />



         <Select
            label="Select Country"
            placeholder="Select Country"
            className="w-full xl:w-1/2 dark:text-white"
            defaultValue={formState.country}
          onChange={(value) => setFormState({ ...formState, country: value })}
            items={[
              { label: "India", value: "india" },
              { label: "Sri Lanka", value: "sri lanka" },
              { label: "Nepal", value: "nepal" },
            ]}
          />
        </div>



             <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Pincode"
            type="number"
            placeholder="Pincode"
            name="pincode"
                value={formState.pincode}
              handleChange={(e) => setFormState({ ...formState, pincode: e.target.value })}
            className="w-full"
            required
          />
        </div>







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
