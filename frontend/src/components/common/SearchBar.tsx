import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../hooks/useDebounce";
import { autocompleteMedicines } from "../../services/medicine.service";

interface SearchBarProps {
  initialQuery?: string;
  large?: boolean;
}

export function SearchBar({ initialQuery = "", large = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data: suggestions } = useQuery({
    queryKey: ["autocomplete", debouncedQuery],
    queryFn: () => autocompleteMedicines(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelect = (name: string) => {
    setQuery(name);
    setShowDropdown(false);
    navigate(`/search?q=${encodeURIComponent(name)}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <svg
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 ${large ? "h-6 w-6" : "h-5 w-5"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search medicine name or generic name..."
            className={`w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-slate-700 shadow-sm transition-all placeholder:text-slate-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 ${
              large ? "py-4 text-lg" : "py-2.5 text-sm"
            }`}
          />
        </div>
      </form>

      {showDropdown && suggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.name)}
              className="flex w-full flex-col px-4 py-2.5 text-left transition-colors hover:bg-orange-50"
            >
              <span className="text-sm font-medium text-slate-800">{item.name}</span>
              <span className="text-xs text-slate-500">{item.genericName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
