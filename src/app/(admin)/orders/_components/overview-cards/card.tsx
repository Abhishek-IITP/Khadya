import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type PropsType = {
  title: string;
  value: string | number;
  growthRate?: number;
  Icon: LucideIcon;
  bgColor?: string;
  iconColor?: string;
};

export function OverviewCard({
  title,
  value,
  growthRate,
  Icon,
  bgColor = "bg-primary",
  iconColor = "text-white",
}: PropsType) {
  const isPositive = growthRate && growthRate > 0;
  const isNegative = growthRate && growthRate < 0;

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className={cn("flex size-12 items-center justify-center rounded-full", bgColor)}>
        <Icon className={cn("text-2xl", iconColor)} />
      </div>

      <div className="mt-6 flex items-end justify-between">
        <div>
          <h3 className="text-body-2xlg font-bold text-dark dark:text-white">{value}</h3>
          <span className="text-body-sm font-medium text-dark-4 dark:text-dark-6">{title}</span>
        </div>

        {growthRate !== undefined && (
          <span
            className={cn("flex items-center gap-1.5 text-body-sm font-medium", {
              "text-green": isPositive,
              "text-red": isNegative,
              "text-dark-4 dark:text-dark-6": !isPositive && !isNegative,
            })}
          >
            {isPositive && "↗"}
            {isNegative && "↘"}
            {Math.abs(growthRate)}%
          </span>
        )}
      </div>
    </div>
  );
}
