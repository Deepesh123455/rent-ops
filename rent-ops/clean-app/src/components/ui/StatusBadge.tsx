import {type PaymentStatus } from "../../types/location";

export const StatusBadge = ({ status }: { status: PaymentStatus }) => {
  const styles = {
    pending: "bg-orange-50 text-orange-600 border-orange-200",
    paid: "bg-green-50 text-green-600 border-green-200",
    failed: "bg-red-50 text-red-600 border-red-200",
  };

  const dotColors = {
    pending: "bg-orange-500",
    paid: "bg-green-500",
    failed: "bg-red-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`}></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};