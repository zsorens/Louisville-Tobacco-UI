import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import "./Map.css"; // Your custom CSS
import redPin from './Images/RedPin.webp';
import yellowPin from './Images/YellowPin.webp';
import greenPin from './Images/GreenPin.webp';
// import Modal from 'react-modal';

// // Modal.setAppElement('#root');

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
        iconSize: [50, 50],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

function MapUpdater({ sidebarOpen }) {
    const map = useMap();
  
    useEffect(() => {
      // A slight delay to ensure the sidebar animation has finished
      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    }, [sidebarOpen, map]);
  
    return null;
  };

const Map = () => {
    const [selectedRetailer, setSelectedRetailer] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Example locations data with color property
    const locations = [
        { id: 1, name: "Retailer 1", details: "score of 0", position: [38.2527, -85.7585], color: 'red' },
        { id: 2, name: "Retailer 2", details: "score of 1", position: [38.2530, -85.7550], color: 'yellow' },
        // Add more locations here with color: 'green', 'yellow', or 'red'
    ];

    const mapRef = useRef(null);

    // Call this function to fix the map display
    const updateMapSize = () => {
      if (mapRef.current) {
        mapRef.current.leafletElement.invalidateSize();
      }
    };
  
    // Effect to update map size when sidebarOpen changes
    useEffect(() => {
      updateMapSize();
    }, [sidebarOpen]);
  
    
    const handleMarkerClick = (retailer) => {
        setSelectedRetailer(retailer); // Set the clicked retailer
        setSidebarOpen(true); // Open the sidebar
    };

    // Close modal function
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <MapContainer center={[38.2527, -85.7585]} zoom={13} scrollWheelZoom={true} style={{ height: "600px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {locations.map((location) => (
                    <Marker
                        key={location.id}
                        position={location.position}
                        icon={createCustomIcon(location.color)}
                        eventHandlers={{
                            click: () => handleMarkerClick(location),
                        }}
                    >
                        <Popup>{location.name}</Popup>
                    </Marker>
                ))}
                <MapUpdater sidebarOpen={sidebarOpen} />
            </MapContainer>
            <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
                {selectedRetailer && (
                    <div>
                        <h2>{selectedRetailer.name}</h2>
                        <p>{selectedRetailer.details}</p>
                        {/* Additional retailer details here */}
                    </div>
                )}
                <button onClick={() => setSidebarOpen(false)}>Close</button>
            </div>
        </div>
    );
};

export default Map;
