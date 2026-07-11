"use client";

import { Anchor, Bell, CheckCircle2, Compass, LocateFixed, MapPin, Navigation, Search, ShieldAlert, Thermometer, Waves, Wind } from "lucide-react";
import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { ChecklistPanel } from "@/components/checklist-panel";
import { MapPanel } from "@/components/map-panel";
import { ReportForm } from "@/components/report-form";
import { computeSafetyScore, getSafetyLabel } from "@/lib/safety-score";
import { fetchMarineWeather, locationPresets, searchMarineLocations, type MarineLocation, type MarineWeather } from "@/lib/weather";
import { getStatusLabel, getTypeLabel, listDemoReports } from "@/services/reports";
import type { Report } from "@/types/report";

const reportStyles = {
  danger: "bg-red-50 text-red-700 border-red-200",
  pollution: "bg-orange-50 text-orange-700 border-orange-200",
  obstacle: "bg-amber-50 text-amber-700 border-amber-200",
  wildlife: "bg-emerald-50 text-emerald-700 border-emerald-200",
  beacon: "bg-cyan-50 text-cyan-700 border-cyan-200",
  other: "bg-slate-50 text-slate-700 border-slate-200"
};

export function Dashboard({ weather }: { weather: MarineWeather }) {
  const [reports, setReports] = useState<Report[]>(listDemoReports());
  const [selectedWeather, setSelectedWeather] = useState(weather);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<MarineLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const activeReports = useMemo(() => reports.filter((report) => report.status !== "resolved"), [reports]);
  const safetyScore = computeSafetyScore({
    windKnots: selectedWeather.windSpeed,
    waveMeters: selectedWeather.waveHeight,
    visibilityKm: selectedWeather.visibility,
    currentKnots: selectedWeather.currentVelocity,
    nearbyActiveReports: activeReports.length
  });

  async function updateLocation(location: MarineLocation) {
    setIsLoadingWeather(true);
    setWeatherError(null);

    try {
      setSelectedWeather(await fetchMarineWeather(location));
    } catch {
      setWeatherError("Conditions indisponibles pour cette zone. Reessaie avec un point plus au large.");
    } finally {
      setIsLoadingWeather(false);
    }
  }

  function handleCustomLocation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const label = String(form.get("label") || "Zone personnalisee");
    const latitude = Number(form.get("latitude"));
    const longitude = Number(form.get("longitude"));

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setWeatherError("Latitude et longitude doivent etre valides.");
      return;
    }

    void updateLocation({ label, latitude, longitude });
  }

  function handleGeolocation() {
    if (!navigator.geolocation) {
      setWeatherError("Geolocalisation indisponible sur ce navigateur.");
      return;
    }

    setIsLoadingWeather(true);
    setWeatherError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void updateLocation({
          label: "Ma position",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => {
        setIsLoadingWeather(false);
        setWeatherError("Impossible de recuperer ta position.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleLocationSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const query = String(form.get("query") || "").trim();

    if (!query) {
      return;
    }

    setIsSearching(true);
    setWeatherError(null);

    try {
      const results = await searchMarineLocations(query);
      setSearchResults(results);

      if (results.length === 0) {
        setWeatherError("Aucun lieu trouve. Essaie avec un port proche ou des coordonnees.");
      }
    } catch {
      setWeatherError("Recherche de lieu indisponible pour le moment.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <main className="min-h-screen bg-foam">
      <header className="border-b border-cyan-900/10 bg-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-harbor text-white">
              <Waves size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight text-harbor">SafeSea</p>
              <p className="text-sm text-slate-600">La securite en mer grace a la communaute</p>
            </div>
          </div>
          <a href="#signalement" className="inline-flex items-center gap-2 rounded-md bg-lagoon px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-harbor">
            <ShieldAlert size={18} aria-hidden="true" />
            Signaler
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="grid gap-6">
          <section className="rounded-md border border-cyan-900/10 bg-white p-5 shadow-soft">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-harbor">Tableau de bord maritime</h1>
                <p className="mt-1 text-sm text-slate-600">
                  Zone suivie : {selectedWeather.label} ({selectedWeather.latitude.toFixed(3)}, {selectedWeather.longitude.toFixed(3)})
                </p>
                <p className="mt-1 text-xs font-semibold uppercase text-slate-500">
                  Source : {selectedWeather.source === "open-meteo" ? "Open-Meteo Forecast + Marine" : "donnees demo"}
                </p>
              </div>
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
                <p className="text-xs font-semibold uppercase text-emerald-700">Indice de securite</p>
                <p className="text-3xl font-bold text-emerald-700">{safetyScore}</p>
                <p className="text-xs font-semibold text-emerald-700">{getSafetyLabel(safetyScore)}</p>
              </div>
            </div>

            <LocationSelector
              isLoading={isLoadingWeather}
              error={weatherError}
              onPreset={updateLocation}
              onGeolocation={handleGeolocation}
              onCustomLocation={handleCustomLocation}
              onLocationSearch={handleLocationSearch}
              searchResults={searchResults}
              isSearching={isSearching}
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric icon={<Wind size={20} />} label="Vent" value={`${selectedWeather.windSpeed} nd`} detail={`${formatDirection(selectedWeather.windDirection)} - ${selectedWeather.windDirection} deg`} />
              <Metric icon={<Waves size={20} />} label="Houle" value={`${selectedWeather.waveHeight} m`} detail={`${selectedWeather.wavePeriod} s - ${formatDirection(selectedWeather.waveDirection)}`} />
              <Metric icon={<Compass size={20} />} label="Visibilite" value={`${selectedWeather.visibility} km`} detail={getVisibilityLabel(selectedWeather.visibility)} />
              <Metric icon={<Navigation size={20} />} label="Courant" value={`${selectedWeather.currentVelocity} nd`} detail={`Vers ${formatDirection(selectedWeather.currentDirection)}`} />
              <Metric icon={<Thermometer size={20} />} label="Temperature mer" value={`${selectedWeather.seaSurfaceTemperature} degC`} detail="Surface" />
              <Metric icon={<Waves size={20} />} label="Niveau de mer" value={`${selectedWeather.seaLevelHeight} m`} detail="MSL modele" />
              <Metric icon={<MapPin size={20} />} label="Coordonnees" value={selectedWeather.latitude.toFixed(2)} detail={selectedWeather.longitude.toFixed(2)} />
            </div>

            <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
              Les courants et niveaux de mer sont issus de modeles numeriques a maille large. En zone cotiere, notamment autour des ports et estuaires de Normandie, ces donnees aident a anticiper mais ne remplacent pas les documents nautiques officiels.
            </p>
          </section>

          <section className="overflow-hidden rounded-md border border-cyan-900/10 bg-white shadow-soft">
            <div className="flex items-center justify-between border-b border-cyan-900/10 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-harbor">Carte communautaire</h2>
                <p className="text-sm text-slate-600">Signalements recents autour de votre zone</p>
              </div>
              <button className="rounded-md border border-cyan-900/15 p-2 text-harbor hover:bg-cyan-50" aria-label="Centrer sur ma position">
                <MapPin size={20} aria-hidden="true" />
              </button>
            </div>
            <MapPanel reports={reports} />
          </section>
        </div>

        <aside className="grid gap-6">
          <ReportForm onCreate={(report) => setReports((current) => [report, ...current])} />
          <AlertsPanel reports={activeReports} />
          <ChecklistPanel />
          <section className="rounded-md border border-cyan-900/10 bg-harbor p-5 text-white shadow-soft">
            <div className="flex items-start gap-3">
              <Anchor className="mt-1 text-cyan-200" size={22} aria-hidden="true" />
              <div>
                <h2 className="text-lg font-bold">Contribution citoyenne</h2>
                <p className="mt-2 text-sm leading-6 text-cyan-50">
                  SafeSea aide les usagers a partager des informations utiles, prevenir les risques et proteger le milieu marin.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function LocationSelector({
  isLoading,
  error,
  onPreset,
  onGeolocation,
  onCustomLocation,
  onLocationSearch,
  searchResults,
  isSearching
}: {
  isLoading: boolean;
  error: string | null;
  onPreset: (location: MarineLocation) => void;
  onGeolocation: () => void;
  onCustomLocation: (event: FormEvent<HTMLFormElement>) => void;
  onLocationSearch: (event: FormEvent<HTMLFormElement>) => void;
  searchResults: MarineLocation[];
  isSearching: boolean;
}) {
  return (
    <div className="rounded-md border border-cyan-900/10 bg-foam p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-harbor">Changer la zone de suivi</p>
        <button
          type="button"
          onClick={onGeolocation}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-md border border-cyan-900/15 bg-white px-3 py-2 text-sm font-semibold text-harbor hover:bg-cyan-50 disabled:opacity-60"
        >
          <LocateFixed size={16} aria-hidden="true" />
          Ma position
        </button>
      </div>

      <form onSubmit={onLocationSearch} className="mb-3 grid gap-2 sm:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor="zone-search">
          Rechercher un port ou une ville
        </label>
        <input id="zone-search" name="query" className="rounded-md border border-cyan-900/15 px-3 py-2 text-sm" placeholder="Rechercher un port : Ouistreham, Cherbourg, Deauville..." />
        <button type="submit" disabled={isSearching || isLoading} className="inline-flex items-center justify-center gap-2 rounded-md bg-lagoon px-4 py-2 text-sm font-semibold text-white hover:bg-harbor disabled:opacity-60">
          <Search size={16} aria-hidden="true" />
          {isSearching ? "Recherche" : "Chercher"}
        </button>
      </form>

      {searchResults.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {searchResults.map((location) => (
            <button
              key={`${location.label}-${location.latitude}-${location.longitude}`}
              type="button"
              onClick={() => onPreset(location)}
              disabled={isLoading}
              className="rounded-md border border-cyan-900/15 bg-white px-3 py-2 text-sm font-semibold text-harbor hover:bg-cyan-50 disabled:opacity-60"
            >
              {location.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mb-3 flex flex-wrap gap-2">
        {locationPresets.map((location) => (
          <button
            key={location.label}
            type="button"
            onClick={() => onPreset(location)}
            disabled={isLoading}
            className="rounded-md border border-cyan-900/15 bg-white px-3 py-2 text-sm font-semibold text-harbor hover:bg-cyan-50 disabled:opacity-60"
          >
            {location.label}
          </button>
        ))}
      </div>

      <form onSubmit={onCustomLocation} className="grid gap-2 md:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
        <input name="label" className="rounded-md border border-cyan-900/15 px-3 py-2 text-sm" placeholder="Nom de la zone" />
        <input name="latitude" className="rounded-md border border-cyan-900/15 px-3 py-2 text-sm" placeholder="Latitude" inputMode="decimal" />
        <input name="longitude" className="rounded-md border border-cyan-900/15 px-3 py-2 text-sm" placeholder="Longitude" inputMode="decimal" />
        <button type="submit" disabled={isLoading} className="rounded-md bg-harbor px-4 py-2 text-sm font-semibold text-white hover:bg-lagoon disabled:opacity-60">
          {isLoading ? "Chargement" : "Analyser"}
        </button>
      </form>
      {error ? <p className="mt-3 text-sm font-semibold text-red-700">{error}</p> : null}
    </div>
  );
}

function AlertsPanel({ reports }: { reports: Report[] }) {
  return (
    <section className="rounded-md border border-cyan-900/10 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-harbor">Alertes actives</h2>
        <Bell size={20} className="text-lagoon" aria-hidden="true" />
      </div>
      <div className="grid gap-3">
        {reports.map((report) => (
          <article key={report.id} className={`rounded-md border p-4 ${reportStyles[report.type]}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase">{getTypeLabel(report.type)}</p>
                <h3 className="mt-1 font-bold">{report.title}</h3>
                <p className="mt-1 text-sm opacity-80">{report.description}</p>
                <Link href={`/reports/${report.id}`} className="mt-3 inline-flex text-sm font-bold underline underline-offset-4">
                  Voir le detail
                </Link>
              </div>
              <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-semibold">{getStatusLabel(report.status)}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function getVisibilityLabel(visibility: number) {
  if (visibility >= 10) return "Bonne";
  if (visibility >= 5) return "Correcte";
  if (visibility >= 2) return "Reduite";
  return "Faible";
}

function formatDirection(degrees: number) {
  const labels = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return labels[Math.round(degrees / 45) % labels.length];
}

function Metric({
  icon,
  label,
  value,
  detail
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-md border border-cyan-900/10 bg-foam p-4">
      <div className="mb-3 flex items-center justify-between text-lagoon">
        {icon}
        <CheckCircle2 size={18} aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-bold text-harbor">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </article>
  );
}
