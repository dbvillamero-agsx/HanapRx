import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllMedicines, createMedicine, updateMedicine, deleteMedicine } from "../../services/medicine.service";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { ErrorState } from "../../components/common/ErrorState";
import type { Medicine } from "../../types";

const emptyForm = { name: "", genericName: "", description: "" };

export function MedicinesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Medicine | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-medicines", page],
    queryFn: () => getAllMedicines(page, 10),
  });

  const createMut = useMutation({
    mutationFn: () => createMedicine({ ...formData, description: formData.description || null }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-medicines"] }); resetForm(); },
  });

  const updateMut = useMutation({
    mutationFn: () => updateMedicine(editing!.id, { ...formData, description: formData.description || null }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-medicines"] }); resetForm(); },
  });

  const deleteMut = useMutation({
    mutationFn: deleteMedicine,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-medicines"] }),
  });

  function resetForm() {
    setFormData(emptyForm);
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(m: Medicine) {
    setEditing(m);
    setFormData({ name: m.name, genericName: m.genericName, description: m.description || "" });
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) updateMut.mutate();
    else createMut.mutate();
  }

  const set = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Medicines</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
          Add Medicine
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 font-semibold text-slate-800">{editing ? "Edit Medicine" : "New Medicine"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Brand Name</label>
              <input value={formData.name} onChange={(e) => set("name", e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Generic Name</label>
              <input value={formData.genericName} onChange={(e) => set("genericName", e.target.value)} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <textarea value={formData.description} onChange={(e) => set("description", e.target.value)} rows={2} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" placeholder="Optional" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
          </div>
        </form>
      )}

      {isLoading && <TableSkeleton />}
      {error && <ErrorState message="Failed to load medicines" onRetry={() => refetch()} />}

      {data && (
        <>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Name</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-medium uppercase text-slate-500 sm:table-cell">Generic Name</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((m: Medicine) => (
                  <tr key={m.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{m.name}</td>
                    <td className="hidden px-4 py-3 text-sm text-slate-500 sm:table-cell">{m.genericName}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => startEdit(m)} className="mr-2 text-sm text-sky-600 hover:text-sky-700">Edit</button>
                      <button onClick={() => { if (confirm("Delete this medicine?")) deleteMut.mutate(m.id); }} className="text-sm text-red-600 hover:text-red-700">Delete</button>
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
