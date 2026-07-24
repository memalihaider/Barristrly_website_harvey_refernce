"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Camera,
  Heart,
  Star,
  Briefcase,
  Clock,
  Languages,
  Shield,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  DIRECTORY_LISTINGS,
  DIRECTORY_LOCATIONS,
  DIRECTORY_PRACTICES,
  DIRECTORY_PURPOSES,
  EXPERIENCE_OPTIONS,
  LANGUAGE_OPTIONS,
  type DirectoryListing,
} from "@/lib/marketing/directory-listings";

function formatFee(aed: number) {
  return `AED ${aed.toLocaleString()}`;
}

function ListingCard({ item }: { item: DirectoryListing }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_8px_30px_-18px_rgba(15,14,13,0.25)] transition-shadow hover:shadow-[0_16px_40px_-16px_rgba(232,93,4,0.2)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
        <Image
          src={item.photo}
          alt=""
          fill
          className="object-cover blur-[12px] scale-110 transition-transform duration-500 group-hover:scale-[1.15]"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />

        <span
          className={`absolute left-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${item.badgeColor}`}
        >
          {item.practice}
        </span>

        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          <Shield className="h-3 w-3" aria-hidden />
          Anonymous
        </span>

        <div className="absolute bottom-0 inset-x-0 flex items-end justify-between gap-2 p-3">
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-white">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {item.location}
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/90">
            <Camera className="h-3.5 w-3.5" aria-hidden />
            Masked
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
              Counsel #{item.id}
            </p>
            <h3 className="mt-1 font-serif text-xl text-primary tracking-tight truncate">
              {item.title}
            </h3>
          </div>
          <p className="shrink-0 font-serif text-lg font-semibold text-primary tracking-tight">
            {formatFee(item.feeAed)}
          </p>
        </div>

        <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2">
          {item.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-700">
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 text-primary" aria-hidden />
            {item.years}+ yrs
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-primary" aria-hidden />
            {item.rating.toFixed(1)} · {item.matters} matters
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" aria-hidden />
            ~{item.responseHrs}h reply
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Languages className="h-3.5 w-3.5 text-primary" aria-hidden />
            {item.languages.slice(0, 2).join(", ")}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-700">
            {item.forum}
          </span>
          <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-700">
            {item.tier}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/25">
              <Image
                src={item.photo}
                alt=""
                fill
                className="object-cover blur-[6px] scale-110"
                sizes="36px"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ink truncate">
                Verified provider
              </p>
              <p className="text-[11px] text-gray-500">Identity after COI</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/ai/intake?match=${item.id}`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-3.5 py-2 text-xs font-semibold text-on-primary hover:bg-primary-hover transition-colors"
            >
              View
            </Link>
            <button
              type="button"
              aria-label={saved ? "Remove from saved" : "Save listing"}
              aria-pressed={saved}
              onClick={() => setSaved((v) => !v)}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
                saved
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 text-gray-500 hover:border-primary hover:text-primary"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${saved ? "fill-primary" : ""}`}
                aria-hidden
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function LegalDirectory() {
  const [query, setQuery] = useState("");
  const [purpose, setPurpose] = useState("all");
  const [location, setLocation] = useState("all");
  const [practice, setPractice] = useState("all");
  const [years, setYears] = useState<number[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [feeMax, setFeeMax] = useState(800);
  const [applied, setApplied] = useState(0);
  const [mobileFilters, setMobileFilters] = useState(false);

  function toggleYear(y: number) {
    setYears((prev) =>
      prev.includes(y) ? prev.filter((v) => v !== y) : [...prev, y]
    );
  }

  function toggleLanguage(lang: string) {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((v) => v !== lang) : [...prev, lang]
    );
  }

  function applyFilters() {
    setApplied((n) => n + 1);
    setMobileFilters(false);
  }

  function resetFilters() {
    setQuery("");
    setPurpose("all");
    setLocation("all");
    setPractice("all");
    setYears([]);
    setLanguages([]);
    setFeeMax(800);
    setApplied((n) => n + 1);
  }

  const results = useMemo(() => {
    void applied;
    const q = query.trim().toLowerCase();
    return DIRECTORY_LISTINGS.filter((item) => {
      if (purpose !== "all" && item.purpose !== purpose) return false;
      if (location !== "all" && item.citySlug !== location) return false;
      if (practice !== "all" && item.practiceSlug !== practice) return false;
      if (item.feeAed > feeMax) return false;
      if (years.length > 0 && !years.some((y) => item.years >= y)) return false;
      if (
        languages.length > 0 &&
        !languages.some((l) => item.languages.includes(l))
      )
        return false;
      if (!q) return true;
      const hay = [
        item.title,
        item.practice,
        item.location,
        item.forum,
        item.id,
        item.summary,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, purpose, location, practice, feeMax, years, languages, applied]);

  const filterPanel = (
    <div className="space-y-5">
      <div>
        <label htmlFor="dir-search" className="sr-only">
          Search directory
        </label>
        <div className="flex overflow-hidden rounded-md border border-gray-200 bg-white focus-within:border-primary">
          <input
            id="dir-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search counsel, practice…"
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-gray-400 outline-none"
          />
          <button
            type="button"
            onClick={applyFilters}
            className="inline-flex items-center justify-center bg-primary px-3 text-on-primary hover:bg-primary-hover"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      <FilterSelect
        label="Purpose"
        value={purpose}
        onChange={setPurpose}
        options={DIRECTORY_PURPOSES.map((o) => ({
          value: o.value,
          label: o.label,
        }))}
      />
      <FilterSelect
        label="Location"
        value={location}
        onChange={setLocation}
        options={DIRECTORY_LOCATIONS.map((o) => ({
          value: o.value,
          label: o.label,
        }))}
      />
      <FilterSelect
        label="Legal expertise"
        value={practice}
        onChange={setPractice}
        options={DIRECTORY_PRACTICES.map((o) => ({
          value: o.value,
          label: o.label,
        }))}
      />

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-ink">
          Min. experience
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCE_OPTIONS.map((y) => (
            <label
              key={y}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={years.includes(y)}
                onChange={() => toggleYear(y)}
                className="h-4 w-4 rounded border-gray-300 accent-primary"
              />
              {y}+ years
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-ink">Languages</legend>
        <div className="grid grid-cols-2 gap-2">
          {LANGUAGE_OPTIONS.map((lang) => (
            <label
              key={lang}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={languages.includes(lang)}
                onChange={() => toggleLanguage(lang)}
                className="h-4 w-4 rounded border-gray-300 accent-primary"
              />
              {lang}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <label htmlFor="fee-range" className="text-sm font-semibold text-ink">
            Max session fee
          </label>
          <span className="text-xs font-medium text-primary">
            Up to {formatFee(feeMax)}
          </span>
        </div>
        <input
          id="fee-range"
          type="range"
          min={400}
          max={800}
          step={200}
          value={feeMax}
          onChange={(e) => setFeeMax(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <p className="mt-1 text-[11px] text-gray-500">
          Range: AED 400 — AED 800 consult tiers
        </p>
      </div>

      <button
        type="button"
        onClick={applyFilters}
        className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors"
      >
        Search
      </button>
      <button
        type="button"
        onClick={resetFilters}
        className="w-full text-sm font-medium text-gray-600 hover:text-primary transition-colors"
      >
        Reset filters
      </button>
    </div>
  );

  return (
    <div className="container-wide pb-16 md:pb-24">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-ink">{results.length}</span>{" "}
            anonymous listings
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Names stay masked until conflict clearance and escrow booking.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMobileFilters(true)}
          className="lg:hidden inline-flex items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:border-primary hover:text-primary"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filters
        </button>
      </div>

      <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-8 items-start">
        <aside className="hidden lg:block sticky top-28 rounded-xl border border-gray-200 bg-[#f3f2ef] p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            Refine directory
          </p>
          {filterPanel}
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="font-serif text-xl text-ink">No matches found</p>
              <p className="mt-2 text-sm text-gray-600">
                Try widening location, fee range, or experience filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 text-sm font-semibold text-primary hover:text-primary-hover"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {results.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFilters ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close filters"
            onClick={() => setMobileFilters(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-[#f3f2ef] p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Filters</p>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="rounded-md p-2 text-gray-600 hover:bg-white"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-primary"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
