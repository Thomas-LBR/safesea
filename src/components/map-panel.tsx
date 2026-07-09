"use client";

import dynamic from "next/dynamic";
import type { Report } from "@/types/report";

const CommunityMap = dynamic(() => import("@/components/community-map").then((mod) => mod.CommunityMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] items-center justify-center bg-cyan-50 text-sm font-semibold text-harbor">
      Chargement de la carte...
    </div>
  )
});

export function MapPanel({ reports }: { reports: Report[] }) {
  return <CommunityMap reports={reports} />;
}
