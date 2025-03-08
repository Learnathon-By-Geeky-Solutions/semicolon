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

    // Clean up function to remove existing layers
    const cleanupLayers = () => {
      map.eachLayer((layer) => {
        if ((layer as any).options && (layer as any).options.name === 'heatmap') {
          map.removeLayer(layer);
        }
      });
    };

    // Clean up existing layers first
    cleanupLayers();

    // Only proceed if we have points
    if (!points || points.length === 0) return;

    try {
      // Prepare heatmap data: [lat, lng, intensity]
      const heatPoints = points.map(point => {
        if (!point.location || typeof point.location.lat !== 'number' || typeof point.location.lng !== 'number') {
          console.warn('Invalid point location:', point);
          return null;
        }
        return [
          point.location.lat, 
          point.location.lng, 
          point.frequency || 1
        ];
      }).filter(point => point !== null) as L.LatLngTuple[];

      // Only create the layer if we have valid points
      if (heatPoints.length > 0) {
        const heatLayer = L.heatLayer(heatPoints, { 
          radius: 25,
          blur: 15,
          maxZoom: 17,
          name: 'heatmap'
        });
        heatLayer.addTo(map);
      }
    } catch (error) {
      console.error('Error creating heat layer:', error);
    }

    // Return cleanup function
    return cleanupLayers;
  }, [map, points]);

  // Return null explicitly (no whitespace)
  return null;
};

export default HeatmapLayer;