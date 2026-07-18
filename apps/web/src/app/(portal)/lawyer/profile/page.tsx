"use client";

import { useCallback, useEffect, useState } from "react";
import AppShell from "@/components/app/app-shell";

type Profile = {
  display_name: string;
  initials: string;
  practice_areas: string[];
  jurisdictions: string[];
  languages: string[];
  experience_years: number;
  bio: string;
  hourly_range_min: number;
  hourly_range_max: number;
  is_verified: boolean;
  is_public: boolean;
};

export default function LawyerProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);
  const [jurisdictions, setJurisdictions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/lawyer/profile");
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Failed to load profile");
        return;
      }
      setProfile(json.data.profile);
      setPracticeAreas(json.data.options?.practiceAreas ?? []);
      setJurisdictions(json.data.options?.jurisdictions ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function toggle(list: string[], value: string): string[] {
    return list.includes(value)
      ? list.filter((x) => x !== value)
      : [...list, value];
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/v1/lawyer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: profile.display_name,
          bio: profile.bio,
          practice_areas: profile.practice_areas,
          jurisdictions: profile.jurisdictions,
          languages: profile.languages,
          experience_years: profile.experience_years,
          hourly_range_min: profile.hourly_range_min,
          hourly_range_max: profile.hourly_range_max,
        }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error?.message ?? "Save failed");
        return;
      }
      setProfile(json.data.profile);
      setMessage("Profile saved. Verification / public flags remain admin-controlled.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell role="lawyer" title="Practice profile">
      <p className="text-sm text-text-on-light-muted mb-6">
        Fields used by the marketplace match pool. Admin approval still controls
        verified / public.
      </p>
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}
      {message && <p className="text-sm text-green-700 mb-4">{message}</p>}
      {loading || !profile ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : (
        <form onSubmit={onSave} className="space-y-5 max-w-2xl">
          <p className="text-xs text-text-muted">
            Status: {profile.is_verified ? "verified" : "unverified"} ·{" "}
            {profile.is_public ? "public" : "private"}
          </p>
          <label className="block text-sm">
            <span className="font-medium">Display name</span>
            <input
              value={profile.display_name}
              onChange={(e) =>
                setProfile({ ...profile, display_name: e.target.value })
              }
              className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Bio</span>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Experience (years)</span>
            <input
              type="number"
              min={0}
              value={profile.experience_years}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  experience_years: Number(e.target.value),
                })
              }
              className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="font-medium">Hourly min</span>
              <input
                type="number"
                min={0}
                value={profile.hourly_range_min}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    hourly_range_min: Number(e.target.value),
                  })
                }
                className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Hourly max</span>
              <input
                type="number"
                min={0}
                value={profile.hourly_range_max}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    hourly_range_max: Number(e.target.value),
                  })
                }
                className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <fieldset>
            <legend className="text-sm font-medium mb-2">Practice areas</legend>
            <div className="flex flex-wrap gap-2">
              {practiceAreas.map((pa) => (
                <button
                  key={pa}
                  type="button"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      practice_areas: toggle(profile.practice_areas, pa),
                    })
                  }
                  className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                    profile.practice_areas.includes(pa)
                      ? "bg-primary text-white border-primary"
                      : "border-black/15"
                  }`}
                >
                  {pa}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-medium mb-2">Jurisdictions</legend>
            <div className="flex flex-wrap gap-2">
              {jurisdictions.map((j) => (
                <button
                  key={j}
                  type="button"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      jurisdictions: toggle(profile.jurisdictions, j),
                    })
                  }
                  className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                    profile.jurisdictions.includes(j)
                      ? "bg-primary text-white border-primary"
                      : "border-black/15"
                  }`}
                >
                  {j}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="block text-sm">
            <span className="font-medium">Languages (comma-separated)</span>
            <input
              value={profile.languages.join(", ")}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  languages: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      )}
    </AppShell>
  );
}
