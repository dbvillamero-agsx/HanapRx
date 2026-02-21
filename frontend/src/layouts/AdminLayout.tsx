import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { path: "/admin", label: "Dashboard", end: true },
  { path: "/admin/pharmacies", label: "Pharmacies" },
  { path: "/admin/branches", label: "Branches" },
  { path: "/admin/medicines", label: "Medicines" },
  { path: "/admin/inventory", label: "Inventory" },
];

export function AdminLayout() {
  const { user, logout, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="hidden w-60 flex-shrink-0 border-r border-slate-200 bg-white md:block">
        <div className="border-b border-slate-200 p-4">
          <Link to="/" className="text-xl font-bold text-sky-700">
            Hanap<span className="text-red-500">Rx</span>
          </Link>
          <p className="mt-1 text-xs text-slate-500">Admin Panel</p>
        </div>
        <nav className="p-3">
          {navItems.map((item) => {
            const isActive = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mb-1 block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sky-50 text-sky-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 w-60 border-t border-slate-200 p-3">
          <div className="mb-2 px-3 text-xs text-slate-500">{user.email}</div>
          <button
            onClick={logout}
            className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 md:hidden">
          <Link to="/" className="text-lg font-bold text-sky-700">
            Hanap<span className="text-red-500">Rx</span>
          </Link>
          <button
            onClick={logout}
            className="text-sm font-medium text-red-600"
          >
            Logout
          </button>
        </header>

        <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 md:hidden">
          {navItems.map((item) => {
            const isActive = item.end
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isActive ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
