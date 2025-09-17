import { PaymentsOverview } from "@/app/(admin)/payments/_components/payments-overview/index";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";
import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { ChatsCard } from "./_components/charts-card";
import { OverviewCardsGroup } from "./_components/overview-cards/index";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { PaymentsTable } from "./_components/PaymentsTable";
import { MetricCard } from "./_components/MetricCard";


type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function PaymentsPage({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <>

              <MetricCard
                title="Total Business"
                value="1,40,85,981.00"
                currency="INR"
                isLarge={true}
              />
    <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">

      <div className="col-span-12 xl:col-span-7">
      <Suspense fallback={<OverviewCardsSkeleton />}>
      
        <OverviewCardsGroup />
      </Suspense>
      </div>
      
      <div className="col-span-12 xl:col-span-5">
        <PaymentsOverview
          className="w-full"
          key={extractTimeFrame("payments_overview")}
          timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
        />
        </div>


    </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">



     <div className="col-span-12 grid xl:col-span-12">
          <Suspense fallback={<TopChannelsSkeleton />}>
            <PaymentsTable />
          </Suspense>
        </div>

      
        
      </div>
    </>
  );
}
