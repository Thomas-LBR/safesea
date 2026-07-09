"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Report } from "@/types/report";

const center: [number, number] = [46.1591, -1.152];

export function CommunityMap({ reports }: { reports: Report[] }) {
  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom className="h-[360px] w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reports.map((report) => (
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
