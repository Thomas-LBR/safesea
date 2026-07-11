export type MarineWeather = {
  latitude: number;
  longitude: number;
  label: string;
  windSpeed: number;
  windDirection: number;
  waveHeight: number;
  waveDirection: number;
  wavePeriod: number;
  visibility: number;
  currentVelocity: number;
  currentDirection: number;
  seaSurfaceTemperature: number;
  seaLevelHeight: number;
  updatedAt: string;
  source: "open-meteo" | "partial" | "demo";
};

export type MarineLocation = {
  label: string;
  latitude: number;
  longitude: number;
};

type OpenMeteoMarineResponse = {
  current?: {
    wave_height?: number;
    wave_direction?: number;
    wave_period?: number;
    ocean_current_velocity?: number;
    ocean_current_direction?: number;
    sea_surface_temperature?: number;
    sea_level_height_msl?: number;
  };
};

type OpenMeteoForecastResponse = {
  current?: {
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    visibility?: number;
  };
};

export const defaultMarineLocation: MarineLocation = {
  label: "La Rochelle - Pertuis d'Antioche",
  latitude: 46.1591,
  longitude: -1.152
};

export const locationPresets: MarineLocation[] = [
  { label: "Ouistreham - Baie de Seine", latitude: 49.2919, longitude: -0.2593 },
  { label: "Courseulles-sur-Mer", latitude: 49.3366, longitude: -0.4562 },
  { label: "Deauville - Trouville", latitude: 49.365, longitude: 0.075 },
  { label: "Le Havre - Estuaire", latitude: 49.4938, longitude: 0.1077 },
  { label: "Cherbourg - Rade", latitude: 49.6469, longitude: -1.6221 },
  { label: "Granville - Baie du Mont", latitude: 48.8376, longitude: -1.5971 },
  defaultMarineLocation,
  { label: "Brest - Rade", latitude: 48.3904, longitude: -4.4861 },
  { label: "Marseille - Frioul", latitude: 43.2804, longitude: 5.3021 },
  { label: "Nice - Baie des Anges", latitude: 43.695, longitude: 7.265 },
  { label: "Arcachon - Bassin", latitude: 44.661, longitude: -1.166 },
  { label: "Saint-Malo", latitude: 48.6493, longitude: -2.0257 }
];

export async function fetchMarineWeather(location: MarineLocation = defaultMarineLocation): Promise<MarineWeather> {
  const marineParams = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: "wave_height,wave_direction,wave_period,ocean_current_velocity,ocean_current_direction,sea_surface_temperature,sea_level_height_msl",
    velocity_unit: "kn",
    timezone: "auto",
    cell_selection: "sea"
  });

  const forecastParams = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: "wind_speed_10m,wind_direction_10m,visibility",
    wind_speed_unit: "kn",
    timezone: "auto"
  });

  try {
    const [marineResponse, forecastResponse] = await Promise.all([
      fetch(`https://marine-api.open-meteo.com/v1/marine?${marineParams.toString()}`, {
        next: { revalidate: 900 }
      }),
      fetch(`https://api.open-meteo.com/v1/forecast?${forecastParams.toString()}`, {
        next: { revalidate: 900 }
      })
    ]);

    if (!marineResponse.ok || !forecastResponse.ok) {
      throw new Error("Weather request failed");
    }

    const marineData = (await marineResponse.json()) as OpenMeteoMarineResponse;
    const forecastData = (await forecastResponse.json()) as OpenMeteoForecastResponse;

    return {
      latitude: location.latitude,
      longitude: location.longitude,
      label: location.label,
      windSpeed: round(forecastData.current?.wind_speed_10m, 0),
      windDirection: round(forecastData.current?.wind_direction_10m, 0),
      waveHeight: round(marineData.current?.wave_height, 1),
      waveDirection: round(marineData.current?.wave_direction, 0),
      wavePeriod: round(marineData.current?.wave_period, 1),
      visibility: round((forecastData.current?.visibility ?? 12000) / 1000, 1),
      currentVelocity: round(marineData.current?.ocean_current_velocity, 2),
      currentDirection: round(marineData.current?.ocean_current_direction, 0),
      seaSurfaceTemperature: round(marineData.current?.sea_surface_temperature, 1),
      seaLevelHeight: round(marineData.current?.sea_level_height_msl, 2),
      updatedAt: new Date().toISOString(),
      source: "open-meteo"
    };
  } catch {
    return getDemoMarineWeather(location);
  }
}

export function getDemoMarineWeather(location: MarineLocation = defaultMarineLocation): MarineWeather {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    label: location.label,
    windSpeed: 14,
    windDirection: 270,
    waveHeight: 0.8,
    waveDirection: 260,
    wavePeriod: 5.2,
    visibility: 12,
    currentVelocity: 0.7,
    currentDirection: 95,
    seaSurfaceTemperature: 18.4,
    seaLevelHeight: 0.24,
    updatedAt: new Date().toISOString(),
    source: "demo"
  };
}

function round(value: number | undefined, digits: number) {
  const fallback = 0;
  const factor = 10 ** digits;
  return Math.round((value ?? fallback) * factor) / factor;
}
