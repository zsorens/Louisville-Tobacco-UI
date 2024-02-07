import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import "./Map.css"; // Your custom CSS

const Map = () => {
    // Example locations data
    const locations = [
        { id: 1, name: "Retailer 1", position: [38.2527, -85.7585] },
        { id: 2, name: "Retailer 2", position: [38.2530, -85.7550] },
        // Add more locations here
    ];

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <MapContainer center={[38.2527, -85.7585]} zoom={13} scrollWheelZoom={false} style={{ height: "500px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((location) => (
                    <Marker key={location.id} position={location.position}>
                        <Popup>{location.name}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default Map;
