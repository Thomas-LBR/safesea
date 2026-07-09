"use client";

import { ShieldAlert } from "lucide-react";
import type { FormEvent } from "react";
import type { Report, ReportType } from "@/types/report";

type ReportFormProps = {
  onCreate?: (report: Report) => void;
};

export function ReportForm({ onCreate }: ReportFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const type = String(form.get("type") ?? "danger") as ReportType;
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();

    if (!title) {
      return;
    }

    onCreate?.({
      id: crypto.randomUUID(),
      type,
      status: "active",
      title,
      description,
      latitude: 46.1591 + (Math.random() - 0.5) * 0.04,
      longitude: -1.152 + (Math.random() - 0.5) * 0.06,
      createdAt: new Date().toISOString()
    });

    event.currentTarget.reset();
  }

  return (
    <form id="signalement" onSubmit={handleSubmit} className="grid gap-3 rounded-md border border-cyan-900/10 bg-white p-5 shadow-soft">
      <div>
        <h2 className="text-lg font-bold text-harbor">Nouveau signalement</h2>
        <p className="text-sm text-slate-600">Prototype local, branchement Supabase prevu.</p>
      </div>
      <label className="grid gap-1 text-sm font-medium text-harbor">
        Type
        <select name="type" className="rounded-md border border-cyan-900/15 px-3 py-2">
          <option value="danger">Danger</option>
          <option value="pollution">Pollution</option>
          <option value="obstacle">Obstacle</option>
          <option value="beacon">Balisage</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium text-harbor">
        Titre
        <input name="title" className="rounded-md border border-cyan-900/15 px-3 py-2" placeholder="Ex : obstacle flottant" />
      </label>
      <label className="grid gap-1 text-sm font-medium text-harbor">
        Description
        <textarea name="description" className="min-h-24 rounded-md border border-cyan-900/15 px-3 py-2" placeholder="Ajouter une precision utile" />
      </label>
      <button className="inline-flex items-center justify-center gap-2 rounded-md bg-lagoon px-4 py-2 text-sm font-semibold text-white transition hover:bg-harbor">
        <ShieldAlert size={18} aria-hidden="true" />
        Enregistrer le signalement
      </button>
    </form>
  );
}
