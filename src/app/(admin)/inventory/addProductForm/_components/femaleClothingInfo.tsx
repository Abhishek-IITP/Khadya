import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";



type FemaleClothingInfoProps = {
  goToNextStep: () => void;
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  
};



export function FemaleClothingInfoForm({formData, onChange, goToNextStep} : FemaleClothingInfoProps) {
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
    <ShowcaseSection title="Female Clothing Info" className="!p-6.5">
      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Clothing Type"
            placeholder="Select clothing type"
            className=" text-dark dark:text-white w-full xl:w-1/2"
             defaultValue={formData.clothingtype}
             onChange={(val) => handleSelectChange("clothingtype" , val)}
            items={[
              { label: "Kurti", value: "kurti" },
              { label: "Saree", value: "saree" },
              { label: "Lehenga", value: "lehenga" },
            ]}
            required
          />
          <Select
            label="Style"
            placeholder="Select style"
            className=" text-dark dark:text-white w-full xl:w-1/2"
                      defaultValue={formData.stylef}
             onChange={(val) => handleSelectChange("stylef" , val)}
            items={[
              { label: "A-Line", value: "aline" },
              { label: "Anarkali", value: "anarkali" },
              { label: "Kaftan", value: "kaftan" },
            ]}
            required
          />
        </div>

        {/* Row 2 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Neck Design"
            placeholder="Select neck design"
            className=" text-dark dark:text-white w-full xl:w-1/2"
                defaultValue={formData.neck}
             onChange={(val) => handleSelectChange("neck" , val)}
            items={[
              { label: "Round", value: "round" },
              { label: "V", value: "v" },
              { label: "Keyhole", value: "keyhole" },
              { label: "Off-Shoulder", value: "offshoulder" },
            ]}
            required
          />
          <Select
            label="Sleeve Style"
            placeholder="Select sleeve style"
                            defaultValue={formData.sleeve}
             onChange={(val) => handleSelectChange("sleeve" , val)}
            className=" text-dark dark:text-white w-full xl:w-1/2"
            items={[
              { label: "Full", value: "full" },
              { label: "Cap", value: "cap" },
              { label: "Puff", value: "puff" },
              { label: "Sleeveless", value: "sleeveless" },
            ]}
            required
          />
        </div>

        {/* Row 3 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Stitch Type"
            placeholder="Select stitch type"
                 defaultValue={formData.stitchf}
             onChange={(val) => handleSelectChange("stitchf" , val)}
            className=" text-dark dark:text-white w-full xl:w-1/2"
            items={[
              { label: "Stitched", value: "stitched" },
              { label: "Semi", value: "semi" },
              { label: "Unstitched", value: "unstitched" },
            ]}
            required
          />
          <Select
            label="Dupatta Included"
            placeholder="Is dupatta included?"
                            defaultValue={formData.dupatta}
             onChange={(val) => handleSelectChange("dupatta" , val)}
            className=" text-dark dark:text-white w-full xl:w-1/2"
            items={[
              { label: "Yes", value: "yes" },
              { label: "No", value: "no" },
            ]}
          />
        </div>

        {/* Row 4 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Bottom Type"
            placeholder="Select bottom type"
               defaultValue={formData.bottom}
             onChange={(val) => handleSelectChange("bottom" , val)}
            className=" text-dark dark:text-white w-full xl:w-1/2"
            items={[
              { label: "Salwar", value: "salwar" },
              { label: "Sharara", value: "sharara" },
              { label: "Palazzo", value: "palazzo" },
            ]}
          />
          <Select
            label="Fabric Name"
            placeholder="Select fabric"
                           defaultValue={formData.fabric}
             onChange={(val) => handleSelectChange("fabric" , val)}
            className=" text-dark dark:text-white w-full xl:w-1/2"
            items={[
              { label: "Cotton", value: "cotton" },
              { label: "Georgette", value: "georgette" },
              { label: "Net", value: "net" },
            ]}
            required
          />
        </div>

        {/* Row 5 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Lining Material"
            type="text"
            name="lining"
                    value={formData.lining}
            handleChange={onChange}
            placeholder="Enter lining material"
            className=" text-dark dark:text-white w-full xl:w-1/2"
          />
          <InputGroup
            label="GSM"
            type="number"
                  name="gsm"
                    value={formData.gsm}
            handleChange={onChange}
            placeholder="Enter GSM"
            className=" text-dark dark:text-white w-full xl:w-1/2"
          />
        </div>

        {/* Row 6 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Embellishments"
            type="text"
                    name="embellishments"
                    value={formData.embellishments}
            handleChange={onChange}
            placeholder="e.g. Embroidery, Mirror Work"
            className=" text-dark dark:text-white w-full xl:w-1/2"
          />
          <Select
            label="Stretchability"
            placeholder="Select stretchability"
               defaultValue={formData.strech}
             onChange={(val) => handleSelectChange("strech" , val)}
            className=" text-dark dark:text-white w-full xl:w-1/2"
            items={[
              { label: "Stretch", value: "stretch" },
              { label: "Non-Stretch", value: "nonstretch" },
            ]}
          />
        </div>

        {/* Row 7 */}
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
            required
          />
          <Select
            label="Usage Occasion"
            placeholder="Select occasion"
                        defaultValue={formData.occasion}
             onChange={(val) => handleSelectChange("occasion" , val)}
            className=" text-dark dark:text-white w-full xl:w-1/2"
            items={[
              { label: "Casual", value: "casual" },
              { label: "Festive", value: "festive" },
              { label: "Office", value: "office" },
            ]}
            required
          />
        </div>

        {/* Multi-select inputs */}
        <InputGroup
          label="Sizes Available"
          type="text"
          placeholder="e.g. XS, S, M, L, XL, Free Size"
                            name="size"
                    value={formData.size}
            handleChange={onChange}
          className=" text-dark dark:text-whitemb-4.5"
          required
        />
        <InputGroup
          label="Color Options"
          type="text"
          placeholder="e.g. Red, Blue, Black"
                    name="color"
                    value={formData.color}
            handleChange={onChange}
          className=" text-dark dark:text-whitemb-4.5"
          required
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


        {/* Submit button */}
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
