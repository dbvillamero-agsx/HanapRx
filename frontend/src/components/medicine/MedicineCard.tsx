import { Link } from "react-router-dom";
import { AvailabilityBadge } from "../common/AvailabilityBadge";
import type { SearchResult } from "../../types";

interface MedicineCardProps {
  result: SearchResult;
  onViewMap?: () => void;
}

export function MedicineCard({ result, onViewMap }: MedicineCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-1 flex items-start justify-between">
        <h3 className="font-semibold text-slate-800">{result.branch.name}</h3>
        <AvailabilityBadge status={result.availability} />
      </div>

      <p className="mb-3 text-sm text-slate-500">{result.branch.address}</p>

      <div className="mb-4 flex items-center justify-between">
        <span className="text-2xl font-bold text-orange-600">
          &#8369;{result.price.toFixed(2)}
        </span>
        {result.distance !== null && (
          <span className="text-sm text-slate-500">
            {result.distance < 1
              ? `${(result.distance * 1000).toFixed(0)}m away`
              : `${result.distance.toFixed(1)}km away`}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Link
          to={`/branch/${result.branch.id}`}
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          View Branch
        </Link>
        {onViewMap && (
          <button
            onClick={onViewMap}
            className="flex-1 rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            View on Map
          </button>
        )}
      </div>
    </div>
  );
}
