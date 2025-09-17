import { Download, Package } from 'lucide-react';


interface MetricCardProps {
  icon?: React.ReactNode;
  title: string;
  value: string;
  currency?: string;
  isLarge?: boolean;
}

export function MetricCard({ icon = <Package className="w-6 h-6" />, title, value, currency, isLarge = false }: MetricCardProps) {
  if (isLarge) {
    return (

      <div className="flex justify-between bg-[#D9D7FC] dark:bg-[#242F52]   rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
        <div>
        <h2 className="text-gray-700 dark:text-gray-300 text-base sm:text-lg font-medium mb-2">{title}</h2>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {value} <span className="text-sm sm:text-lg font-normal text-gray-600 dark:text-gray-400">{currency}</span>
        </div>
        </div>
      <div>
        <div className="flex items-center space-x-2 w-full justify-end text-white p-2.5 rounded-xl bg-green-500  cursor-pointer">
          <Download className="size-10" />
          <span className="text-xl">Download Report</span>
        </div>
      </div>
      </div>
   
    );
  }

}