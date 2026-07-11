import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, MapPin, MessageSquare, ShieldAlert } from "lucide-react";
import { getDemoReport, getStatusLabel, getTypeLabel, listDemoReports } from "@/services/reports";

type ReportDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;
  const report = getDemoReport(id);

  if (!report) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-foam">
      <section className="mx-auto grid max-w-4xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex w-fit items-center gap-2 rounded-md border border-cyan-900/15 bg-white px-3 py-2 text-sm font-semibold text-harbor shadow-soft hover:bg-cyan-50">
          <ArrowLeft size={18} aria-hidden="true" />
          Retour au tableau de bord
        </Link>

        <article className="rounded-md border border-cyan-900/10 bg-white p-6 shadow-soft">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-lagoon">{getTypeLabel(report.type)}</p>
              <h1 className="mt-2 text-3xl font-bold text-harbor">{report.title}</h1>
              <p className="mt-2 text-slate-600">{report.description}</p>
            </div>
            <span className="rounded-md border border-cyan-900/10 bg-cyan-50 px-3 py-2 text-sm font-bold text-cyan-700">
              {getStatusLabel(report.status)}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Info icon={<MapPin size={20} />} label="Position" value={`${report.latitude.toFixed(3)}, ${report.longitude.toFixed(3)}`} />
            <Info icon={<CheckCircle2 size={20} />} label="Confirmations" value={report.status === "confirmed" ? "2 usagers" : "En attente"} />
            <Info icon={<MessageSquare size={20} />} label="Commentaires" value="Aucun pour le moment" />
          </div>
        </article>

        <section className="rounded-md border border-cyan-900/10 bg-harbor p-5 text-white shadow-soft">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-1 text-cyan-200" size={22} aria-hidden="true" />
            <div>
              <h2 className="text-lg font-bold">Action citoyenne</h2>
              <p className="mt-2 text-sm leading-6 text-cyan-50">
                Dans la version connectee, cette page permettra de confirmer le signalement, commenter, ajouter une photo et indiquer une resolution.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export function generateStaticParams() {
  return listDemoReports().map((report) => ({
    id: report.id
  }));
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-cyan-900/10 bg-foam p-4">
      <div className="mb-3 text-lagoon">{icon}</div>
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-1 font-bold text-harbor">{value}</p>
    </div>
  );
}
