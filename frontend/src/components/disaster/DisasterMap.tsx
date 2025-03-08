import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { useDisasterContext } from '../../providers/DisasterContextProvider';

// Import Leaflet default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon problem
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Extend Leaflet types
if (!L.heatLayer) {
  console.error("Leaflet.heat is not properly loaded. Make sure you've installed and imported it correctly.");
}

const DisasterMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null as L.Map | null);
  const heatLayerRef = useRef(null as L.Layer | null);
  const { disasters, loading } = useDisasterContext();

  // Initialize the map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Create map instance
      const map = L.map(mapRef.current).setView([23.6850, 90.3563], 7);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Save map instance to ref
      mapInstanceRef.current = map;
    }
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  
  // Update heat layer when disasters data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || loading || !disasters || disasters.length === 0) return;
    
    // Remove existing heat layer if it exists
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }
    
    try {
      // Prepare valid heatmap points
      const points = disasters
        .filter(d => d.location && typeof d.location.lat === 'number' && typeof d.location.lng === 'number')
        .map(d => [d.location.lat, d.location.lng] as [number, number]);
      
      if (points.length > 0 && L.heatLayer) {
        // Create new heat layer
        const heatLayer = L.heatLayer(points, {
          radius: 25,
          blur: 15,
          maxZoom: 17
        });
        
        // Add to map and store reference
        heatLayer.addTo(map);
        heatLayerRef.current = heatLayer;
      }
    } catch (error) {
      console.error('Error creating heat layer:', error);
    }
  }, [disasters, loading]);
  
  return (
    <div 
      ref={mapRef} 
      className="map-container" 
      style={{ height: 'calc(100vh - 50px)', width: '100%' }}
    />
  );
};

export default DisasterMap;