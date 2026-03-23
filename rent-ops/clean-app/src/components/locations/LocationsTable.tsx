import { Circle, ChevronRight, Zap, Lightbulb } from "lucide-react";
import { useLocations } from "../../hooks/useLocations";
import { StatusBadge } from "../ui/StatusBadge";

export const LocationsTable = ({ activeFilter }: { activeFilter: string }) => {
  const { locationsQuery, payMutation, utilitiesMutation } = useLocations();
  const { data, isLoading, isError } = locationsQuery;

  const handlePayClick = (locationId: string) => {
    payMutation.mutate({ locationId, idempotencyKey: crypto.randomUUID() });
  };

  const handleUtilitiesClick = (locationId: string) => {
    utilitiesMutation.mutate({ locationId, idempotencyKey: crypto.randomUUID() });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);
  };

  const filteredData = data?.filter((row) => {
    if (activeFilter === "All") return true;
    return row.status.toLowerCase() === activeFilter.toLowerCase();
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading locations...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Failed to load locations.</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-gray-500 bg-white border-b border-gray-100">
            <tr>
              <th className="px-4 py-4 font-medium w-10"><Circle size={18} className="text-indigo-400" /></th>
              <th className="px-2 py-4 font-medium w-10"></th>
              <th className="px-4 py-4 font-medium">City</th>
              <th className="px-4 py-4 font-medium">Owner</th>
              <th className="px-4 py-4 font-medium text-right">Rent</th>
              <th className="px-4 py-4 font-medium text-right">GST</th>
              <th className="px-4 py-4 font-medium text-right">TDS</th>
              <th className="px-4 py-4 font-medium text-right">Final Payable</th>
              <th className="px-4 py-4 font-medium">Status</th>
              <th className="px-4 py-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData?.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-4"><Circle size={18} className="text-indigo-400" /></td>
                <td className="px-2 py-4 text-gray-400"><ChevronRight size={16} /></td>
                <td className="px-4 py-4 font-semibold text-gray-900">{row.city}</td>
                <td className="px-4 py-4 text-gray-500">{row.owner}</td>
                <td className="px-4 py-4 text-right text-gray-500">₹{formatCurrency(row.rent)}</td>
                <td className="px-4 py-4 text-right text-gray-500">₹{formatCurrency(row.gst)}</td>
                <td className="px-4 py-4 text-right text-gray-500">₹{formatCurrency(row.tds)}</td>
                <td className="px-4 py-4 text-right font-bold text-gray-900">₹{formatCurrency(row.finalPayable)}</td>
                <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handlePayClick(row.id)}
                      disabled={payMutation.isPending && payMutation.variables?.locationId === row.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        payMutation.isPending && payMutation.variables?.locationId === row.id
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <Zap size={14} className={payMutation.isPending && payMutation.variables?.locationId === row.id ? "animate-pulse" : ""} />
                      {payMutation.isPending && payMutation.variables?.locationId === row.id ? "Paying..." : "Pay"}
                    </button>
                    <button
                      onClick={() => handleUtilitiesClick(row.id)}
                      disabled={utilitiesMutation.isPending && utilitiesMutation.variables?.locationId === row.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        utilitiesMutation.isPending && utilitiesMutation.variables?.locationId === row.id
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <Lightbulb size={14} className={utilitiesMutation.isPending && utilitiesMutation.variables?.locationId === row.id ? "animate-pulse" : ""} />
                      {utilitiesMutation.isPending && utilitiesMutation.variables?.locationId === row.id ? "Processing..." : "Utilities"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredData?.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                  No locations found for "{activeFilter}" status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};