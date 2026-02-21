import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllBranches } from "../services/branch.service";
import { useGeolocation } from "../hooks/useGeolocation";
import { haversineDistance } from "../utils/haversine";
import { LeafletMap } from "../components/map/LeafletMap";
import { CardSkeleton } from "../components/common/LoadingSkeleton";
import { ErrorState } from "../components/common/ErrorState";

export function BranchLocatorPage() {
  const { position } = useGeolocation();
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["all-branches"],
    queryFn: () => getAllBranches(1, 200),
  });

  const branches = (data?.data ?? [])
    .map((b) => ({
      ...b,
      distance: position
        ? haversineDistance(position.latitude, position.longitude, b.latitude, b.longitude)
        : null,
    }))
    .filter((b) =>
      search
        ? b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.address.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) =>
      a.distance !== null && b.distance !== null ? a.distance - b.distance : 0
    );

  const pins = branches.map((b) => ({
    id: b.id,
    lat: b.latitude,
    lng: b.longitude,
    title: b.name,
    info: b.address,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Mercury Drug Branches</h1>
        <p className="text-sm text-slate-500">
          Find the nearest branch to you
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by branch name or address..."
          className="w-full max-w-md rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        />
      </div>

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200">
        <LeafletMap
          pins={pins}
          userPosition={position ? { lat: position.latitude, lng: position.longitude } : null}
          className="h-[350px] w-full"
          zoom={11}
        />
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {error && <ErrorState message="Failed to load branches" onRetry={() => refetch()} />}

      {branches.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {branches.map((b) => (
            <Link
              key={b.id}
              to={`/branch/${b.id}`}
              className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">{b.name}</h3>
                {b.distance !== null && (
                  <span className="shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
                    {b.distance < 1
                      ? `${(b.distance * 1000).toFixed(0)}m`
                      : `${b.distance.toFixed(1)}km`}
                  </span>
                )}
              </div>
              <p className="mb-2 text-sm text-slate-500">{b.address}</p>
              {b.businessHours && (
                <p className="text-xs text-slate-400">{b.businessHours}</p>
              )}
              {b.contactNumber && (
                <p className="mt-1 text-xs text-slate-400">{b.contactNumber}</p>
              )}
            </Link>
          ))}
        </div>
      )}

      {!isLoading && branches.length === 0 && search && (
        <p className="py-8 text-center text-sm text-slate-400">
          No branches found matching &quot;{search}&quot;
        </p>
      )}
    </div>
  );
}
