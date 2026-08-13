import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Compass } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createCustomMarker = (day, isStart = false) => {
  const bg = isStart ? '#A8541F' : '#1F3D2B';
  const text = isStart ? 'START' : `DAY ${day}`;

  const html = `
    <div style="
      background-color: ${bg};
      color: #FFFFFF;
      border: 2px solid #F7F4EC;
      border-radius: 20px;
      padding: 4px 10px;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      gap: 4px;
      transform: translate(-50%, -100%);
    ">
      <span style="width: 8px; height: 8px; background-color: #FBBF24; border-radius: 50%;"></span>
      <span>${text}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-map-marker',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

const FitBounds = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [points, map]);

  return null;
};

const TourMap = ({ locations = [], startLocation = null }) => {
  const allStops = [];

  if (startLocation && startLocation.coordinates) {
    allStops.push({
      lat: startLocation.coordinates[1],
      lng: startLocation.coordinates[0],
      description: startLocation.description || 'Start Location',
      day: 'Start',
      isStart: true,
    });
  }

  locations.forEach((loc) => {
    if (loc.coordinates && loc.coordinates.length === 2) {
      allStops.push({
        lat: loc.coordinates[1],
        lng: loc.coordinates[0],
        description: loc.description || `Stop (Day ${loc.day})`,
        day: loc.day || 1,
        isStart: false,
      });
    }
  });

  if (allStops.length === 0) {
    return (
      <div className="ticket-stub rounded-xl p-8 text-center text-[#8E8A7E] font-mono text-xs">
        No map coordinates available for this expedition.
      </div>
    );
  }

  const polylineCoordinates = allStops.map((stop) => [stop.lat, stop.lng]);
  const defaultCenter = [allStops[0].lat, allStops[0].lng];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#1F3D2B]">
          <Compass className="w-5 h-5 text-[#A8541F]" />
          <h3 className="font-serif font-bold text-2xl">Interactive Expedition Route Map</h3>
        </div>
        <span className="font-mono text-xs text-[#8E8A7E] bg-white px-3 py-1 rounded-full border border-[#D6CFBE]">
          {allStops.length} Mapped Coordinates
        </span>
      </div>

      <div className="relative h-[450px] w-full rounded-2xl overflow-hidden shadow-lg border-2 border-dashed border-[#D6CFBE] z-0">
        <MapContainer
          center={defaultCenter}
          zoom={8}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds points={polylineCoordinates} />

          <Polyline
            positions={polylineCoordinates}
            color="#A8541F"
            weight={4}
            opacity={0.8}
            dashArray="8, 8"
          />

          {allStops.map((stop, idx) => (
            <Marker
              key={idx}
              position={[stop.lat, stop.lng]}
              icon={createCustomMarker(stop.day, stop.isStart)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 space-y-1 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-[#1F3D2B] text-white px-2 py-0.5 rounded font-bold">
                      {stop.isStart ? 'Starting Point' : `Day ${stop.day}`}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#1F3D2B] mt-1">{stop.description}</h4>
                  <div className="pt-2 border-t border-gray-100 font-mono text-[11px] text-[#A8541F] font-semibold space-y-0.5">
                    <div>Latitude: {stop.lat.toFixed(6)}° N</div>
                    <div>Longitude: {stop.lng.toFixed(6)}° W</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        {allStops.map((stop, idx) => (
          <div
            key={idx}
            className="p-3 bg-white border border-[#D6CFBE] rounded-lg shadow-sm flex items-center justify-between text-xs font-mono"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-[#A8541F] block">
                {stop.isStart ? 'Start Point' : `Stop ${idx} (Day ${stop.day})`}
              </span>
              <span className="font-bold text-[#1F3D2B] truncate block max-w-[180px]">
                {stop.description}
              </span>
            </div>
            <div className="text-right text-[11px] text-[#8E8A7E]">
              <div>{stop.lat.toFixed(3)}°</div>
              <div>{stop.lng.toFixed(3)}°</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourMap;
