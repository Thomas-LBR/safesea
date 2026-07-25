"use client";

import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useMap } from "react-leaflet";
import { getSeverityLabel, getStatusLabel, getTypeLabel } from "@/services/reports";
import type { Report } from "@/types/report";

export function CommunityMap({ reports, center }: { reports: Report[]; center: [number, number] }) {
  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom className="h-[360px] w-full">
      <MapViewport center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reports.map((report) => (
        <Marker key={report.id} position={[report.latitude, report.longitude]}>
          <Popup>
            <strong>{report.title}</strong>
            <br />
            {getTypeLabel(report.type)} - {getSeverityLabel(report.severity)}
            <br />
            {getStatusLabel(report.status)} - {report.confirmations} confirmation{report.confirmations > 1 ? "s" : ""}
            {report.description ? (
              <>
                <br />
                {report.description}
              </>
            ) : null}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function MapViewport({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);

  return null;
}
