import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';

// Extend Leaflet to include heatLayer
declare module 'leaflet' {
  function heatLayer(latlngs: L.LatLngExpression[], options: HeatLayerOptions): L.Layer;

  interface HeatLayerOptions extends L.LayerOptions {
    radius?: number;
    blur?: number;
    maxZoom?: number;
    name?: string;
  }
}

interface Disaster {
  _id?: string;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  frequency: number;
  date?: string | Date;
}

interface HeatmapLayerProps {
  points: Disaster[];
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Remove any existing heat layer
    map.eachLayer((layer) => {
      if ((layer as L.Layer & { options: L.HeatLayerOptions }).options.name === 'heatmap') {
        map.removeLayer(layer);
      }
    });

    // Prepare heatmap data: [lat, lng, intensity]
    const heatPoints = points.map(point => [
      point.location.lat, 
      point.location.lng, 
      point.frequency || 1
    ]);

    // Create and add the heat layer
    const heatLayer = L.heatLayer(heatPoints as L.LatLngTuple[], { 
      radius: 25,
      blur: 15,
      maxZoom: 17,
      name: 'heatmap'
    });
    heatLayer.addTo(map);
  }, [map, points]);

  return null;
};

const DisasterHeatmap: React.FC = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  // Fetch disasters when the component mounts or when the filter changes
  useEffect(() => {
    fetchDisasters(filterType);
  }, [filterType]);

  const fetchDisasters = async (type: string) => {
    try {
      let url = 'http://localhost:5000/api/disasters';
      if (type && type !== 'all') {
        url += `?type=${encodeURIComponent(type)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setDisasters(data);

      // When viewing all disasters, compute available disaster types
      if (type === 'all') {
        const types = Array.from(new Set(data.map((d: Disaster) => d.type)));
        setAvailableTypes(types as string[]);
      }
    } catch (error) {
      console.error('Error fetching disasters:', error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {/* Header with filter controls */}
      <div style={{ padding: '10px', background: '#f8f9fa' }}>
        <label htmlFor="disasterType" style={{ marginRight: '10px' }}>
          Filter by Disaster Type:
        </label>
        <select id="disasterType" value={filterType} onChange={handleFilterChange}>
          <option value="all">All</option>
          {availableTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      {/* Map container */}
      <MapContainer 
        center={[23.6850, 90.3563]} 
        zoom={7} 
        style={{ height: 'calc(100vh - 50px)', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <HeatmapLayer points={disasters} />
      </MapContainer>
    </div>
  );
};

export default DisasterHeatmap;
