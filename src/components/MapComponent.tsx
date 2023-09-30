import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

interface SymptomData {
    zip: string;
    symptoms: {
        [key: string]: number;
    };
}

const customIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

async function fetchSymptomsByZip(zip: string) {
    try {
        const response = await fetch(`${SERVER_URL}/symptoms/${zip}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching symptoms:", error);
    }
}

async function fetchSymptomAnalysis(summary: string) {
    try {
        const response = await fetch(`${SERVER_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ summary })
        });
        const data = await response.json();
        return data.insight;
    } catch (error) {
        console.error("Error fetching analysis:", error);
    }
}

async function fetchOutbreakAnalysis(zip: string) {
    try {
        const response = await fetch(`${SERVER_URL}/analyze/${zip}`);
        const data = await response.json();
        return data.analysis;
    } catch (error) {
        console.error("Error fetching analysis:", error);
    }
}

function MapComponent() {
    const [geojsonData, setGeojsonData] = useState(null);
    const [selectedZipData, setSelectedZipData] = useState<SymptomData | null>(null);
    const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

    useEffect(() => {
        fetch('/California_Zip_Codes.geojson')
            .then(response => response.json())
            .then(data => setGeojsonData(data))
            .catch(error => console.error('Error fetching GeoJSON data:', error));
    }, []);

    function GeoJSONLayer() {
        const map = useMap();
        const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
    
        useEffect(() => {
            if (geojsonData) {
                if (!geoJsonLayerRef.current) {
                    geoJsonLayerRef.current = L.geoJSON(geojsonData, {
                        onEachFeature: (feature, layer) => {
                            layer.on('click', async (e) => {
                                map.dragging.disable();
                                map.doubleClickZoom.disable();
                                map.scrollWheelZoom.disable();
    
                                const zipCode = feature.properties.ZIP_CODE;
                                const data = await fetchSymptomsByZip(zipCode);
                                const analysis = await fetchOutbreakAnalysis(zipCode);
                                setSelectedZipData(data);
                                setSelectedAnalysis(analysis);
    
                                const popupContent = data
                                    ? `ZIP Code: ${zipCode} - Symptoms: ${JSON.stringify(data.symptoms)} - Analysis: ${analysis}`
                                    : `ZIP Code: ${zipCode}`;
    
                                map.dragging.enable();
                                map.doubleClickZoom.enable();
                                map.scrollWheelZoom.enable();
    
                                layer.bindPopup(popupContent).openPopup();
                            });
                        }
                    }).addTo(map);
                }
            }
    
            return () => {
                if (geoJsonLayerRef.current) {
                    map.removeLayer(geoJsonLayerRef.current);
                }
            };
        }, [map, geojsonData]);

        return (
            <>
                {selectedZipData && selectedZipData.symptoms && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 p-4 rounded-lg text-sm z-10 space-y-2">
                        <h3 className="text-xl mb-2">Symptoms</h3>
                        {Object.entries(selectedZipData.symptoms).map(([symptom, count]) => (
                            <div key={symptom}>
                                {symptom}: {count}
                            </div>
                        ))}
                    </div>
                )}
                {selectedAnalysis && (
                    <div className="absolute top-4 right-1/4 bg-white bg-opacity-80 p-4 rounded-lg text-sm z-10 space-y-2">
                        <h3 className="text-xl mb-2">Analysis</h3>
                        <p>{selectedAnalysis}</p>
                    </div>
                )}
            </>
        );
    }

    return (
        <MapContainer center={[36.7783, -119.4179]} zoom={6} style={{ width: '100%', height: '900px' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geojsonData && <GeoJSONLayer />}
        </MapContainer>
    );
}

export default MapComponent;
