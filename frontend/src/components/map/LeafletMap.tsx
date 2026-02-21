import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons (Leaflet + bundlers issue)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapPin {
  id: number;
  lat: number;
  lng: number;
  title: string;
  info: string;
}

interface LeafletMapProps {
  pins: MapPin[];
  center?: { lat: number; lng: number };
  userPosition?: { lat: number; lng: number } | null;
  zoom?: number;
  className?: string;
}

function FitBounds({ pins, userPosition }: { pins: MapPin[]; userPosition?: { lat: number; lng: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (pins.length === 0) return;

    const points: L.LatLngExpression[] = pins.map((p) => [p.lat, p.lng]);
    if (userPosition) points.push([userPosition.lat, userPosition.lng]);

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, pins, userPosition]);

  return null;
}

export function LeafletMap({
  pins,
  center,
  userPosition,
  zoom = 12,
  className = "h-[500px] w-full",
}: LeafletMapProps) {
  const mapCenter = useMemo<[number, number]>(() => {
    if (center) return [center.lat, center.lng];
    if (userPosition) return [userPosition.lat, userPosition.lng];
    return [10.3157, 123.8854]; // Cebu City default
  }, [center, userPosition]);

  return (
    <div className={className}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full rounded-xl"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pins.map((pin) => (
          <Marker key={pin.id} position={[pin.lat, pin.lng]}>
            <Popup>
              <strong className="text-sm">{pin.title}</strong>
              <p className="mt-1 text-xs text-slate-600">{pin.info}</p>
            </Popup>
          </Marker>
        ))}

        {userPosition && (
          <CircleMarker
            center={[userPosition.lat, userPosition.lng]}
            radius={8}
            pathOptions={{ color: "#0284c7", fillColor: "#38bdf8", fillOpacity: 0.9, weight: 2 }}
          >
            <Popup>Your Location</Popup>
          </CircleMarker>
        )}

        <FitBounds pins={pins} userPosition={userPosition} />
      </MapContainer>
    </div>
  );
}
