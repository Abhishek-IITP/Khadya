import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup() {
  const { views, profit, products, users } = await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Product Items"
        data={{
          value: compactFormat(products.total),
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="In Stock Products"
        data={{
     value: compactFormat(products.inStock),
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Out of Stock"
        data={{
    
          value: compactFormat(products.outOfStock),
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="About To Finish"
        data={{
 value: compactFormat(products.aboutToFinish),
        }}
        Icon={icons.Profit}
      />
    </div>
  );
}
