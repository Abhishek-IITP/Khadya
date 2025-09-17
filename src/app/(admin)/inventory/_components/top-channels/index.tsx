// TopChannelsWrapper.tsx
import { getTopChannels } from "@/app/(admin)/inventory/fetch";
import { TopChannelsTable } from "./TopChannels";

export default async function TopChannelsWrapper({ 
  className, 
  currentPage = 1 
}: { 
  className?: string;
  currentPage?: number;
}) {
  const data = await getTopChannels(currentPage, 10); // Server-side data fetching with pagination
  return <TopChannelsTable initialData={data} className={className} />;
}
