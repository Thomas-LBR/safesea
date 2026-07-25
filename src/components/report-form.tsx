"use client";

import { ShieldAlert } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import type { MarineLocation } from "@/lib/weather";
import { createLocalReport } from "@/services/reports";
import type { Report, ReportType } from "@/types/report";

type ReportFormProps = {
  currentLocation: MarineLocation;
  onCreate?: (report: Report) => void;
};

export function ReportForm({ currentLocation, onCreate }: ReportFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const type = String(form.get("type") ?? "danger") as ReportType;
    const severity = String(form.get("severity") ?? "medium") as Report["severity"];
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const latitude = parseCoordinate(form.get("latitude"), currentLocation.latitude);
    const longitude = parseCoordinate(form.get("longitude"), currentLocation.longitude);

    if (!title) {
      setError("Ajoute un titre pour que les autres usagers comprennent le risque.");
      setSuccess(null);
      return;
    }

    if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
      setError("La position doit contenir une latitude entre -90 et 90 et une longitude entre -180 et 180.");
      setSuccess(null);
      return;
    }

    onCreate?.(
      createLocalReport({
        type,
        severity,
        title,
        description,
        latitude,
        longitude
      })
    );

    setError(null);
    setSuccess("Signalement ajoute a la carte et aux alertes actives.");
    event.currentTarget.reset();
  }

  return (
    <form id="signalement" onSubmit={handleSubmit} className="grid max-w-full scroll-mt-4 gap-3 overflow-hidden rounded-md border border-cyan-900/10 bg-white p-4 shadow-soft sm:p-5">
      <div className="min-w-0">
        <h2 className="text-base font-bold text-harbor sm:text-lg">Nouveau signalement</h2>
        <p className="mt-1 break-words text-xs text-slate-600 sm:text-sm">Position par defaut : {currentLocation.label}</p>
      </div>

      <div className="grid min-w-0 gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-harbor">
          Type
          <select name="type" className="min-w-0 rounded-md border border-cyan-900/15 px-3 py-2">
            <option value="danger">Danger</option>
            <option value="pollution">Pollution</option>
            <option value="obstacle">Obstacle</option>
            <option value="wildlife">Faune</option>
            <option value="beacon">Balisage</option>
            <option value="other">Autre</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-harbor">
          Gravite
          <select name="severity" defaultValue="medium" className="min-w-0 rounded-md border border-cyan-900/15 px-3 py-2">
            <option value="low">Information</option>
            <option value="medium">A surveiller</option>
            <option value="high">Urgent</option>
          </select>
        </label>
      </div>

      <label className="grid gap-1 text-sm font-medium text-harbor">
        Titre
        <input name="title" className="min-w-0 rounded-md border border-cyan-900/15 px-3 py-2" placeholder="Ex : obstacle flottant" />
      </label>
      <label className="grid gap-1 text-sm font-medium text-harbor">
        Description
        <textarea name="description" className="min-h-20 rounded-md border border-cyan-900/15 px-3 py-2" placeholder="Ajouter une precision utile" />
      </label>

      <div className="grid min-w-0 gap-3 md:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-harbor">
          Latitude
          <input name="latitude" className="min-w-0 rounded-md border border-cyan-900/15 px-3 py-2" inputMode="decimal" placeholder={currentLocation.latitude.toFixed(4)} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-harbor">
          Longitude
          <input name="longitude" className="min-w-0 rounded-md border border-cyan-900/15 px-3 py-2" inputMode="decimal" placeholder={currentLocation.longitude.toFixed(4)} />
        </label>
      </div>

      {error ? <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
      {success ? <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{success}</p> : null}

      <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-lagoon px-4 py-2 text-sm font-semibold text-white transition hover:bg-harbor sm:w-auto">
        <ShieldAlert size={18} aria-hidden="true" />
        Enregistrer le signalement
      </button>
    </form>
  );
}

function parseCoordinate(value: FormDataEntryValue | null, fallback: number) {
  const rawValue = String(value ?? "").trim().replace(",", ".");

  if (!rawValue) {
    return fallback;
  }

  return Number(rawValue);
}

function isValidLatitude(value: number) {
  return Number.isFinite(value) && value >= -90 && value <= 90;
}

function isValidLongitude(value: number) {
  return Number.isFinite(value) && value >= -180 && value <= 180;
}
