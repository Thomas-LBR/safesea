export type MarineWeather = {
  windSpeed: number;
  waveHeight: number;
  visibility: number;
  updatedAt: string;
  source: "open-meteo" | "demo";
};

type OpenMeteoResponse = {
  current?: {
    wind_speed_10m?: number;
    wave_height?: number;
  };
};

export async function fetchMarineWeather(): Promise<MarineWeather> {
  const params = new URLSearchParams({
    latitude: "46.1591",
    longitude: "-1.152",
    current: "wind_speed_10m,wave_height",
    wind_speed_unit: "kn",
    timezone: "Europe/Paris"
  });

  try {
    const response = await fetch(`https://marine-api.open-meteo.com/v1/marine?${params.toString()}`, {
      next: { revalidate: 900 }
    });

    if (!response.ok) {
      throw new Error("Weather request failed");
    }

    const data = (await response.json()) as OpenMeteoResponse;

    return {
      windSpeed: Math.round(data.current?.wind_speed_10m ?? 14),
      waveHeight: Number((data.current?.wave_height ?? 0.8).toFixed(1)),
      visibility: 12,
      updatedAt: new Date().toISOString(),
      source: "open-meteo"
    };
  } catch {
    return {
      windSpeed: 14,
      waveHeight: 0.8,
      visibility: 12,
      updatedAt: new Date().toISOString(),
      source: "demo"
    };
  }
}

