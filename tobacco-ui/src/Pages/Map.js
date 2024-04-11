import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../Styling/Map.css";
import redPin from "../Images/RedPin.webp";
import yellowPin from "../Images/YellowPin.webp";
import greenPin from "../Images/GreenPin.webp";
import { readString } from "react-papaparse"; // Importing CSV parser library

const handleGeocodeFromPlaceId = async (placeId) => {
  try {
    const apiKey = "AIzaSyCUf0oKnKTVIuIaGQ99igN4MhwLOTJboUc"; // Replace with your API key
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?place_id=${encodeURIComponent(
        placeId
      )}&key=${apiKey}`
    );
    const data = await response.json();
    if (data && data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      console.error("No results found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocode:", error);
  }
};

const handleGeocode = async (address) => {
  try {
    const apiKey = "AIzaSyCUf0oKnKTVIuIaGQ99igN4MhwLOTJboUc"; // Replace with your API key
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );
    const data = await response.json();
    if (data && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lon: location.lng,
      };
    } else {
      console.error("No results found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocode:", error);
  }
};

const createCustomIcon = (color) => {
  let iconUrl;
  switch (color.toLowerCase()) {
    case "red":
      iconUrl = redPin;
      break;
    case "yellow":
      iconUrl = yellowPin;
      break;
    case "green":
      iconUrl = greenPin;
      break;
    default:
      iconUrl = redPin;  // Default color is red as per your original setup
  }

  return L.icon({
    iconUrl: iconUrl,
    iconSize: [50, 50],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
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

const MapPage = () => {
  const [locations, setLocations] = useState([]);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [csvData, setCSVData] = useState("");

  useEffect(() => {
    const fetchCSVData = async () => {
      try {
        const response = await fetch("/test.csv"); // Replace with your CSV file path
        const csvText = await response.text();
        const lines = csvText.trim().split("\n");
        const csvData = lines.slice(0).join("\n"); // Exclude the first line
        setCSVData(csvData);
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
    };

    fetchCSVData();
  }, []);

  useEffect(() => {
    if (csvData) {
      readString(csvData, {
        complete: function (results) {
          const placeData = results.data.slice(1); // Exclude header row
          const geocodeLocations = async () => {
            const geocodedLocations = await Promise.all(
              placeData.map(async (row, index) => {
                const placeId = row[0]; // Extract place ID from CSV
                const address = await handleGeocodeFromPlaceId(placeId);
                const coords = await handleGeocode(address);
                const flagText = parseInt(row[1]); // Extract flag text from CSV and parse as integer
                const flagImage = parseInt(row[2]); // Extract flag image from CSV and parse as integer
                const flagWebsite = parseInt(row[3]); // Extract flag website from CSV and parse as integer
                const flagCount = flagText + flagImage + flagWebsite; // Calculate total flag count
                const color = getColorFromFlags(flagCount); // Determine marker color based on flag count
                return coords
                  ? {
                      id: index + 1,
                      address,
                      position: [coords.lat, coords.lon],
                      flag_count: flagCount, // Add flag count to location object
                      color,
                    }
                  : null;
              })
            );

            setLocations(geocodedLocations.filter((loc) => loc !== null));
          };

          geocodeLocations();
        },
      });
    }
  }, [csvData]);

  const handleMarkerClick = (retailer) => {
    setSelectedRetailer(retailer);
  };

  const getColorFromFlags = (flagCount) => {
    if (flagCount >= 3) {
      return "red";
    } else if (flagCount > 0) {
      return "yellow";
    } else {
      return "green";
    }
  };

  // Function to download CSV
  const exportCardsToCSV = () => {
    const csvContent = locations.map(loc => 
      `"${loc.address.replace(/"/g, '""')}",${loc.flag_count},${loc.color}`
    ).join("\n");

    const csvHeader = "Address,Flag Count,Color\n";
    const csvFile = csvHeader + csvContent;

    const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'retailers_info.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="map-page-container">
      <div className="map-sidebar-container d-flex flex-row">
        <div className="map-container">
          <MapContainer
            center={[38.2527, -85.7585]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "80vh" }}
          >
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
                <Popup>{location.address}</Popup>
              </Marker>
            ))}
            <MapUpdater />
          </MapContainer>
        </div>
        <div className="sidebar-container">
          {selectedRetailer && (
            <div>
              <h2>Retailer Information</h2>
              <p>{selectedRetailer.address}</p>
              {/* Add more information here if needed */}
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="d-flex justify-content-center pt-4 pb-2">
          <h3>Retailers Info</h3>
        </div>
        <div className="d-flex justify-content-center mb-3 ">
          <input
            type="text"
            className="form-control max-width-150px"
            placeholder="Enter ZIP code..."
            aria-label="Enter ZIP code"
            aria-describedby="zip-filter-button"
          />
          <button
            className="btn btn-primary"
            type="button"
            id="zip-filter-button"
          >
            Filter
          </button>
          <button
            className="btn btn-success ml-2"
            onClick={exportCardsToCSV}
          >
            Export CSV
          </button>
        </div>
        <hr className="my-4 hr-line" />
        <div className="container">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
            {locations.map((location) => (
              <div className="col mb-4" key={location.id}>
                <div
                  className="card"
                  style={{
                    backgroundColor: getColorFromFlags(location.flag_count),
                  }}
                >
                  <div className="card-body">
                    <p className="card-text">{location.address}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
