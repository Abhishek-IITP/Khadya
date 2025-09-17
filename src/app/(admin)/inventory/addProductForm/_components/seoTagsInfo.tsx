import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";



type SeoTagsInfoProps = {
  goToNextStep: () => void;

    formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};



export function SeoTagsInfo({formData, onChange, goToNextStep}:SeoTagsInfoProps) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    goToNextStep(); // Move to next step after success
  };
  return (
    <ShowcaseSection title="SEO Information (Used To Optimize Product Search)" className="!p-6.5">
      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">

          <InputGroup
            label="Tags"
            type="text"
            
               name="tags"
                     value={formData.tags}
            handleChange={onChange}
            placeholder="e.g. Seperate With Commans (Trending, Sarre, Yellow, Casual etc.)"
            className=" text-dark dark:text-white w-full "
          />
        </div>


        {/* Row 3 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">



                      <InputGroup
            label="Meta Title"
            type="text"

 name="metatitle"
                     value={formData.metatitle}
            handleChange={onChange}

            
            placeholder="e.g. Saree, Trending Saree 2025 etc."
            className=" text-dark dark:text-white w-full xl:w-1/2"
            required
          />

          
          <InputGroup
            label="Meta Description"
            type="text"
             name="metades"
                     value={formData.metades}
            handleChange={onChange}

            placeholder="Use For Searching Optimization"
            className=" text-dark dark:text-white w-full xl:w-1/2"
     
          />
        </div>

        {/* Row 4 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Seller Notes (Hidden From Buyer)"
            type="text"
                    name="sellernotes"
                     value={formData.sellernotes}
            handleChange={onChange}
            placeholder="Write notes here..."
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
