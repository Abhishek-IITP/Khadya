import { addProduct } from "@/app/(admin)/action/product";
import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";



interface CoreProductInfoFormProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  goToNextStep: () => void;
}





export const CoreProductInfoForm = ({ formData, onChange, goToNextStep }: CoreProductInfoFormProps) => {
//   console.log("FORMDATA");
// console.log(formData);
// console.log("FORMDATA");
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    goToNextStep(); // Move to next step after success
  };


    // Helper for Select to adapt to your onChange handler
  const handleSelectChange = (name: string, value: string) => {
    onChange({
      target: {
        name,
        value,
      },
    } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>);
  };







  return (
    
    <ShowcaseSection title="Core Product Info" className="!p-6.5">
      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
          
            label="Product Title"
            type="text"
            name="title"
            placeholder="e.g. Cotton Slim Fit Shirt"
            className="w-full  text-white dark:text-dark"
            required
            defaultValue={formData.title}
            handleChange={onChange}
          />
        </div>

        {/* Row 2 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Gender"
            placeholder="Select gender"
            value={formData.gender}
            className="w-full xl:w-1/2 text-dark dark:text-white"
                       
            onChange={(value) => handleSelectChange("gender", value)}
            items={[
              { label: "male", value: "male" },
              { label: "female", value: "female" },
              { label: "unisex", value: "unisex" },
            ]}
          />
          <Select
            label="Product Category"
            placeholder="Select category"
            className="w-full xl:w-1/2 text-dark dark:text-white"
value={formData.category}
   
            onChange={(value) => handleSelectChange("category", value)}
            items={[
              { label: "Shirt", value: "shirt" },
              { label: "Kurta", value: "kurta" },
              { label: "Saree", value: "saree" },
              { label: "Jeans", value: "jeans" },
            ]}
          />
        </div>

        {/* Row 3 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Product Subcategory"
            type="text"
name="subcategory"

                        value={formData.subcategory}
            handleChange={onChange}


            placeholder="e.g. Slim Fit Shirt"
            className="w-full xl:w-1/2 text-dark dark:text-white"
          />
          <InputGroup
            label="Product Code / SKU"
            type="text"
            placeholder="e.g. SHRT1234"
            className="w-full xl:w-1/2 text-dark dark:text-white"
            required
            name="sku"
                       value={formData.sku}
            handleChange={onChange}

          />
        </div>

        {/* Row 4 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Brand Name"
            type="text"
            name="brand"
            placeholder="e.g. Generic"
            className="w-full xl:w-1/2 text-dark dark:text-white"
                 value={formData.brand}
            handleChange={onChange}
          />
          <InputGroup
            label="Manufacturer Name"
            type="text"
            name="manufacturer"
            placeholder="Enter manufacturer name"
            className="w-full xl:w-1/2 text-dark dark:text-white"
               value={formData.manufacturer}
            handleChange={onChange}
          />
        </div>

        {/* Row 5 */}
        <InputGroup
          label="Manufacturer Address"
          type="text" 
          placeholder="Enter full postal address"
          className="mb-4.5 text-dark dark:text-white"
          name="manufactureraddr"
                         value={formData.manufactureraddr}
            handleChange={onChange}
        />

        {/* Row 6 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
     
          <Select
            label="Country of Origin"
            placeholder="Select country"
            className="w-full xl:w-1/2 text-dark dark:text-white"
            items={[{ label: "India", value: "india" }]}

value={formData.countryoforigin}
            onChange={(value) => handleSelectChange("countryoforigin", value)}
          />
          <InputGroup
            label="HSN Code"
            type="text"
            placeholder="e.g. 610910"
            name="hsn"
                        value={formData.hsn}
            handleChange={onChange}
            className="w-full xl:w-1/2 text-dark dark:text-white"
          />
        </div>

        {/* Row 7 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="GST %"
            placeholder="Select GST rate"
    value={formData.gst}
            onChange={(value) => handleSelectChange("gst", value)}
            
            className="w-full xl:w-1/2 text-dark dark:text-white"
            items={[
              { label: "5%", value: "5" },
              { label: "12%", value: "12" },
              { label: "18%", value: "18" },
            ]}
          />
          <InputGroup
            label="MRP (₹)"
            type="number"
            placeholder="e.g. 999.00"
            name="price"
                        value={formData.price}
            handleChange={onChange}
            className="w-full xl:w-1/2 text-dark dark:text-white"
          />
        </div>

        {/* Row 8 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Wholesale Price (₹)"
            type="number"
            placeholder="e.g. 499.00"
            name="wholesaleprice"
                    value={formData.wholesaleprice}
            handleChange={onChange}
            className="w-full xl:w-1/2 text-dark dark:text-white"
          />
          <InputGroup
            label="Minimum Order Quantity"
            type="number"
            placeholder="e.g. 10"
            name="moq"
                    value={formData.moq}
            handleChange={onChange}
            className="w-full xl:w-1/2 text-dark dark:text-white"
          />
        </div>

        {/* Row 9 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          
          <InputGroup
            label="Dispatch Time (Days)"
            type="number"
            placeholder="e.g. 2"
            name="dispatch"
               defaultValue={formData.dispatch}
            handleChange={onChange}
            className="w-full xl:w-1/2 text-dark dark:text-white"
          />
          <Select
            label="Return Policy"
            placeholder="Select return policy"
            className="w-full xl:w-1/2 text-dark dark:text-white"
           
           
                  value={formData.returnpol}
            onChange={(value) => handleSelectChange("returnpol", value)}
            items={[
              { label: "No Return", value: "no_return" },
              { label: "7 Days", value: "7_days" },
              { label: "Exchange Only", value: "exchange" },
            ]}
          />
        </div>

        {/* Row 10 */}
        <InputGroup
          label="Stock Available"
          type="number"
          placeholder="e.g. 100"
          name="stock"
               value={formData.stock}
            handleChange={onChange}
          className="mb-4.5 text-dark dark:text-white"
        />

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
