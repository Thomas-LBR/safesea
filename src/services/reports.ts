import { demoReports } from "@/data/demo-reports";
import type { Report, ReportSeverity, ReportStatus, ReportType } from "@/types/report";

export type CreateReportInput = {
  type: ReportType;
  severity: ReportSeverity;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
};

export function listDemoReports() {
  return demoReports;
}

export function getDemoReport(id: string) {
  return demoReports.find((report) => report.id === id) ?? null;
}

export function createLocalReport(input: CreateReportInput): Report {
  return {
    id: crypto.randomUUID(),
    type: input.type,
    status: "active",
    severity: input.severity,
    title: input.title,
    description: input.description,
    latitude: input.latitude,
    longitude: input.longitude,
    confirmations: 0,
    createdAt: new Date().toISOString()
  };
}

export function getStatusLabel(status: ReportStatus) {
  if (status === "active") return "Actif";
  if (status === "confirmed") return "Confirme";
  return "Resolue";
}

export function getSeverityLabel(severity: ReportSeverity) {
  if (severity === "high") return "Urgent";
  if (severity === "medium") return "A surveiller";
  return "Information";
}

export function getTypeLabel(type: ReportType) {
  const labels: Record<ReportType, string> = {
    danger: "Danger",
    pollution: "Pollution",
    obstacle: "Obstacle",
    wildlife: "Faune",
    beacon: "Balisage",
    other: "Autre"
  };

  return labels[type];
}
