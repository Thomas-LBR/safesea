import type { Report } from "@/types/report";

export const demoReports: Report[] = [
  {
    id: "1",
    type: "danger",
    status: "active",
    severity: "high",
    title: "Obstacle flottant",
    description: "Objet signale proche de l'anse du Moulin.",
    latitude: 46.164,
    longitude: -1.171,
    confirmations: 1,
    createdAt: "2026-07-09T12:00:00.000Z"
  },
  {
    id: "2",
    type: "pollution",
    status: "active",
    severity: "medium",
    title: "Nappe suspecte",
    description: "Signalement a confirmer a la sortie du port.",
    latitude: 46.151,
    longitude: -1.142,
    confirmations: 0,
    createdAt: "2026-07-09T12:10:00.000Z"
  },
  {
    id: "3",
    type: "beacon",
    status: "confirmed",
    severity: "low",
    title: "Bouee deplacee",
    description: "Balisage confirme par deux utilisateurs.",
    latitude: 46.173,
    longitude: -1.121,
    confirmations: 2,
    createdAt: "2026-07-09T12:20:00.000Z"
  }
];
