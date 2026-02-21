import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllPharmacies } from "../../services/pharmacy.service";
import { getAllBranches } from "../../services/branch.service";
import { getAllMedicines } from "../../services/medicine.service";
import { getAllInventory } from "../../services/inventory.service";

export function DashboardPage() {
  const { data: pharmacies } = useQuery({
    queryKey: ["admin-pharmacies"],
    queryFn: () => getAllPharmacies(1, 1),
  });
  const { data: branches } = useQuery({
    queryKey: ["admin-branches"],
    queryFn: () => getAllBranches(1, 1),
  });
  const { data: medicines } = useQuery({
    queryKey: ["admin-medicines"],
    queryFn: () => getAllMedicines(1, 1),
  });
  const { data: inventory } = useQuery({
    queryKey: ["admin-inventory"],
    queryFn: () => getAllInventory(1, 1),
  });

  const stats = [
    { label: "Pharmacies", count: pharmacies?.pagination.total ?? 0, path: "/admin/pharmacies", color: "bg-red-100 text-red-700" },
    { label: "Branches", count: branches?.pagination.total ?? 0, path: "/admin/branches", color: "bg-red-100 text-red-700" },
    { label: "Medicines", count: medicines?.pagination.total ?? 0, path: "/admin/medicines", color: "bg-red-100 text-red-700" },
    { label: "Inventory", count: inventory?.pagination.total ?? 0, path: "/admin/inventory", color: "bg-red-100 text-red-700" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className="rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className={`mb-3 inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ${stat.color}`}>
              {stat.label}
            </div>
            <p className="text-3xl font-bold text-slate-800">{stat.count}</p>
            <p className="mt-1 text-xs text-slate-500">Total {stat.label.toLowerCase()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
