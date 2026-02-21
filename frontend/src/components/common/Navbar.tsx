import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "./SearchBar";

export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-xs font-bold text-white">Rx</div>
          <span className="text-lg font-bold text-slate-800">
            Hanap<span className="text-orange-500">Rx</span>
          </span>
        </Link>

        {!isHome && (
          <div className="flex-1">
            <SearchBar />
          </div>
        )}

        <div className="flex items-center gap-1">
          <Link
            to="/branches"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Stores
          </Link>
          <Link
            to="/map"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Map
          </Link>
        </div>
      </div>
    </nav>
  );
}
