import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StatusBadge from './StatusBadge';

// Fix Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored icons
const createCustomIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

const redIcon = createCustomIcon('#dc2626'); // Emergency Request
const blueIcon = createCustomIcon('#2563eb'); // Shelter
const greenIcon = createCustomIcon('#16a34a'); // Completed

const MapViewComponent = ({ requests = [], shelters = [], center = [19.0760, 72.8777], zoom = 12 }) => {
  return (
    <div className="w-full h-full min-h-[450px] rounded-xl overflow-hidden border border-slate-200 shadow-sm relative z-10">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', minHeight: '450px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Emergency Request Markers */}
        {requests.map((req) => {
          if (!req.location || !req.location.coordinates) return null;
          const [lng, lat] = req.location.coordinates;
          const isDone = req.status === 'Completed';

          return (
            <Marker 
              key={req._id} 
              position={[lat, lng]} 
              icon={isDone ? greenIcon : redIcon}
            >
              <Popup>
                <div className="p-1 space-y-1 max-w-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">
                      {req.emergencyType}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">{req.title}</h4>
                  <p className="text-slate-600 text-[11px] line-clamp-2">{req.description}</p>
                  <p className="text-[10px] text-slate-500 font-medium">📍 {req.address}</p>
                  <p className="text-[10px] text-slate-700 font-bold">📞 {req.contactPhone}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Shelter Markers */}
        {shelters.map((shelter) => {
          if (!shelter.location || !shelter.location.coordinates) return null;
          const [lng, lat] = shelter.location.coordinates;

          return (
            <Marker 
              key={shelter._id} 
              position={[lat, lng]} 
              icon={blueIcon}
            >
              <Popup>
                <div className="p-1 space-y-1 max-w-xs">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                    🏢 Relief Shelter
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs">{shelter.name}</h4>
                  <p className="text-[10px] text-slate-600">📍 {shelter.address}</p>
                  <div className="text-[11px] font-semibold text-slate-800">
                    Occupancy: {shelter.currentOccupancy} / {shelter.capacity} beds
                  </div>
                  <p className="text-[10px] text-slate-700 font-bold">📞 {shelter.contactPhone} ({shelter.contactPerson})</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapViewComponent;
