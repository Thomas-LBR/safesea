import { Dashboard } from "@/components/dashboard";
import { fetchMarineWeather } from "@/lib/weather";

export default async function Home() {
  const weather = await fetchMarineWeather();

  return <Dashboard weather={weather} />;
}

