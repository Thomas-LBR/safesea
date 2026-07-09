"use client";

import { ShieldAlert } from "lucide-react";
import type { FormEvent } from "react";

export function ReportForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-md border border-cyan-900/10 bg-white p-5 shadow-soft">
      <div>
        <h2 className="text-lg font-bold text-harbor">Nouveau signalement</h2>
        <p className="text-sm text-slate-600">Prototype local, branchement Supabase prevu.</p>
      </div>
      <label className="grid gap-1 text-sm font-medium text-harbor">
        Type
        <select className="rounded-md border border-cyan-900/15 px-3 py-2">
          <option>Danger</option>
          <option>Pollution</option>
          <option>Obstacle</option>
          <option>Balisage</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium text-harbor">
        Titre
        <input className="rounded-md border border-cyan-900/15 px-3 py-2" placeholder="Ex : obstacle flottant" />
      </label>
      <label className="grid gap-1 text-sm font-medium text-harbor">
        Description
        <textarea className="min-h-24 rounded-md border border-cyan-900/15 px-3 py-2" placeholder="Ajouter une precision utile" />
      </label>
      <button className="inline-flex items-center justify-center gap-2 rounded-md bg-lagoon px-4 py-2 text-sm font-semibold text-white transition hover:bg-harbor">
        <ShieldAlert size={18} aria-hidden="true" />
        Enregistrer le signalement
      </button>
    </form>
  );
}

