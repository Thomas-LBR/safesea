import { Dashboard } from "@/components/dashboard";
import { getDemoMarineWeather } from "@/lib/weather";

export default function Home() {
  return <Dashboard weather={getDemoMarineWeather()} />;
}
