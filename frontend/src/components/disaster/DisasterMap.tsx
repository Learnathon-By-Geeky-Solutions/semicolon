import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import HeatmapLayer from './HeatMapLayer';
import { useDisasterContext } from '../../providers/DisasterContextProvider';

const DisasterMap: React.FC = () => {
  const { disasters } = useDisasterContext();
  
  return (
    <div className="map-container" style={{ height: 'calc(100vh - 50px)', width: '100%' }}>
      <MapContainer 
        center={[23.6850, 90.3563]} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
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

export default DisasterMap;