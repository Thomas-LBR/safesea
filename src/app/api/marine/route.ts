import { NextResponse } from "next/server";
import { defaultMarineLocation, fetchMarineWeather } from "@/lib/weather";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = Number(searchParams.get("latitude"));
  const longitude = Number(searchParams.get("longitude"));
  const label = searchParams.get("label")?.trim() || "Zone personnalisee";

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json(
      {
        error: "Coordinates are required"
      },
      { status: 400 }
    );
  }

  const weather = await fetchMarineWeather({
    label,
    latitude: latitude || defaultMarineLocation.latitude,
    longitude: longitude || defaultMarineLocation.longitude
  });

  return NextResponse.json(weather);
}
