export type ReportType = "danger" | "pollution" | "obstacle" | "wildlife" | "beacon" | "other";

export type ReportStatus = "active" | "confirmed" | "resolved";

export type Report = {
  id: string;
  type: ReportType;
  status: ReportStatus;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  createdAt: string;
};

