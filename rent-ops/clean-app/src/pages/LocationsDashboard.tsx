import { useState } from "react";
import { Sparkles } from "lucide-react";
import { FilterBar } from "../components/locations/FilterBar";
import { LocationsTable } from "../components/locations/LocationsTable";

export default function LocationsDashboard() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="relative min-h-screen p-8 bg-slate-50">
      <FilterBar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <LocationsTable activeFilter={activeFilter} />

      <button className="fixed bottom-8 right-8 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors cursor-pointer">
        <Sparkles size={24} />
      </button>
    </div>
  );
}