import InputGroup from "@/components/FormElements/InputGroup";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

export function CoreProductInfoForm() {
  return (
    <ShowcaseSection title="Core Product Info" className="!p-6.5">
      <form action="#">
        {/* Row 1 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Product Title"
            type="text"
            placeholder="e.g. Cotton Slim Fit Shirt"
            className="w-full"
            required
          />
        </div>

        {/* Row 2 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Gender"
            placeholder="Select gender"
            className="w-full xl:w-1/2"
            items={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Unisex", value: "unisex" },
            ]}
          />
          <Select
            label="Product Category"
            placeholder="Select category"
            className="w-full xl:w-1/2"
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
            placeholder="e.g. Slim Fit Shirt"
            className="w-full xl:w-1/2"
          />
          <InputGroup
            label="Product Code / SKU"
            type="text"
            placeholder="e.g. SHRT1234"
            className="w-full xl:w-1/2"
            required
          />
        </div>

        {/* Row 4 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Brand Name"
            type="text"
            placeholder="e.g. Generic"
            className="w-full xl:w-1/2"
          />
          <InputGroup
            label="Manufacturer Name"
            type="text"
            placeholder="Enter manufacturer name"
            className="w-full xl:w-1/2"
          />
        </div>

        {/* Row 5 */}
        <InputGroup
          label="Manufacturer Address"
          type="text"
          placeholder="Enter full postal address"
          className="mb-4.5"
        />

        {/* Row 6 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="Country of Origin"
            placeholder="Select country"
            className="w-full xl:w-1/2"
            items={[{ label: "India", value: "india" }]}
          />
          <InputGroup
            label="HSN Code"
            type="number"
            placeholder="e.g. 610910"
            className="w-full xl:w-1/2"
          />
        </div>

        {/* Row 7 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <Select
            label="GST %"
            placeholder="Select GST rate"
            className="w-full xl:w-1/2"
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
            className="w-full xl:w-1/2"
          />
        </div>

        {/* Row 8 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Wholesale Price (₹)"
            type="number"
            placeholder="e.g. 499.00"
            className="w-full xl:w-1/2"
          />
          <InputGroup
            label="Minimum Order Quantity"
            type="number"
            placeholder="e.g. 10"
            className="w-full xl:w-1/2"
          />
        </div>

        {/* Row 9 */}
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Dispatch Time (Days)"
            type="number"
            placeholder="e.g. 2"
            className="w-full xl:w-1/2"
          />
          <Select
            label="Return Policy"
            placeholder="Select return policy"
            className="w-full xl:w-1/2"
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
          className="mb-4.5"
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
