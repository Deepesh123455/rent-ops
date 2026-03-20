type PaymentStatus = "pending" | "paid" | "failed";

export interface PaymentRecord {
    date: string;
    amount: number;
    status: PaymentStatus;
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
  status: PaymentStatus;
  adjustments: number;
  remarks: string;
  history: PaymentRecord[];
}

export const mockLocations: Location[] = [
  {
    id: "loc-001",
    city: "Bazpur",
    owner: "Rajesh Kumar Singh",
    rent: 85000,
    gst: 15300,
    total: 100300,
    tds: 8500,
    finalPayable: 91800,
    status: "pending",
    adjustments: 0,
    remarks: "Lease renewed in Jan 2026",
    history: [
      {
        date: "2026-02-01",
        amount: 91800,
        status: "paid",
        reference: "TXN-20260201-001",
      },
      {
        date: "2026-01-01",
        amount: 91800,
        status: "paid",
        reference: "TXN-20260101-001",
      },
    ],
  },
  {
    id: "loc-002",
    city: "Chandigarh (DLF)",
    owner: "Priya Sharma Estates",
    rent: 245000,
    gst: 44100,
    total: 289100,
    tds: 24500,
    finalPayable: 264600,
    status: "pending",
    adjustments: -5000,
    remarks: "Maintenance deduction applied",
    history: [
      {
        date: "2026-02-01",
        amount: 269600,
        status: "paid",
        reference: "TXN-20260201-002",
      },
    ],
  },
  {
    id: "loc-003",
    city: "Elante Mall",
    owner: "Nexus Select Trust",
    rent: 380000,
    gst: 68400,
    total: 448400,
    tds: 38000,
    finalPayable: 410400,
    status: "paid",
    adjustments: 0,
    remarks: "CAM charges included",
    history: [
      {
        date: "2026-03-01",
        amount: 410400,
        status: "paid",
        reference: "TXN-20260301-003",
      },
      {
        date: "2026-02-01",
        amount: 410400,
        status: "paid",
        reference: "TXN-20260201-003",
      },
      {
        date: "2026-01-01",
        amount: 410400,
        status: "paid",
        reference: "TXN-20260101-003",
      },
    ],
  },
  {
    id: "loc-004",
    city: "Ladakh",
    owner: "Tenzin Norbu Properties",
    rent: 42000,
    gst: 7560,
    total: 49560,
    tds: 4200,
    finalPayable: 45360,
    status: "failed",
    adjustments: 0,
    remarks: "Bank details verification pending",
    history: [
      {
        date: "2026-02-01",
        amount: 45360,
        status: "failed",
        reference: "TXN-20260201-004",
      },
    ],
  },
  {
    id: "loc-005",
    city: "Nainital",
    owner: "Himalayan Realty Group",
    rent: 67000,
    gst: 12060,
    total: 79060,
    tds: 6700,
    finalPayable: 72360,
    status: "pending",
    adjustments: 2000,
    remarks: "Security deposit adjustment",
    history: [],
  },
  {
    id: "loc-006",
    city: "Dehradun",
    owner: "Amit Verma & Sons",
    rent: 125000,
    gst: 22500,
    total: 147500,
    tds: 12500,
    finalPayable: 135000,
    status: "paid",
    adjustments: 0,
    remarks: "Long-term lease - 5 years",
    history: [
      {
        date: "2026-03-01",
        amount: 135000,
        status: "paid",
        reference: "TXN-20260301-006",
      },
    ],
  },
  {
    id: "loc-007",
    city: "Haridwar",
    owner: "Ganga Properties Ltd",
    rent: 55000,
    gst: 9900,
    total: 64900,
    tds: 5500,
    finalPayable: 59400,
    status: "pending",
    adjustments: -1500,
    remarks: "Water damage deduction",
    history: [
      {
        date: "2026-02-01",
        amount: 60900,
        status: "paid",
        reference: "TXN-20260201-007",
      },
    ],
  },
  {
    id: "loc-008",
    city: "Mussoorie",
    owner: "Hill Station Estates",
    rent: 92000,
    gst: 16560,
    total: 108560,
    tds: 9200,
    finalPayable: 99360,
    status: "pending",
    adjustments: 0,
    remarks: "Seasonal rate applicable",
    history: [],
  },
];
