import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { Disaster } from '../../types/disasterTypes';

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

    // Only add the heatmap layer if we have points
    if (points.length === 0) return;

    // Prepare heatmap data: [lat, lng, intensity]
    const heatPoints = points.map(point => [
      point.location.lat, 
      point.location.lng, 
      point.frequency || 1
    ]);

    // Create and add the heat layer
    try {
      const heatLayer = L.heatLayer(heatPoints as L.LatLngTuple[], { 
        radius: 25,
        blur: 15,
        maxZoom: 17,
        name: 'heatmap'
      });
      heatLayer.addTo(map);
    } catch (error) {
      console.error('Error creating heat layer:', error);
    }
  }, [map, points]);

  return null;
};

export default HeatmapLayer;