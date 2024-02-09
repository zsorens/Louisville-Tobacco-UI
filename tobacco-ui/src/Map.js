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

const handleGeocode = async (address) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
            return {

                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            }

        } else {
            console.error('No results found');
            return null;
        }
    } catch (error) {
        console.error('Error fetching geocode:', error);
    }
};

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
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }, [sidebarOpen, map]);

    return null;
}

const Map = () => {
    const [locations, setLocations] = useState([]); // Store geocoded locations
    const [selectedRetailer, setSelectedRetailer] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        // Function to geocode all addresses
        const geocodeLocations = async () => {
            const addresses = [
                { id: 1, name: "Retailer 1", details: "score of 0", address: "1841 Alfresco Pl, Louisville, KY, 40205", color: 'red' },
                { id: 2, name: "Retailer 2", details: "score of 1", address: "1641 Norris Pl, Louisville, KY, 40205", color: 'green' },
                // Add more locations with addresses here
            ];

            const geocodedLocations = await Promise.all(
                addresses.map(async (location) => {
                    const coords = await handleGeocode(location.address);
                    return coords ? { ...location, position: [coords.lat, coords.lon] } : null;
                })
            );

            setLocations(geocodedLocations.filter(loc => loc !== null)); // Filter out any nulls
        };

        geocodeLocations();
    }, []);

    const handleMarkerClick = (retailer) => {
        setSelectedRetailer(retailer);
        setSidebarOpen(true);
    };

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
