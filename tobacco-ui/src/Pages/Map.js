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
    { id: 3, name: "Mock Retailer 3", details: "score of 2", address: "470 E Brandeis Ave, Louisville KY, 40217", color: 'yellow' },
    { id: 4, name: "Mock Retailer 4", details: "score of 3", address: "600 Ruggles Pl, Louisville, KY 40208", color: 'green' },
    { id: 5, name: "Mock Retailer 5", details: "score of 4", address: "140 N Fourth St, Louisville, KY 40202", color: 'red' },
    { id: 6, name: "Mock Retailer 6", details: "score of 5", address: "1 Arena Plaza, Louisville, KY 40202", color: 'yellow' },
    { id: 7, name: "Mock Retailer 7", details: "score of 6", address: "3723 Lexington Rd, Louisville, KY 40207", color: 'green' },
    { id: 8, name: "Mock Retailer 8", details: "score of 7", address: "5000 Shelbyville Rd, Louisville, KY 40207", color: 'red' },
    { id: 9, name: "Mock Retailer 9", details: "score of 8", address: "2550 S Floyd St, Louisville, KY 40208", color: 'yellow' },
    { id: 10, name: "Mock Retailer 10", details: "score of 9", address: "101 S 5th St, Louisville, KY 40202", color: 'green' },
    { id: 11, name: "Mock Retailer 11", details: "score of 10", address: "3123 S 2nd St, Louisville, KY 40208", color: 'red' },
    { id: 12, name: "Mock Retailer 12", details: "score of 11", address: "6622 Preston Hwy, Louisville, KY 40219", color: 'yellow' },
    { id: 13, name: "Mock Retailer 13", details: "score of 12", address: "3408 Bardstown Rd, Louisville, KY 40218", color: 'green' },
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




