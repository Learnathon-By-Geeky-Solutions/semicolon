import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useDisasterContext } from '../../hooks/useDisasterContext';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const DisasterMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<L.Layer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const { disasters, loading } = useDisasterContext();
  const [heatmapLoaded, setHeatmapLoaded] = useState(false);

  useEffect(() => {
    if (typeof L.heatLayer !== 'function') {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
      script.async = true;
      script.onload = () => {
        console.log('Leaflet.heat loaded successfully');
        setHeatmapLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Leaflet.heat library');
      };
      document.body.appendChild(script);
    } else {
      console.log('Leaflet.heat already loaded');
      setHeatmapLoaded(true);
    }
  }, []);

  // Initialize the map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      console.log('Initializing map');
      
      // Create map instance
      const map = L.map(mapRef.current).setView([23.6850, 90.3563], 7);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Create a layer group for markers
      markersLayerRef.current = L.layerGroup().addTo(map);
      
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
  
  // Create and update heat layer
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || loading || !disasters || disasters.length === 0 || !heatmapLoaded) {
      console.log('Not ready to create heatmap:', {
        mapExists: !!map,
        isLoading: loading,
        disastersCount: disasters?.length || 0,
        heatmapLoaded
      });
      return;
    }
    
    // Verify L.heatLayer is available
    if (typeof L.heatLayer !== 'function') {
      console.error("L.heatLayer is not a function. Library may not be loaded correctly.");
      return;
    }
    
    console.log('Creating heatmap with', disasters.length, 'disaster points');
    
    // Remove existing heat layer if it exists
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }
    
    // Clear existing markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
    }
    
    try {
      // Transform and filter valid points
      const points = disasters
        .filter(d => 
          d.location && 
          typeof d.location.lat === 'number' && 
          typeof d.location.lng === 'number'
        )
        .map(d => [
          d.location.lat, 
          d.location.lng, 
          d.frequency ?? 1 // Add intensity value
        ]);
      
      console.log('Prepared points for heatmap:', points.length);
      console.log('Sample points:', points.slice(0, 3));
      
      if (points.length > 0) {
        // Create a new heatmap layer with explicit configuration
        const heatLayer = L.heatLayer(points as Array<[number, number, number]>, {
          radius: 25,
          blur: 15,
          maxZoom: 17,
          gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }, // Add a clear gradient
          minOpacity: 0.5
        });
        
        // Add to map and store reference
        heatLayer.addTo(map);
        heatLayerRef.current = heatLayer;
        console.log('Heatmap layer added to map successfully');
        
        // Add invisible markers for each disaster with tooltips
        disasters.forEach(disaster => {
          if (disaster.location && typeof disaster.location.lat === 'number' && typeof disaster.location.lng === 'number') {
            
            const formattedDate = disaster.date
              ? new Date(disaster.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              : 'Unknown';
            const marker = L.circleMarker(
              [disaster.location.lat, disaster.location.lng],
              {
                radius: 20,
                fillColor: 'transparent',
                fillOpacity: 0,
                stroke: false
              }
            );
            
            //custom tooltip
            const tooltipContent = `
              <div class="disaster-tooltip">
                <div class="disaster-type">${disaster.type}</div>
                <div class="disaster-date">${formattedDate}</div>
              </div>
            `;
            
            marker.bindTooltip(tooltipContent, {
              direction: 'top',
              offset: L.point(0, -10),
              opacity: 0.9,
              className: 'disaster-tooltip-container'
            });
            
            // Add to markers layer group
            if (markersLayerRef.current) {
              marker.addTo(markersLayerRef.current);
            }
          }
        });
        
        const style = document.createElement('style');
        style.textContent = `
          .disaster-tooltip-container {
            background-color: #ffffff;
            border: none;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
            padding: 0;
          }
          .disaster-tooltip-container .leaflet-tooltip-content {
            padding: 0;
          }
          .disaster-tooltip {
            padding: 10px 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
              Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
          .disaster-type {
            font-weight: 600;
            font-size: 14px;
            color: #1a1a1a;
            margin-bottom: 4px;
          }
          .disaster-date {
            font-size: 12px;
            color: #666666;
          }
          .leaflet-tooltip-top:before {
            border-top-color: #ffffff;
          }
        `;
        document.head.appendChild(style);
        
        // Force the map to redraw
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      } else {
        console.warn('No valid points available for heatmap');
      }
    } catch (error) {
      console.error('Error creating heat layer:', error);
    }
  }, [disasters, loading, heatmapLoaded]);
  
  return (
    <div>
      <div 
        ref={mapRef} 
        className="map-container" 
        style={{ height: 'calc(100vh - 50px)', width: '100%' }}
      />
      {!heatmapLoaded && (
        <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', 
                    background: 'white', padding: '5px 10px', borderRadius: '5px', zIndex: 1000 }}>
          Loading heatmap library...
        </div>
      )}
    </div>
  );
};

export default DisasterMap;