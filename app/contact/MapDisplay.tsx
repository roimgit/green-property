'use client';

import { useEffect, useRef } from 'react';

export function MapDisplay({ googleMapsUrl, address }: { googleMapsUrl: string; address?: string }) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Extract coordinates from Google Maps URL
    let lat = -6.2088; // Default: Jakarta
    let lng = 106.8456;

    // Try to extract coordinates from various URL formats
    const coordPattern = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const match = googleMapsUrl.match(coordPattern);
    if (match) {
      lat = parseFloat(match[1]);
      lng = parseFloat(match[2]);
    }

    console.log(`[Map] Coordinates: ${lat}, ${lng}`);

    // Dynamically load Leaflet CSS and JS
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(leafletCSS);

    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    leafletScript.async = true;
    leafletScript.onload = () => {
      if (!mapContainer.current) return;

      // Create Leaflet map
      const map = window.L.map(mapContainer.current).setView([lat, lng], 15);

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker with popup
      const markerText = address || `Lokasi: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      window.L.marker([lat, lng])
        .bindPopup(markerText)
        .addTo(map)
        .openPopup();
    };
    document.head.appendChild(leafletScript);

    return () => {
      if (leafletCSS.parentNode) leafletCSS.parentNode.removeChild(leafletCSS);
      if (leafletScript.parentNode) leafletScript.parentNode.removeChild(leafletScript);
    };
  }, [googleMapsUrl, address]);

  return (
    <div
      ref={mapContainer}
      style={{
        height: '400px',
        width: '100%',
      }}
    />
  );
}
