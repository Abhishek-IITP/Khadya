"use client";

import { Tabs } from "@/components/ui/tabs";
import ManufactureeApprovals from "./_components/ManufactureeApprovals";
import ProductsApprovals from "./_components/ProductsApprovals";

const TabsDemo = () => {
  const tabs = [
    // {
    //   title: "Manufacturer Approvals",
    //   value: "product",
    //   content: (
    //     <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-600 to-gray-950 p-2 text-xl font-bold text-white md:text-4xl">
    //       <ManufactureeApprovals />
    //     </div>
    //   ),
    // },
    {
      title: "Product Approvals",
      value: "services",
      content: (
        <div className="to-violet-90 relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-600 to-gray-950 p-2 text-xl font-bold text-white shadow-xl backdrop-blur-lg md:text-4xl">
          <ProductsApprovals />
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto my-0 flex h-full w-full max-w-5xl flex-col items-start justify-start [perspective:1000px] md:h-[40rem]">
      <Tabs tabs={tabs} />
    </div>
  );
};

// const DummyContent = () => {
//   return (
//     <img
//       src="/linear.webp"
//       alt="dummy image"
//       width="1000"
//       height="1000"
//       className="absolute inset-x-0 -bottom-10 mx-auto h-[60%] w-[90%] rounded-xl object-cover object-left-top md:h-[90%]"
//     />
//   );
// };
export default TabsDemo;
