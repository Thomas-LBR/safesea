import {
  Anchor,
  Bell,
  CheckCircle2,
  Compass,
  LifeBuoy,
  MapPin,
  ShieldAlert,
  Waves,
  Wind
} from "lucide-react";
import type { ReactNode } from "react";

const reports = [
  {
    type: "Danger",
    title: "Obstacle flottant",
    place: "Anse du Moulin",
    status: "Actif",
    tone: "bg-red-50 text-red-700 border-red-200"
  },
  {
    type: "Pollution",
    title: "Nappe suspecte",
    place: "Sortie du port",
    status: "A confirmer",
    tone: "bg-orange-50 text-orange-700 border-orange-200"
  },
  {
    type: "Balisage",
    title: "Bouee deplacee",
    place: "Chenal nord",
    status: "Confirme",
    tone: "bg-cyan-50 text-cyan-700 border-cyan-200"
  }
];

const checklist = ["Meteo verifiee", "Gilets controles", "Carburant suffisant", "Telephone charge"];

export default function Home() {
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
          <button className="inline-flex items-center gap-2 rounded-md bg-lagoon px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-harbor">
            <ShieldAlert size={18} aria-hidden="true" />
            Signaler
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="grid gap-6">
          <section className="rounded-md border border-cyan-900/10 bg-white p-5 shadow-soft">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-harbor">Tableau de bord maritime</h1>
                <p className="mt-1 text-sm text-slate-600">Zone suivie : La Rochelle - Pertuis d&apos;Antioche</p>
              </div>
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-right">
                <p className="text-xs font-semibold uppercase text-emerald-700">Indice de securite</p>
                <p className="text-3xl font-bold text-emerald-700">82</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Metric icon={<Wind size={20} />} label="Vent" value="14 nd" detail="Ouest" />
              <Metric icon={<Waves size={20} />} label="Houle" value="0,8 m" detail="Moderee" />
              <Metric icon={<Compass size={20} />} label="Visibilite" value="Bonne" detail="12 km" />
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
            <div className="sea-grid relative min-h-[360px] bg-cyan-50">
              <div className="absolute left-[18%] top-[32%] rounded-md bg-red-600 px-3 py-2 text-xs font-bold text-white shadow-soft">
                Danger
              </div>
              <div className="absolute left-[58%] top-[24%] rounded-md bg-orange-500 px-3 py-2 text-xs font-bold text-white shadow-soft">
                Pollution
              </div>
              <div className="absolute left-[44%] top-[62%] rounded-md bg-lagoon px-3 py-2 text-xs font-bold text-white shadow-soft">
                Balisage
              </div>
              <div className="absolute bottom-4 left-4 rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-harbor shadow-soft">
                Carte MVP - integration Leaflet prevue
              </div>
            </div>
          </section>
        </div>

        <aside className="grid gap-6">
          <section className="rounded-md border border-cyan-900/10 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-harbor">Alertes actives</h2>
              <Bell size={20} className="text-lagoon" aria-hidden="true" />
            </div>
            <div className="grid gap-3">
              {reports.map((report) => (
                <article key={report.title} className={`rounded-md border p-4 ${report.tone}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase">{report.type}</p>
                      <h3 className="mt-1 font-bold">{report.title}</h3>
                      <p className="mt-1 text-sm opacity-80">{report.place}</p>
                    </div>
                    <span className="rounded-md bg-white/80 px-2 py-1 text-xs font-semibold">{report.status}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-cyan-900/10 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-harbor">Checklist depart</h2>
              <LifeBuoy size={20} className="text-lagoon" aria-hidden="true" />
            </div>
            <div className="grid gap-3">
              {checklist.map((item) => (
                <label key={item} className="flex items-center gap-3 rounded-md border border-cyan-900/10 px-3 py-3 text-sm font-medium text-harbor">
                  <input type="checkbox" className="h-4 w-4 accent-lagoon" defaultChecked={item !== "Telephone charge"} />
                  {item}
                </label>
              ))}
            </div>
          </section>

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
