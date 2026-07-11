import { NextResponse } from "next/server";
import type { MarineLocation } from "@/lib/weather";

type OpenMeteoGeocodingResponse = {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
    admin2?: string;
  }>;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim();

  if (!name) {
    return NextResponse.json({ results: [] });
  }

  const params = new URLSearchParams({
    name,
    count: "6",
    language: "fr",
    format: "json"
  });

  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`, {
    next: { revalidate: 86400 }
  });

  if (!response.ok) {
    return NextResponse.json({ results: [] }, { status: 502 });
  }

  const data = (await response.json()) as OpenMeteoGeocodingResponse;
  const results: MarineLocation[] =
    data.results?.map((result) => ({
      label: [result.name, result.admin2, result.admin1, result.country].filter(Boolean).join(" - "),
      latitude: result.latitude,
      longitude: result.longitude
    })) ?? [];

  return NextResponse.json({ results });
}
