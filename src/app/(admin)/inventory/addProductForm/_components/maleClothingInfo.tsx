import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

interface MaleClothingInfoFormProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  goToNextStep: () => void;
}


export function MaleClothingInfoForm({formData, onChange, goToNextStep} : MaleClothingInfoFormProps) {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate that at least one image is uploaded
    if (!formData.productimagesurl || formData.productimagesurl.length === 0) {
      alert("Please upload at least one product image before proceeding.");
      return;
    }

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
    <ShowcaseSection title="Male Clothing Info" className="!p-6.5">
      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Clothing Type"
            placeholder="Select clothing type"
            className=" text-dark dark:text-white w-full xl:w-1/2"
            value={formData.clothingtype}
             onChange={(val) => handleSelectChange("clothingtype" , val)}
            items={[
              { label: "Shirt", value: "shirt" },
              { label: "T-Shirt", value: "tshirt" },
              { label: "Kurta", value: "kurta" },
              { label: "Jeans", value: "jeans" },
            ]}
            required={true}
          />
          <Select
            label="Fit Type"
            placeholder="Select fit"
            className=" text-dark dark:text-white w-full xl:w-1/2"
                       value={formData.fit}
             onChange={(val) => handleSelectChange("fit" , val)} 
            items={[
              { label: "Slim", value: "slim" },
              { label: "Regular", value: "regular" },
              { label: "Loose", value: "loose" },
            ]}
            required={true}
          />
        </div>

        {/* Row 2 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Sleeve Type"
            placeholder="Select sleeve type"
            className=" text-dark dark:text-white w-full xl:w-1/2"
             value={formData.sleeve}
             onChange={(val) => handleSelectChange("sleeve" , val)} 
            items={[
              { label: "Half", value: "half" },
              { label: "Full", value: "full" },
              { label: "Sleeveless", value: "sleeveless" },
            ]}
            required={true}
          />
          <Select
            label="Neck Type"
            placeholder="Select neck type"
            className=" text-dark dark:text-white w-full xl:w-1/2"
              value={formData.sleeve}
             onChange={(val) => handleSelectChange("neck" , val)} 
            items={[
              { label: "Collar", value: "collar" },
              { label: "Mandarin", value: "mandarin" },
              { label: "Round Neck", value: "round" },
            ]}
            required={true}
          />
        </div>

        {/* Row 3 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Bottom Rise"
            placeholder="Select bottom rise"
            className=" text-dark dark:text-white w-full xl:w-1/2"
                  value={formData.bottom}
             onChange={(val) => handleSelectChange("bottom" , val)} 
            items={[
              { label: "Mid Rise", value: "mid" },
              { label: "Low Rise", value: "low" },
              { label: "High Rise", value: "high" },
            ]}
          />
          <Select
            label="Closure Type"
            placeholder="Select closure type"
            className=" text-dark dark:text-white w-full xl:w-1/2"
                 value={formData.closure}
             onChange={(val) => handleSelectChange("closure" , val)} 
            items={[
              { label: "Zipper", value: "zipper" },
              { label: "Button", value: "button" },
              { label: "Drawstring", value: "drawstring" },
            ]}
          />
        </div>

        {/* Row 4 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Fabric Name"
            placeholder="Select fabric"
            className=" text-dark dark:text-white w-full xl:w-1/2"
             value={formData.fabric}
             onChange={(val) => handleSelectChange("fabric" , val)} 
            items={[
              { label: "Cotton", value: "cotton" },
              { label: "Denim", value: "denim" },
              { label: "Rayon", value: "rayon" },
            ]}
            required={true}
          />
          <InputGroup
            label="GSM"
            type="number"
            placeholder="Enter GSM"
            name="gsm"
                     value={formData.gsm}
            handleChange={onChange}
            className=" text-dark dark:text-white w-full xl:w-1/2"
          />
        </div>

        {/* Row 5 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Stretchability"
            placeholder="Select stretch type"
            className=" text-dark dark:text-white w-full xl:w-1/2"
                         value={formData.strech}
             onChange={(val) => handleSelectChange("strech" , val)} 
            items={[
              { label: "Stretch", value: "stretch" },
              { label: "Non-Stretch", value: "nonstretch" },
            ]}
          />
          <Select
            label="Pattern"
            placeholder="Select pattern"
            className=" text-dark dark:text-white w-full xl:w-1/2"
                    defaultValue={formData.pattern}
             onChange={(val) => handleSelectChange("strech" , val)} 
            items={[
              { label: "Solid", value: "solid" },
              { label: "Printed", value: "printed" },
              { label: "Embroidered", value: "embroidered" },
            ]}
          />
        </div>

        {/* Row 6 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Wash Care"
            placeholder="Select wash care"
                  defaultValue={formData.washcare}
             onChange={(val) => handleSelectChange("washcare" , val)} 
            className=" text-dark dark:text-white w-full xl:w-1/2"
            items={[
              { label: "Machine Wash", value: "machine" },
              { label: "Hand Wash", value: "hand" },
              { label: "Dry Clean", value: "dryclean" },
            ]}
            required={true}
          />
          <Select
            label="Usage Occasion"
            placeholder="Select occasion"
                       defaultValue={formData.occasion}
             onChange={(val) => handleSelectChange("occasion" , val)} 
            className=" text-dark dark:text-white w-full xl:w-1/2"
            items={[
              { label: "Formal", value: "formal" },
              { label: "Casual", value: "casual" },
              { label: "Party", value: "party" },
            ]}
            required={true}
          />
        </div>

        {/* Multi-selects (can replace Select with custom multi-select component) */}
        <InputGroup
          label="Sizes Available"
          type="text"
            name="size"
                     value={formData.size}
            handleChange={onChange}
          placeholder="e.g. S, M, L, XL"
          className=" text-dark dark:text-white mb-4.5"
          required={true}
        />
        <InputGroup
          label="Color Options"
          type="text"
                     name="color"
                     value={formData.color}
            handleChange={onChange}
          placeholder="e.g. Red, Blue, Black"
          className=" text-dark dark:text-white mb-4.5"
          required={true}
        />

       

<ShowcaseSection title="Media Upload" className="space-y-6 !p-6.5 ">

  {/* ------------------------ VIDEO UPLOAD ------------------------ */}
  <div className="space-y-3">
    <InputGroup
      type="file"
      accept="video/*"
      fileStyleVariant="style1"
      label="Upload/Replace Product Video"
      name="productvideourl"
 handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange({
        target: {
          name: "productvideourl",
          value: file, // IMPORTANT: Store the file in `productvideourl`
        },
      } as any);
    }
  }}
      placeholder="Attach video"
    />

    {formData.productvideourl && (
      <div className="mt-2">
        <h4 className="text-base font-semibold text-dark dark:text-white mb-2">Product Video Preview</h4>
        <video
          controls
          className="w-full max-w-2xl rounded-lg border shadow-sm"
          src={
            typeof formData.productvideourl === "string"
              ? formData.productvideourl
              : URL.createObjectURL(formData.productvideourl)
          }
        />
      </div>
    )}
  </div>

  {/* ------------------------ IMAGES SLIDESHOW ------------------------ */}
  <div className="mt-6 space-y-4">
    <div className="flex items-center gap-2">
      <h4 className="text-base font-semibold text-dark dark:text-white">Product Images</h4>
      <span className="text-sm text-red-500 font-medium">*At least 1 image required</span>
    </div>

    <div className="flex items-start gap-4 flex-wrap w-full pb-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
     
      {formData.productimagesurl?.map((img: any, idx: number) => (
        <div
          key={idx}
          className="relative w-70 h-40 shrink-0 rounded-lg border overflow-hidden group"
        >
          <img
            src={typeof img === "string" ? img : URL.createObjectURL(img)}
            alt={`Product Image ${idx + 1}`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <button
            type="button"
            title="Remove"
            onClick={() => {
              const updatedImages = [...formData.productimagesurl];
              updatedImages.splice(idx, 1);
              onChange({
                target: {
                  name: "productimagesurl",
                  value: updatedImages,
                },
              } as any);
            }}
            className="absolute top-1 right-1 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-md"
          >
            ✕
          </button>
        </div>
      ))}

      {/* -------- ADD MORE IMAGES -------- */}
      <label
        htmlFor="add-more-images"
        className="w-70 h-40 shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-lg cursor-pointer hover:border-blue-600 transition-all duration-200"
      >
        <span className="text-sm text-gray-600 dark:text-gray-300">+ Add More</span>
        <input
          id="add-more-images"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            const updatedImages = [...(formData.productimagesurl || []), ...files];
            onChange({
              target: {
                name: "productimagesurl",
                value: updatedImages,
              },
            } as any);
          }}
          className="hidden"
        />
      </label>
    </div>
  </div>
</ShowcaseSection>


       

        {/* Submit */}
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
