import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllBranches, createBranch, updateBranch, deleteBranch } from "../../services/branch.service";
import { getAllPharmacies } from "../../services/pharmacy.service";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { ErrorState } from "../../components/common/ErrorState";
import type { Branch } from "../../types";

const emptyForm = { pharmacyId: 0, name: "", address: "", latitude: 0, longitude: 0, contactNumber: "", businessHours: "" };

export function BranchesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Branch | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-branches", page],
    queryFn: () => getAllBranches(page, 10),
  });

  const { data: pharmacies } = useQuery({
    queryKey: ["admin-pharmacies-list"],
    queryFn: () => getAllPharmacies(1, 100),
  });

  const createMut = useMutation({
    mutationFn: () => createBranch({
      ...formData,
      pharmacyId: Number(formData.pharmacyId),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      contactNumber: formData.contactNumber || null,
      businessHours: formData.businessHours || null,
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-branches"] }); resetForm(); },
  });

  const updateMut = useMutation({
    mutationFn: () => updateBranch(editing!.id, {
      ...formData,
      pharmacyId: Number(formData.pharmacyId),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      contactNumber: formData.contactNumber || null,
      businessHours: formData.businessHours || null,
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-branches"] }); resetForm(); },
  });

  const deleteMut = useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-branches"] }),
  });

  function resetForm() {
    setFormData(emptyForm);
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(b: Branch) {
    setEditing(b);
    setFormData({
      pharmacyId: b.pharmacyId,
      name: b.name,
      address: b.address,
      latitude: b.latitude,
      longitude: b.longitude,
      contactNumber: b.contactNumber || "",
      businessHours: b.businessHours || "",
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
        <h1 className="text-2xl font-bold text-slate-800">Branches</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
          Add Branch
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 font-semibold text-slate-800">{editing ? "Edit Branch" : "New Branch"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Pharmacy</label>
              <select value={formData.pharmacyId} onChange={(e) => set("pharmacyId", e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100">
                <option value={0}>Select pharmacy</option>
                {pharmacies?.data.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Branch Name</label>
              <input value={formData.name} onChange={(e) => set("name", e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Address</label>
              <input value={formData.address} onChange={(e) => set("address", e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Latitude</label>
              <input type="number" step="any" value={formData.latitude} onChange={(e) => set("latitude", e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Longitude</label>
              <input type="number" step="any" value={formData.longitude} onChange={(e) => set("longitude", e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Contact Number</label>
              <input value={formData.contactNumber} onChange={(e) => set("contactNumber", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" placeholder="Optional" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Business Hours</label>
              <input value={formData.businessHours} onChange={(e) => set("businessHours", e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" placeholder="Optional" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
          </div>
        </form>
      )}

      {isLoading && <TableSkeleton />}
      {error && <ErrorState message="Failed to load branches" onRetry={() => refetch()} />}

      {data && (
        <>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Branch</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-slate-500 sm:table-cell">Pharmacy</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-slate-500 md:table-cell">Address</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((b: Branch) => (
                  <tr key={b.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{b.name}</td>
                    <td className="hidden px-4 py-3 text-sm text-slate-500 sm:table-cell">{b.pharmacy?.name}</td>
                    <td className="hidden px-4 py-3 text-sm text-slate-500 md:table-cell">{b.address}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => startEdit(b)} className="mr-2 text-sm text-sky-600 hover:text-sky-700">Edit</button>
                      <button onClick={() => { if (confirm("Delete this branch?")) deleteMut.mutate(b.id); }} className="text-sm text-red-600 hover:text-red-700">Delete</button>
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
