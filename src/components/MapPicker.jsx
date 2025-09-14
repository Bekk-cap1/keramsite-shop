import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Убираем ошибку с маркером
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Компонент выбора точки
const LocationMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

const MapPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">📍 Выберите точку на карте:</h4>
      <MapContainer
        center={[41.3111, 69.2797]} // Центр — Ташкент
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker setPosition={(pos) => {
          setPosition(pos);
          onLocationSelect(pos); // передаём координаты вверх
        }} />
        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
};

export default MapPicker;
