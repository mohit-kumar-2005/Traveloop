import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function TripMap({ stops = [] }) {
  const pts = stops
    .map((s) => s.cityId?.coordinates)
    .filter(Boolean)
    .map((c) => [c.lat, c.lng]);
  const center = pts[0] || [20, 0];
  return (
    <MapContainer center={center} zoom={pts.length > 1 ? 4 : 5} className="h-[420px] w-full z-0">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {pts.length > 1 && (
        <Polyline positions={pts} pathOptions={{ color: '#2DD4BF', dashArray: '6 8', weight: 3 }} />
      )}
      {stops.map((s) =>
        s.cityId?.coordinates ? (
          <Marker key={s._id} position={[s.cityId.coordinates.lat, s.cityId.coordinates.lng]}>
            <Popup>
              {s.cityName}, {s.country}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}
