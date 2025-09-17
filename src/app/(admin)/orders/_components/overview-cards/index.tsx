import { 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  DollarSign,
  Package,
  CheckCircle,
  XCircle,
  Truck
} from "lucide-react";
import { getOrdersOverviewData } from "../../fetch";
import { OverviewCard } from "./card";

export async function OverviewCardsGroup() {
  const data = await getOrdersOverviewData();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        title="Total Orders"
        value={data.totalOrders}
        growthRate={data.ordersGrowthRate}
        Icon={ShoppingCart}
        bgColor="bg-primary"
      />
      
      <OverviewCard
        title="Revenue"
        value={`₹${data.totalRevenue.toLocaleString()}`}
        growthRate={data.revenueGrowthRate}
        Icon={DollarSign}
        bgColor="bg-green-500"
      />
      
      <OverviewCard
        title="Delivered Orders"
        value={data.deliveredOrders}
        growthRate={data.deliveredGrowthRate}
        Icon={CheckCircle}
        bgColor="bg-blue-500"
      />
      
      <OverviewCard
        title="Pending Orders"
        value={data.pendingOrders}
        growthRate={data.pendingGrowthRate}
        Icon={Truck}
        bgColor="bg-orange-500"
      />
    </div>
  );
}
