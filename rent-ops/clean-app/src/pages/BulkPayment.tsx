import { useState } from "react";

import { Layers, Loader2, X, Zap } from "lucide-react";
import { useLocations } from "../hooks/useLocations";

const BulkPayment = () => {
  const { locationsQuery, bulkPayMutation } = useLocations();
  const { data } = locationsQuery;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter pending/failed locations aur unka total calculate karein
  const eligibleLocations =
    data?.filter(
      (loc) =>
        loc.status.toLowerCase() === "pending" ||
        loc.status.toLowerCase() === "failed",
    ) || [];

  const locationCount = eligibleLocations.length;
  const totalRent = eligibleLocations.reduce((sum, loc) => sum + loc.rent, 0);
  const totalGst = eligibleLocations.reduce((sum, loc) => sum + loc.gst, 0);
  const totalTds = eligibleLocations.reduce((sum, loc) => sum + loc.tds, 0);
  const finalPayable = eligibleLocations.reduce(
    (sum, loc) => sum + loc.finalPayable,
    0,
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
      amount,
    );
  };

  const handleOpenModal = () => {
    if (locationCount === 0) {
      alert("No pending or failed payments to process.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!bulkPayMutation.isPending) {
      setIsModalOpen(false);
    }
  };

  const handleConfirmBulkPay = () => {
    bulkPayMutation.mutate(
      { idempotencyKey: crypto.randomUUID() },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      },
    );
  };

  return (
    <>
      <div className="flex justify-end mb-2">
        <button
          onClick={handleOpenModal}
          disabled={locationCount === 0}
          className={`flex items-center gap-2 px-5 py-2.5 bg-[#5A52E5] text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5A52E5] focus:ring-offset-2 ${
            locationCount === 0
              ? "opacity-50 cursor-not-allowed grayscale"
              : "hover:bg-[#4A42C5] hover:shadow-md active:scale-95 cursor-pointer"
          }`}
        >
          <Layers size={18} />
          Bulk Payment
        </button>
      </div>

      {/* Bulk Payment Confirmation Modal (Matching your screenshot) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Bulk Payment
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={bulkPayMutation.isPending}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <p className="text-sm text-gray-600">
                Please review the details below before proceeding with the bulk
                payment for <strong>{locationCount} locations</strong>.
              </p>

              {/* Summary Box */}
              <div className="bg-[#F8F9FA] rounded-xl p-5 space-y-3 text-sm border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total Rent:</span>
                  <span className="font-medium text-gray-900">
                    ₹{formatCurrency(totalRent)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total GST:</span>
                  <span className="font-medium text-gray-900">
                    ₹{formatCurrency(totalGst)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Total TDS:</span>
                  <span className="font-medium text-red-500">
                    - ₹{formatCurrency(totalTds)}
                  </span>
                </div>

                <div className="pt-3 mt-1 border-t border-gray-200/80 flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900">
                    Final Payable:
                  </span>
                  <span className="text-lg font-bold text-[#5A52E5]">
                    ₹{formatCurrency(finalPayable)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={handleCloseModal}
                disabled={bulkPayMutation.isPending}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBulkPay}
                disabled={bulkPayMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#5A52E5] rounded-lg hover:bg-[#4A42C5] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
              >
                {bulkPayMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Pay Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkPayment;
