"use client";

import { LifeBuoy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const items = ["Meteo verifiee", "Gilets controles", "Carburant suffisant", "Telephone charge"];
const storageKey = "safesea-checklist";

export function ChecklistPanel() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);

    if (stored) {
      setCheckedItems(JSON.parse(stored) as Record<string, boolean>);
      return;
    }

    setCheckedItems({
      "Meteo verifiee": true,
      "Gilets controles": true,
      "Carburant suffisant": true,
      "Telephone charge": false
    });
  }, []);

  useEffect(() => {
    if (Object.keys(checkedItems).length > 0) {
      window.localStorage.setItem(storageKey, JSON.stringify(checkedItems));
    }
  }, [checkedItems]);

  const completed = useMemo(() => items.filter((item) => checkedItems[item]).length, [checkedItems]);

  return (
    <section className="rounded-md border border-cyan-900/10 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-harbor">Checklist depart</h2>
          <p className="text-sm text-slate-600">
            {completed}/{items.length} controles valides
          </p>
        </div>
        <LifeBuoy size={20} className="text-lagoon" aria-hidden="true" />
      </div>
      <div className="grid gap-3">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-3 rounded-md border border-cyan-900/10 px-3 py-3 text-sm font-medium text-harbor">
            <input
              type="checkbox"
              className="h-4 w-4 accent-lagoon"
              checked={Boolean(checkedItems[item])}
              onChange={(event) => setCheckedItems((current) => ({ ...current, [item]: event.target.checked }))}
            />
            {item}
          </label>
        ))}
      </div>
    </section>
  );
}

