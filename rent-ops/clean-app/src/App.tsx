import FinancialSummary from "./pages/FinancialSummary";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LocationsDashboard from "./pages/LocationsDashboard";

interface SummaryApiResponse {
  total_rent_payable: number;
  total_gst_payable: number;
  total_tds_payable: number;
  total_adjustments: number;
  total_final_payable: number;
  total_locations: number;
}

const App = () => {
  const { data, isLoading, isError, error } = useQuery<SummaryApiResponse>({
    queryKey: ["locationsSummary"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:5000/api/v1/locations/summary",
      );
      console.log(response.data);

      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 font-medium">
        Loading financial data...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error fetching data: {error?.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <FinancialSummary
        totalRent={data?.total_rent_payable || 0}
        totalGst={data?.total_gst_payable || 0}
        totalTds={data?.total_tds_payable || 0}
        finalPayable={data?.total_final_payable || 0}
      />
      <div className="mt-8">
        <LocationsDashboard />
      </div>
    </div>
  );
};

export default App;
