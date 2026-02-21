import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllInventory, createInventory, updateInventory, deleteInventory } from "../../services/inventory.service";
import { getAllBranches } from "../../services/branch.service";
import { getAllMedicines } from "../../services/medicine.service";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { ErrorState } from "../../components/common/ErrorState";
import { AvailabilityBadge } from "../../components/common/AvailabilityBadge";
import { getAvailability } from "../../utils/availability";
import type { Inventory } from "../../types";

const emptyForm = { branchId: 0, medicineId: 0, stockCount: 0, price: 0 };

export function InventoryPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Inventory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-inventory", page],
    queryFn: () => getAllInventory(page, 10),
  });

  const { data: branches } = useQuery({
    queryKey: ["admin-branches-list"],
    queryFn: () => getAllBranches(1, 200),
  });

  const { data: medicines } = useQuery({
    queryKey: ["admin-medicines-list"],
    queryFn: () => getAllMedicines(1, 200),
  });

  const createMut = useMutation({
    mutationFn: () => createInventory({
      branchId: Number(formData.branchId),
      medicineId: Number(formData.medicineId),
      stockCount: Number(formData.stockCount),
      price: Number(formData.price),
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-inventory"] }); resetForm(); },
  });

  const updateMut = useMutation({
    mutationFn: () => updateInventory(editing!.id, {
      stockCount: Number(formData.stockCount),
      price: Number(formData.price),
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-inventory"] }); resetForm(); },
  });

  const deleteMut = useMutation({
    mutationFn: deleteInventory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-inventory"] }),
  });

  function resetForm() {
    setFormData(emptyForm);
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(inv: Inventory) {
    setEditing(inv);
    setFormData({
      branchId: inv.branchId,
      medicineId: inv.medicineId,
      stockCount: inv.stockCount,
      price: inv.price,
    });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) updateMut.mutate();
    else createMut.mutate();
  }

  const set = (field: string, value: string | number) => setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
          Add Inventory
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 font-semibold text-slate-800">{editing ? "Edit Inventory" : "New Inventory Record"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {!editing && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Branch</label>
                  <select value={formData.branchId} onChange={(e) => set("branchId", e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100">
                    <option value={0}>Select branch</option>
                    {branches?.data.map((b) => <option key={b.id} value={b.id}>{b.pharmacy?.name} - {b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Medicine</label>
                  <select value={formData.medicineId} onChange={(e) => set("medicineId", e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100">
                    <option value={0}>Select medicine</option>
                    {medicines?.data.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.genericName})</option>)}
                  </select>
                </div>
              </>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Stock Count</label>
              <input type="number" min={0} value={formData.stockCount} onChange={(e) => set("stockCount", e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Price (PHP)</label>
              <input type="number" min={0} step="0.01" value={formData.price} onChange={(e) => set("price", e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
          </div>
        </form>
      )}

      {isLoading && <TableSkeleton />}
      {error && <ErrorState message="Failed to load inventory" onRetry={() => refetch()} />}

      {data && (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Medicine</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-slate-500 sm:table-cell">Branch</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Stock</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Price</th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((inv: Inventory) => (
                  <tr key={inv.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{inv.medicine?.name}</td>
                    <td className="hidden px-4 py-3 text-sm text-slate-500 sm:table-cell">
                      {inv.branch?.pharmacy?.name} - {inv.branch?.name}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-slate-700">{inv.stockCount}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-sky-700">&#8369;{inv.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <AvailabilityBadge status={getAvailability(inv.stockCount)} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => startEdit(inv)} className="mr-2 text-sm text-sky-600 hover:text-sky-700">Edit</button>
                      <button onClick={() => { if (confirm("Delete this record?")) deleteMut.mutate(inv.id); }} className="text-sm text-red-600 hover:text-red-700">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50">Previous</button>
              <span className="text-sm text-slate-500">Page {page} of {data.pagination.totalPages}</span>
              <button onClick={() => setPage((p) => p + 1)} disabled={page >= data.pagination.totalPages} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
