import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchMedicines } from "../services/medicine.service";
import { getAllBranches } from "../services/branch.service";
import { useGeolocation } from "../hooks/useGeolocation";
import { LeafletMap } from "../components/map/LeafletMap";
import { SearchBar } from "../components/common/SearchBar";
import { AvailabilityBadge } from "../components/common/AvailabilityBadge";
import { CardSkeleton } from "../components/common/LoadingSkeleton";

export function MapPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { position } = useGeolocation();

  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ["map-search", query, position?.latitude, position?.longitude],
    queryFn: () =>
      searchMedicines({
        q: query,
        page: 1,
        limit: 100,
        lat: position?.latitude,
        lng: position?.longitude,
        sortBy: "distance",
      }),
    enabled: query.length > 0,
  });

  const { data: branchData } = useQuery({
    queryKey: ["map-branches"],
    queryFn: () => getAllBranches(1, 200),
    enabled: query.length === 0,
  });

  const pins = query
    ? (searchData?.data.map((r) => ({
        id: r.branch.id,
        lat: r.branch.latitude,
        lng: r.branch.longitude,
        title: r.branch.name,
        info: `${r.medicine.name}: ₱${r.price.toFixed(2)} (${r.availability})`,
      })) ?? [])
    : (branchData?.data.map((b) => ({
        id: b.id,
        lat: b.latitude,
        lng: b.longitude,
        title: b.name,
        info: b.address,
      })) ?? []);

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col lg:flex-row">
      <div className="w-full border-b border-slate-200 bg-white p-4 lg:w-80 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="mb-4">
          <SearchBar initialQuery={query} />
        </div>

        {searchLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {!query && branchData && (
          <>
            <p className="mb-3 text-xs font-medium uppercase text-slate-400">All Branches</p>
            {branchData.data.map((b) => (
              <div key={b.id} className="mb-2 rounded-lg border border-slate-200 p-3 transition-colors hover:bg-orange-50">
                <p className="text-sm font-medium text-slate-800">{b.name}</p>
                <p className="text-xs text-slate-500">{b.address}</p>
              </div>
            ))}
          </>
        )}

        {!query && !branchData && (
          <p className="py-8 text-center text-sm text-slate-400">
            Search for a medicine or browse all branches
          </p>
        )}

        {query && searchData && searchData.data.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">
            No results found for &quot;{query}&quot;
          </p>
        )}

        {query && searchData?.data.map((r, i) => (
          <div
            key={`${r.branch.id}-${r.medicine.id}-${i}`}
            className="mb-2 rounded-lg border border-slate-200 p-3 transition-colors hover:bg-orange-50"
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-slate-800">{r.branch.name}</p>
              <AvailabilityBadge status={r.availability} />
            </div>
            <p className="text-xs text-slate-500">{r.branch.address}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-lg font-bold text-orange-600">&#8369;{r.price.toFixed(2)}</span>
              {r.distance !== null && (
                <span className="text-xs text-slate-400">{r.distance.toFixed(1)} km</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1">
        <LeafletMap
          pins={pins}
          userPosition={position ? { lat: position.latitude, lng: position.longitude } : null}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
