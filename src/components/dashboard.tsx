"use client";

import { Anchor, Bell, CheckCircle2, Compass, MapPin, ShieldAlert, Waves, Wind } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { ChecklistPanel } from "@/components/checklist-panel";
import { MapPanel } from "@/components/map-panel";
import { ReportForm } from "@/components/report-form";
import { computeSafetyScore, getSafetyLabel } from "@/lib/safety-score";
import type { MarineWeather } from "@/lib/weather";
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
  const activeReports = useMemo(() => reports.filter((report) => report.status !== "resolved"), [reports]);
  const safetyScore = computeSafetyScore({
    windKnots: weather.windSpeed,
    waveMeters: weather.waveHeight,
    visibilityKm: weather.visibility,
    nearbyActiveReports: activeReports.length
  });

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
                <p className="mt-1 text-sm text-slate-600">Zone suivie : La Rochelle - Pertuis d&apos;Antioche</p>
                <p className="mt-1 text-xs font-semibold uppercase text-slate-500">
                  Source meteo : {weather.source === "open-meteo" ? "Open-Meteo Marine" : "donnees demo"}
                </p>
              </div>
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
                <p className="text-xs font-semibold uppercase text-emerald-700">Indice de securite</p>
                <p className="text-3xl font-bold text-emerald-700">{safetyScore}</p>
                <p className="text-xs font-semibold text-emerald-700">{getSafetyLabel(safetyScore)}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Metric icon={<Wind size={20} />} label="Vent" value={`${weather.windSpeed} nd`} detail="Releve actuel" />
              <Metric icon={<Waves size={20} />} label="Houle" value={`${weather.waveHeight} m`} detail="Hauteur significative" />
              <Metric icon={<Compass size={20} />} label="Visibilite" value="Bonne" detail={`${weather.visibility} km`} />
            </div>
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
