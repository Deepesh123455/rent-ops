import { Filter } from "lucide-react";

export const FilterBar = ({
  activeFilter,
  setActiveFilter,
}: {
  activeFilter: string;
  setActiveFilter: (f: string) => void;
}) => {
  const filters = ["All", "Pending", "Paid", "Failed"];

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="p-2 text-gray-400 bg-white border border-gray-200 rounded-lg shadow-sm">
        <Filter size={18} />
      </div>
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full cursor-pointer text-sm font-medium transition-colors ${
              activeFilter === filter
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
};