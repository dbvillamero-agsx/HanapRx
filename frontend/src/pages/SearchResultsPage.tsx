import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchMedicines } from "../services/medicine.service";
import { useGeolocation } from "../hooks/useGeolocation";
import { MedicineCard } from "../components/medicine/MedicineCard";
import { CardSkeleton } from "../components/common/LoadingSkeleton";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [sortBy, setSortBy] = useState<string>("distance");
  const [availability, setAvailability] = useState<string>("");
  const [page, setPage] = useState(1);
  const { position } = useGeolocation();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["search", query, page, sortBy, availability, position?.latitude, position?.longitude],
    queryFn: () =>
      searchMedicines({
        q: query,
        page,
        limit: 20,
        lat: position?.latitude,
        lng: position?.longitude,
        sortBy,
        availability: availability || undefined,
      }),
    enabled: query.length > 0,
  });

  const handleViewMap = (branchId: number) => {
    navigate(`/map?q=${encodeURIComponent(query)}&focus=${branchId}`);
  };

  const medicineName = data?.data[0]?.medicine.name;
  const genericName = data?.data[0]?.medicine.genericName;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {medicineName ? (
            <>
              {medicineName}
              <span className="ml-2 text-base font-normal text-slate-400">({genericName})</span>
            </>
          ) : (
            <>Results for &quot;{query}&quot;</>
          )}
        </h1>
        {data && (
          <p className="text-sm text-slate-500">
            Available at {data.data.length} {data.data.length === 1 ? "branch" : "branches"}
          </p>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        >
          <option value="distance">Sort by: Nearest</option>
          <option value="price">Sort by: Lowest Price</option>
        </select>

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        >
          <option value="">All Availability</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && <ErrorState message="Failed to load results" onRetry={() => refetch()} />}

      {data && data.data.length === 0 && (
        <EmptyState
          title="No results found"
          description={`No medicines matching "${query}" were found across Mercury Drug branches.`}
        />
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((result, i) => (
              <MedicineCard
                key={`${result.branch.id}-${result.medicine.id}-${i}`}
                result={result}
                onViewMap={() => handleViewMap(result.branch.id)}
              />
            ))}
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 text-sm text-slate-500">
                Page {page} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
