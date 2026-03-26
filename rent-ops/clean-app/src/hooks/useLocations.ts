import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { type SummaryApiResponse } from "../types/location";

export const useLocations = () => {
  const queryClient = useQueryClient();

  const locationsQuery = useQuery<SummaryApiResponse[]>({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await axios.get(
        "http://localhost:5000/api/v1/locations",
      );
      return response.data.data;
    },
  });

  const payMutation = useMutation({
    mutationFn: async ({
      locationId,
      idempotencyKey,
    }: {
      locationId: string;
      idempotencyKey: string;
    }) => {
      const response = await axios.post(
        `http://localhost:5000/api/v1/payments/pay/${locationId}`,
        {},
        { headers: { "x-idempotency-key": idempotencyKey } },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      alert("Payment successful!");
    },
    onError: (error: any) => {
      alert(
        `Payment failed: ${error.response?.data?.message || error.message}`,
      );
    },
  });

  const bulkPayMutation = useMutation({
    mutationFn: async ({ idempotencyKey }: { idempotencyKey: string }) => {
      const response = await axios.post(
        `http://localhost:5000/api/v1/payments/pay/bulk`,
        {}, // Empty body
        { headers: { "x-idempotency-key": idempotencyKey } },
      );
      return response.data.data; // Returning the 'data' object from backend simulation
    },
    onSuccess: (data) => {
      // Invalidate locations so the table updates with new statuses
      queryClient.invalidateQueries({ queryKey: ["locations"] });

      // Show a detailed alert using the data returned from backend
      alert(
        `Bulk Payment Completed!\n\n` +
          `Total Found: ${data.total_locations_found}\n` +
          `Successful: ${data.success_count}\n` +
          `Failed: ${data.failed_count}\n` +
          `Amount Processed: ₹${data.total_amount_processed}`,
      );
    },
    onError: (error: any) => {
      alert(
        `Bulk payment failed: ${error.response?.data?.message || error.message}`,
      );
    },
  });

  const utilitiesMutation = useMutation({
    mutationFn: async ({
      locationId,
      idempotencyKey,
    }: {
      locationId: string;
      idempotencyKey: string;
    }) => {
      const response = await axios.post(
        `http://localhost:5000/api/v1/utilities/pay/utilities/${locationId}`,
        {},
        { headers: { "x-idempotency-key": idempotencyKey } },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      alert("Utilities payment successful!");
    },
    onError: (error: any) => {
      alert(
        `Utilities payment failed: ${error.response?.data?.message || error.message}`,
      );
    },
  });

  return {
    locationsQuery,
    payMutation,
    utilitiesMutation,
    bulkPayMutation,
  };
};
