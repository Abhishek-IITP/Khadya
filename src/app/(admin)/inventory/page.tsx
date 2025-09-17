import { PaymentsOverview } from "@/components/Charts/payments-overview";
import { UsedDevices } from "@/components/Charts/used-devices";
import { WeeksProfit } from "@/components/Charts/weeks-profit";

import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { ChatsCard } from "./_components/chats-card";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { RegionLabels } from "./_components/region-labels";
import TopChannelsWrapper from "./_components/top-channels";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
    page?: string;
  }>;
};

export default async function InventoryPage({ searchParams }: PropsType) {
  const { selected_time_frame, page } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);
  const currentPage = parseInt(page || '1', 10);

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        

        <div className="col-span-12 grid xl:col-span-12">
          <Suspense fallback={<TopChannelsSkeleton />}>
            <TopChannelsWrapper currentPage={currentPage} />
          </Suspense>
        </div>

        
      </div>
    </>
  );
}
