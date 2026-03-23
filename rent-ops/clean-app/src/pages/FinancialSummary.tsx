import { IndianRupee, ReceiptText, FileText, Wallet } from "lucide-react";

import CountUpPkg from "react-countup";

const CountUp = (CountUpPkg as any).default || CountUpPkg;
export interface FinancialSummaryProps {
  totalRent: number;
  totalGst: number;
  totalTds: number;
  finalPayable: number;
}

export default function FinancialSummary({
  totalRent = 0,
  totalGst = 0,
  totalTds = 0,
  finalPayable = 0,
}: FinancialSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    { title: "Total Rent", amount: totalRent, icon: IndianRupee },
    { title: "Total GST", amount: totalGst, icon: ReceiptText },
    { title: "Total TDS", amount: totalTds, icon: FileText },
    { title: "Final Payable", amount: finalPayable, icon: Wallet },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="flex flex-col p-6 bg-white border border-gray-100 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">
                {card.title}
              </span>
              <div className="p-2 bg-indigo-50/80 rounded-lg text-indigo-600">
                <Icon size={18} strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              ₹
              <CountUp
                end={card.amount}
                duration={2.5} 
                formattingFn={formatCurrency} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
