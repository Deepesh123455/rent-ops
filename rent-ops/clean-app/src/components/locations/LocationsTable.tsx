import { useState } from "react";
import { Circle, Zap, Lightbulb, X } from "lucide-react";
import { useLocations } from "../../hooks/useLocations";
import { StatusBadge } from "../ui/StatusBadge";

export const LocationsTable = ({ activeFilter }: { activeFilter: string }) => {
  const { locationsQuery, payMutation, utilitiesMutation } = useLocations();
  const { data, isLoading, isError } = locationsQuery;

  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenPayModal = (location: any) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLocation(null);
  };

  const handleConfirmPay = () => {
    if (!selectedLocation) return;

    payMutation.mutate(
      { locationId: selectedLocation.id, idempotencyKey: crypto.randomUUID() },
      {
        onSuccess: () => {
          handleCloseModal();
        },
      },
    );
  };

  const handleUtilitiesClick = (locationId: string) => {
    utilitiesMutation.mutate({
      locationId,
      idempotencyKey: crypto.randomUUID(),
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
      amount,
    );
  };

  const filteredData = data?.filter((row) => {
    if (activeFilter === "All") return true;
    return row.status.toLowerCase() === activeFilter.toLowerCase();
  });

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">Loading locations...</div>
    );
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load locations.
      </div>
    );

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-gray-500 bg-white border-b border-gray-100">
              <tr>
                <th className="px-4 py-4 font-medium w-10 text-center">
                  <Circle size={18} className="text-indigo-400 inline-block" />
                </th>
                {/* Yahan se extra khali <th> hata diya gaya hai */}
                <th className="px-4 py-4 font-medium">City</th>
                <th className="px-4 py-4 font-medium">Owner</th>
                <th className="px-4 py-4 font-medium text-right">Rent</th>
                <th className="px-4 py-4 font-medium text-right">GST</th>
                <th className="px-4 py-4 font-medium text-right">TDS</th>
                <th className="px-4 py-4 font-medium text-right">
                  Final Payable
                </th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData?.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-4 text-center">
                    <Circle
                      size={18}
                      className="text-indigo-400 inline-block"
                    />
                  </td>
                  <td className="px-4 py-4 font-semibold text-gray-900">
                    {row.city}
                  </td>
                  <td className="px-4 py-4 text-gray-500">{row.owner}</td>
                  <td className="px-4 py-4 text-right text-gray-500">
                    ₹{formatCurrency(row.rent)}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-500">
                    ₹{formatCurrency(row.gst)}
                  </td>
                  <td className="px-4 py-4 text-right text-gray-500">
                    ₹{formatCurrency(row.tds)}
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-gray-900">
                    ₹{formatCurrency(row.finalPayable)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleOpenPayModal(row)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors bg-white text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
                      >
                        <Zap size={14} />
                        Pay
                      </button>
                      <button
                        onClick={() => handleUtilitiesClick(row.id)}
                        disabled={
                          utilitiesMutation.isPending &&
                          utilitiesMutation.variables?.locationId === row.id
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                          utilitiesMutation.isPending &&
                          utilitiesMutation.variables?.locationId === row.id
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
                        }`}
                      >
                        <Lightbulb
                          size={14}
                          className={
                            utilitiesMutation.isPending &&
                            utilitiesMutation.variables?.locationId === row.id
                              ? "animate-pulse"
                              : ""
                          }
                        />
                        {utilitiesMutation.isPending &&
                        utilitiesMutation.variables?.locationId === row.id
                          ? "Processing..."
                          : "Utilities"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData?.length === 0 && (
                <tr>
                  <td
                    colSpan={9} // Ise 10 se 9 kar diya hai
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No locations found for "{activeFilter}" status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {isModalOpen && selectedLocation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Payment
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={payMutation.isPending}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">
                Please review the details below before proceeding with the
                payment for <strong>{selectedLocation.city}</strong>.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Owner:</span>
                  <span className="font-medium text-gray-900">
                    {selectedLocation.owner}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rent:</span>
                  <span className="font-medium text-gray-900">
                    ₹{formatCurrency(selectedLocation.rent)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">GST:</span>
                  <span className="font-medium text-gray-900">
                    ₹{formatCurrency(selectedLocation.gst)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">TDS:</span>
                  <span className="font-medium text-gray-900 text-red-500">
                    - ₹{formatCurrency(selectedLocation.tds)}
                  </span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900">
                    Final Payable:
                  </span>
                  <span className="text-lg font-bold text-indigo-600">
                    ₹{formatCurrency(selectedLocation.finalPayable)}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={handleCloseModal}
                disabled={payMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPay}
                disabled={payMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {payMutation.isPending ? (
                  <>
                    <Zap size={16} className="animate-pulse" />
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
