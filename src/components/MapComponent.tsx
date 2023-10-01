import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import InfoCard from '../components/InfoCard';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export interface SymptomData {
    zip: string;
    symptoms: {
        [key: string]: number;
    };
    population: number;
}

interface MapComponentProps {
    onZipDataChange: (data: SymptomData | null) => void;
    onAnalysisChange: (analysis: string | null) => void;
    className?: string; 
}

const customIcon = new L.Icon({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

async function fetchSymptomsByZip(zip: string): Promise<SymptomData | null> {
    try {
        const response = await fetch(`${SERVER_URL}/symptoms/${zip}`);
        const data = await response.json();
        return {
            zip: data.zip,
            symptoms: data.symptoms,
            population: data.population,
        };
    } catch (error) {
        console.error("Error fetching symptoms:", error);
        return null;
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

function MapComponent({ onZipDataChange, onAnalysisChange }: MapComponentProps) {
    const [geojsonData, setGeojsonData] = useState(null);
    const [selectedZipData, setSelectedZipData] = useState<SymptomData | null>(
        null
    );
    const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

    useEffect(() => {
        fetch("/California_Zip_Codes.geojson")
            .then((response) => response.json())
            .then((data) => setGeojsonData(data))
            .catch((error) => console.error("Error fetching GeoJSON data:", error));
    }, []);

    function GeoJSONLayer() {
        const map = useMap();

        useEffect(() => {
            if (geojsonData) {
                L.geoJSON(geojsonData, {
                    onEachFeature: (feature, layer) => {
                        layer.on("click", async (e) => {
                            e.originalEvent.preventDefault();
        
                            const zipCode = feature.properties.ZIP_CODE;
                            const data = await fetchSymptomsByZip(zipCode);
                            let analysis = await fetchOutbreakAnalysis(zipCode);
        
                            if (analysis.includes("'None'")) {
                                analysis = "None";
                            }
        
                            setSelectedZipData(data);
                            setSelectedAnalysis(analysis);

                            onZipDataChange(data);
                            onAnalysisChange(analysis);
        
                            const symptomsContent = data?.symptoms
                                ? `Symptoms: ${JSON.stringify(data.symptoms)}`
                                : "";
                            const populationContent = data?.population
                                ? `Population: ${data.population}`
                                : "";
        
                            // popup with all data - use for debugging
                            // const popupContent = `ZIP Code: ${zipCode} ${symptomsContent} ${populationContent} - Analysis: ${analysis}`;
        
                            const popupContent = `ZIP Code: ${zipCode} \nAnalysis: ${analysis}`;


                            /*
                            layer
                                .bindPopup(popupContent, {
                                    autoPan: false,
                                    offset: L.point(0, -20),
                                })
                                .openPopup();
                                */
                        });
                    },
                }).addTo(map);
            }
        }, [map, geojsonData]);

        return (
            <>
                {selectedZipData && selectedZipData.symptoms && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 p-4 rounded-lg text-sm z-10 space-y-2">
                        <h3 className="text-xl mb-2">Symptoms</h3>
                        {Object.entries(selectedZipData.symptoms).map(
                            ([symptom, count]) => (
                                <div key={symptom}>
                                    {symptom}: {count}
                                </div>
                            )
                        )}
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
        <MapContainer
            center={[36.7783, -119.4179]}
            zoom={6}
            style={{ width: "100%", height: "900px" }}
        >
            
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geojsonData && <GeoJSONLayer />}
        </MapContainer>
        
    );
}

export default MapComponent;
