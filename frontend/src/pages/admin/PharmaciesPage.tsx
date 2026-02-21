import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllPharmacies, createPharmacy, updatePharmacy, deletePharmacy } from "../../services/pharmacy.service";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { ErrorState } from "../../components/common/ErrorState";
import type { Pharmacy } from "../../types";

export function PharmaciesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Pharmacy | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", logoUrl: "" });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-pharmacies", page],
    queryFn: () => getAllPharmacies(page, 10),
  });

  const createMut = useMutation({
    mutationFn: () => createPharmacy({ name: formData.name, logoUrl: formData.logoUrl || null }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-pharmacies"] }); resetForm(); },
  });

  const updateMut = useMutation({
    mutationFn: () => updatePharmacy(editing!.id, { name: formData.name, logoUrl: formData.logoUrl || null }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-pharmacies"] }); resetForm(); },
  });

  const deleteMut = useMutation({
    mutationFn: deletePharmacy,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-pharmacies"] }),
  });

  function resetForm() {
    setFormData({ name: "", logoUrl: "" });
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(p: Pharmacy) {
    setEditing(p);
    setFormData({ name: p.name, logoUrl: p.logoUrl || "" });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) updateMut.mutate();
    else createMut.mutate();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Pharmacies</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          Add Pharmacy
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 font-semibold text-slate-800">
            {editing ? "Edit Pharmacy" : "New Pharmacy"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Logo URL</label>
              <input
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
              {editing ? "Update" : "Create"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading && <TableSkeleton />}
      {error && <ErrorState message="Failed to load pharmacies" onRetry={() => refetch()} />}

      {data && (
        <>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Name</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((p: Pharmacy) => (
                  <tr key={p.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 text-sm text-slate-500">{p.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{p.name}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => startEdit(p)} className="mr-2 text-sm text-sky-600 hover:text-sky-700">Edit</button>
                      <button onClick={() => { if (confirm("Delete this pharmacy?")) deleteMut.mutate(p.id); }} className="text-sm text-red-600 hover:text-red-700">Delete</button>
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
