import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import "./Map.css"; // Your custom CSS
import redPin from './Images/RedPin.webp';
import yellowPin from './Images/YellowPin.webp';
import greenPin from './Images/GreenPin.webp';


const createCustomIcon = (color) => {
    let iconUrl;
    switch (color.toLowerCase()) {
        case 'red':
            iconUrl = redPin;
            break;
        case 'yellow':
            iconUrl = yellowPin;
            break;
        case 'green':
            iconUrl = greenPin;
            break;
        default:
            iconUrl = redPin; // Default to red if color doesn't match
    }

    return L.icon({
        iconUrl: iconUrl,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

const Map = () => {
    // Example locations data with color property
    const locations = [
        { id: 1, name: "Retailer 1", details: "score of 0", position: [38.2527, -85.7585], color: 'red' },
        { id: 2, name: "Retailer 2", details: "score of 1", position: [38.2530, -85.7550], color: 'yellow' },
        // Add more locations here with color: 'green', 'yellow', or 'red'
    ];

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <MapContainer center={[38.2527, -85.7585]} zoom={13} scrollWheelZoom={true} style={{ height: "600px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((location) => (
                    <Marker
                        key={location.id}
                        position={location.position}
                        icon={createCustomIcon(location.color)} // Use the custom icon based on color
                    >
                        <Popup>
                            {location.name} 
                            {location.details}
                        </Popup>
                        
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default Map;
