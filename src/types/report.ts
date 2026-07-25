export type ReportType = "danger" | "pollution" | "obstacle" | "wildlife" | "beacon" | "other";

export type ReportStatus = "active" | "confirmed" | "resolved";

export type ReportSeverity = "low" | "medium" | "high";

export type Report = {
  id: string;
  type: ReportType;
  status: ReportStatus;
  severity: ReportSeverity;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  confirmations: number;
  photoUrl?: string;
  createdAt: string;
};
