"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Report } from "@/types/report";

const center: [number, number] = [46.1591, -1.152];

const demoReports: Report[] = [
  {
    id: "1",
    type: "danger",
    status: "active",
    title: "Obstacle flottant",
    description: "Objet signale proche de l'anse du Moulin.",
    latitude: 46.164,
    longitude: -1.171,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    type: "pollution",
    status: "active",
    title: "Nappe suspecte",
    description: "Signalement a confirmer a la sortie du port.",
    latitude: 46.151,
    longitude: -1.142,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    type: "beacon",
    status: "confirmed",
    title: "Bouee deplacee",
    description: "Balisage confirme par deux utilisateurs.",
    latitude: 46.173,
    longitude: -1.121,
    createdAt: new Date().toISOString()
  }
];

export function CommunityMap() {
  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom className="h-[360px] w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {demoReports.map((report) => (
        <Marker key={report.id} position={[report.latitude, report.longitude]}>
          <Popup>
            <strong>{report.title}</strong>
            <br />
            {report.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

