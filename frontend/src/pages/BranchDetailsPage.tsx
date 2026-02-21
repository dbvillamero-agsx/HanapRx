import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBranch } from "../services/branch.service";
import { AvailabilityBadge } from "../components/common/AvailabilityBadge";
import { CardSkeleton } from "../components/common/LoadingSkeleton";
import { ErrorState } from "../components/common/ErrorState";
import { EmptyState } from "../components/common/EmptyState";
import { getAvailability } from "../utils/availability";
import type { Inventory } from "../types";

export function BranchDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: branch, isLoading, error, refetch } = useQuery({
    queryKey: ["branch", id],
    queryFn: () => getBranch(parseInt(id!, 10)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <CardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <ErrorState message="Failed to load branch details" onRetry={() => refetch()} />
      </div>
    );
  }

  if (!branch) return null;

  const branchData = branch as typeof branch & { inventory: (Inventory & { medicine: { id: number; name: string; genericName: string } })[] };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link to="/" className="mb-4 inline-flex items-center text-sm text-orange-600 hover:text-orange-700">
        <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Search
      </Link>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-xs font-bold text-white">Rx</div>
          <span className="text-sm font-medium text-orange-600">Mercury Drug</span>
        </div>
        <h1 className="mb-4 text-2xl font-bold text-slate-800">{branchData.name}</h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Address</p>
            <p className="text-sm text-slate-700">{branchData.address}</p>
          </div>
          {branchData.contactNumber && (
            <div>
              <p className="text-xs font-medium uppercase text-slate-400">Contact</p>
              <p className="text-sm text-slate-700">{branchData.contactNumber}</p>
            </div>
          )}
          {branchData.businessHours && (
            <div>
              <p className="text-xs font-medium uppercase text-slate-400">Business Hours</p>
              <p className="text-sm text-slate-700">{branchData.businessHours}</p>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Link
            to={`/map?focus=${branchData.id}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            View on Map
          </Link>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-slate-800">Available Medicines</h2>

      {branchData.inventory.length === 0 ? (
        <EmptyState title="No medicines listed" description="This branch has no inventory records yet." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Medicine</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-slate-500 sm:table-cell">Generic Name</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Price</th>
                <th className="px-4 py-3 text-center text-xs font-medium uppercase text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {branchData.inventory.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{inv.medicine.name}</td>
                  <td className="hidden px-4 py-3 text-sm text-slate-500 sm:table-cell">{inv.medicine.genericName}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-orange-600">&#8369;{inv.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    <AvailabilityBadge status={getAvailability(inv.stockCount)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
