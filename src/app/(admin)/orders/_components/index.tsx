// OrdersWrapper.tsx
import { getOrdersData } from "../fetch";
import { OrdersTable } from "./OrdersTable";

export default async function OrdersWrapper({ className }: { className?: string }) {
  const data = await getOrdersData(); // Server-side data fetching
  return <OrdersTable initialData={data} className={className} />;
}
