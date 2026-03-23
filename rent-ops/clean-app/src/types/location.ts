export type PaymentStatus = "pending" | "paid" | "failed";

export interface LocationData {
  id: string;
  city: string;
  owner: string;
  rent: number;
  gst: number;
  tds: number;
  finalPayable: number;
  status: PaymentStatus;
}

export interface SummaryApiResponse {
  id: string;
  city: string;
  owner: string;
  rent: number;
  gst: number;
  tds: number;
  finalPayable: number;
  status: PaymentStatus;
}