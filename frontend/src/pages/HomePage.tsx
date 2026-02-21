import { Link } from "react-router-dom";
import { SearchBar } from "../components/common/SearchBar";

export function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-lg font-bold text-white">Rx</div>
        </div>
        <h1 className="mb-1 text-4xl font-bold text-slate-800 sm:text-5xl">
          Hanap<span className="text-orange-500">Rx</span>
        </h1>
        <p className="mb-2 text-sm font-medium text-orange-600">Mercury Drug</p>
        <p className="mb-8 text-lg text-slate-500">
          Search medicines, compare prices, and find the nearest branch.
        </p>
        <SearchBar large />
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-400">
          <span>Popular:</span>
          {["Biogesic", "Amoxicillin", "Losartan", "Omeprazole"].map((term) => (
            <a
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="rounded-full border border-slate-200 px-3 py-1 transition-colors hover:border-orange-300 hover:text-orange-600"
            >
              {term}
            </a>
          ))}
        </div>
        <div className="mt-10">
          <Link
            to="/branches"
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 transition-colors hover:text-orange-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Find a Mercury Drug branch near you
          </Link>
        </div>
      </div>
    </div>
  );
}
