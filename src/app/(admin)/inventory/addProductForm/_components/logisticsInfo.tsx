import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";


type LogisticsInfoProps = {
  goToNextStep: () => void;
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  
};


export function LogisticsInfoForm({formData, onChange, goToNextStep} : LogisticsInfoProps) {


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    goToNextStep(); // Move to next step after success
  };







  return (
    <ShowcaseSection title="Logistics Info" className="!p-6.5">
      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">

          <InputGroup
            label="Product Dimesions"
            type="text"

               name="dimension"
                     value={formData.dimension}
            handleChange={onChange}
            placeholder="e.g. 20x12x6 (LxBxH)"
            className=" text-dark dark:text-white w-full "
          />
        </div>


        {/* Row 3 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">



                      <InputGroup
            label="Product Weight"
            type="number"
    name="weight"
                     value={formData.weight}
            handleChange={onChange}
            placeholder="e.g. 3.8 (in Kg)"
            className=" text-dark dark:text-white w-full xl:w-1/2"
            required
          />

          
          <InputGroup
            label="Shipping Charges (If applicable)"
            type="number"
                name="shipping"
                     value={formData.shipping}
            handleChange={onChange}
            placeholder="e.g. 200 (in Rs.)"
            className=" text-dark dark:text-white w-full xl:w-1/2"
     
          />
        </div>

        {/* Row 4 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Inventory Location"
            type="text"
                            name="inv_location"
                     value={formData.inv_location}
            handleChange={onChange}
            placeholder="e.g. Indore, M.P."
            className=" text-dark dark:text-white w-full "
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
