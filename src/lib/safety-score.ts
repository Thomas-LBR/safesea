export type MarineConditions = {
  windKnots: number;
  waveMeters: number;
  visibilityKm: number;
  currentKnots: number;
  nearbyActiveReports: number;
  highSeverityReports?: number;
};

export function computeSafetyScore(conditions: MarineConditions) {
  let score = 100;

  if (conditions.windKnots > 25) score -= 30;
  else if (conditions.windKnots > 18) score -= 18;
  else if (conditions.windKnots > 12) score -= 8;

  if (conditions.waveMeters > 2) score -= 30;
  else if (conditions.waveMeters > 1.2) score -= 18;
  else if (conditions.waveMeters > 0.8) score -= 8;

  if (conditions.visibilityKm < 2) score -= 25;
  else if (conditions.visibilityKm < 5) score -= 12;

  if (conditions.currentKnots > 3) score -= 18;
  else if (conditions.currentKnots > 1.5) score -= 10;

  score -= Math.min(conditions.nearbyActiveReports * 5, 25);
  score -= Math.min((conditions.highSeverityReports ?? 0) * 8, 24);

  return Math.max(0, Math.min(100, score));
}

export function getSafetyLabel(score: number) {
  if (score >= 80) return "Conditions favorables";
  if (score >= 60) return "Vigilance";
  if (score >= 40) return "Prudence renforcee";
  return "Sortie deconseillee";
}
