// backend/interfaces/location.interface.ts
export interface HistoryRecord {
  date: string;
  amount: number;
  status: 'paid' | 'failed' | 'pending';
  reference: string;
}

export interface Location {
  id: string;
  city: string;
  owner: string;
  rent: number;
  gst: number;
  total: number;
  tds: number;
  finalPayable: number;
  status: 'paid' | 'pending' | 'failed';
  adjustments: number;
  remarks: string;
  history: HistoryRecord[];
}