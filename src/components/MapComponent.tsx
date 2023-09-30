import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });


function MapComponent() {
    const [geojsonData, setGeojsonData] = useState(null);
  
    useEffect(() => {
      fetch('/California_Zip_Codes.geojson')
        .then(response => response.json())
        .then(data => setGeojsonData(data))
        .catch(error => console.error('Error fetching GeoJSON data:', error));
    }, []);

    function GeoJSONLayer() {
        const map = useMap();
      
        useEffect(() => {
          if (geojsonData) {
            L.geoJSON(geojsonData).addTo(map);
          }
        }, [map, geojsonData]);
      
        return null;
      }


  type City = {
    name: string;
    coordinates: [number, number];
  };
  
  const cities: City[] = [
    { name: "New York", coordinates: [40.730610, -73.935242] },
    // Add other cities as needed...
  ];

  return (
    <MapContainer center={[36.7783, -119.4179]} zoom={6} style={{ width: '100%', height: '900px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geojsonData && <GeoJSONLayer />}
      {/* ... other components, if needed ... */}
    </MapContainer>
  );
}

export default MapComponent;
