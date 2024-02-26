import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "../Styling/Map.css";
import redPin from '../Images/RedPin.webp';
import yellowPin from '../Images/YellowPin.webp';
import greenPin from '../Images/GreenPin.webp';

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
            iconUrl = redPin;
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

const mockAddresses = [
    { id: 1, name: "Mock Retailer 1", details: "score of 0", address: "1841 Alfresco Pl, Louisville, KY, 40205", color: 'red' },
    { id: 2, name: "Mock Retailer 2", details: "score of 1", address: "1641 Norris Pl, Louisville, KY, 40205", color: 'green' },
    // Add more mock addresses here
];

const MapPage = () => {
    const [locations, setLocations] = useState([]);
    const [selectedRetailer, setSelectedRetailer] = useState(null);

    useEffect(() => {
        const geocodeLocations = async () => {
            const geocodedLocations = await Promise.all(
                mockAddresses.map(async (location) => {
                    const coords = await handleGeocode(location.address);
                    return coords ? { ...location, position: [coords.lat, coords.lon] } : null;
                })
            );

            setLocations(geocodedLocations.filter(loc => loc !== null));
        };

        geocodeLocations();
    }, []);

    const handleMarkerClick = (retailer) => {
        setSelectedRetailer(retailer);
    };

    return (
        <div className="map-page-container">
            <div className="map-sidebar-container d-flex flex-row">
                <div className="map-container">
                    <MapContainer center={[38.2527, -85.7585]} zoom={13} scrollWheelZoom={true} style={{ height: "80vh" }}>
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
                        <MapUpdater />
                    </MapContainer>
                </div>
                <div className="sidebar-container">
                    {selectedRetailer && (
                        <div>
                            <h2>{selectedRetailer.name}</h2>
                            <p>{selectedRetailer.address}</p>
                            <p>{selectedRetailer.details}</p>
                            {/* Add more information here if needed */}
                        </div>
                    )}
                </div>
            </div>
            <div className="mock-addresses-container d-flex justify-content-center w-100">
                <div>
                <h2>Mock Addresses</h2>
                {locations.map((location) => (
                    <div key={location.id}>
                        <p>{location.name}</p>
                        <p>{location.address}</p>
                        {/* Add more information here if needed */}
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
};

export default MapPage;




