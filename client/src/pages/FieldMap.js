import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const FieldMap = () => {
  const position = [51.505, -0.09]; // Default center
  
  // Dummy data for a field polygon
  const fieldPolygon = [
    [51.515, -0.09],
    [51.52, -0.1],
    [51.52, -0.12],
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Field Map</h1>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="h-[600px] w-full rounded-lg overflow-hidden">
          <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                A sample marker. <br /> Easily customizable.
              </Popup>
            </Marker>
            <Polygon positions={fieldPolygon} pathOptions={{ color: 'purple' }}>
                <Popup>Field #1: Wheat</Popup>
            </Polygon>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default FieldMap;
