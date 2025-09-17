import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export function MaleClothingInfoForm() {
  return (
    <ShowcaseSection title="Male Clothing Info" className="!p-6.5">
      <form action="#">
        {/* Row 1 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Clothing Type"
            placeholder="Select clothing type"
            className="w-full xl:w-1/2"
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
            className="w-full xl:w-1/2"
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
            className="w-full xl:w-1/2"
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
            className="w-full xl:w-1/2"
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
            className="w-full xl:w-1/2"
            items={[
              { label: "Mid Rise", value: "mid" },
              { label: "Low Rise", value: "low" },
              { label: "High Rise", value: "high" },
            ]}
          />
          <Select
            label="Closure Type"
            placeholder="Select closure type"
            className="w-full xl:w-1/2"
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
            className="w-full xl:w-1/2"
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
            className="w-full xl:w-1/2"
          />
        </div>

        {/* Row 5 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Stretchability"
            placeholder="Select stretch type"
            className="w-full xl:w-1/2"
            items={[
              { label: "Stretch", value: "stretch" },
              { label: "Non-Stretch", value: "nonstretch" },
            ]}
          />
          <Select
            label="Pattern"
            placeholder="Select pattern"
            className="w-full xl:w-1/2"
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
            className="w-full xl:w-1/2"
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
            className="w-full xl:w-1/2"
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
          placeholder="e.g. S, M, L, XL"
          className="mb-4.5"
          required={true}
        />
        <InputGroup
          label="Color Options"
          type="text"
          placeholder="e.g. Red, Blue, Black"
          className="mb-4.5"
          required={true}
        />

       

        {/* Video Upload */}

        <ShowcaseSection title="File upload" className="space-y-5.5 !p-6.5">
            <InputGroup
              type="file"
              fileStyleVariant="style1"
              label="Upload Product Video (Optional)"
              placeholder="Attach file"
            />

              <InputGroup
              required
              type="file"
              fileStyleVariant="style1"
              label="Upload Product Images (Front, Back, Close-Up)"
              placeholder="Attach file"
            />
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
