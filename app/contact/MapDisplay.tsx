'use client';

import { useEffect, useRef, useState } from 'react';

// Declare Leaflet global
declare global {
  interface Window {
    L: any;
  }
}

export function MapDisplay({ 
  latitude, 
  longitude, 
  address 
}: { 
  latitude?: number
  longitude?: number
  address?: string 
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('[MapDisplay] Props received:', { latitude, longitude, address });

  useEffect(() => {
    if (!mapContainer.current) {
      console.log('[MapDisplay] No map container ref');
      return;
    }

    // Check if coordinates are available
    if (latitude === undefined || latitude === null || longitude === undefined || longitude === null) {
      console.log('[MapDisplay] Missing coordinates:', { latitude, longitude });
      setError('Koordinat tidak tersedia.');
      setLoading(false);
      return;
    }

    console.log('[MapDisplay] Starting initialization with:', { latitude, longitude });

    const initMap = () => {
      try {
        setLoading(true);
        setError(null);

        if (!mapContainer.current) {
          console.log('[MapDisplay] Container removed during init');
          return;
        }

        console.log('[MapDisplay] Loading Leaflet CSS...');

        // Dynamically load Leaflet CSS
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
        leafletCSS.onload = () => console.log('[MapDisplay] Leaflet CSS loaded');
        leafletCSS.onerror = () => console.error('[MapDisplay] Failed to load Leaflet CSS');
        document.head.appendChild(leafletCSS);

        console.log('[MapDisplay] Loading Leaflet JS...');

        // Dynamically load Leaflet JS
        const leafletScript = document.createElement('script');
        leafletScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        leafletScript.async = true;
        
        leafletScript.onload = () => {
          console.log('[MapDisplay] Leaflet JS loaded, checking window.L...');
          
          if (!window.L) {
            console.error('[MapDisplay] window.L not found after script load');
            setError('Gagal memuat perpustakaan peta (Leaflet).');
            setLoading(false);
            return;
          }

          if (!mapContainer.current) {
            console.log('[MapDisplay] Container removed after Leaflet load');
            return;
          }

          try {
            console.log('[MapDisplay] Creating map with coordinates:', latitude, longitude);
            
            // Clear container first
            mapContainer.current.innerHTML = '';

            // Create Leaflet map
            const map = window.L.map(mapContainer.current).setView([latitude, longitude], 15);

            console.log('[MapDisplay] Map instance created');

            // Add OpenStreetMap tiles
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 19,
            }).addTo(map);

            console.log('[MapDisplay] Tiles added');

            // Add marker with popup
            const markerText = address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            window.L.marker([latitude, longitude])
              .bindPopup(markerText)
              .addTo(map)
              .openPopup();

            console.log('[MapDisplay] Marker added, map ready!');
            setLoading(false);
            setError(null);
          } catch (err) {
            console.error('[MapDisplay] Error during map initialization:', err);
            setError('Gagal membuat peta: ' + (err instanceof Error ? err.message : String(err)));
            setLoading(false);
          }
        };

        leafletScript.onerror = (err) => {
          console.error('[MapDisplay] Failed to load Leaflet JS:', err);
          setError('Gagal memuat perpustakaan peta.');
          setLoading(false);
        };

        document.head.appendChild(leafletScript);
      } catch (err) {
        console.error('[MapDisplay] Error in initMap:', err);
        setError('Error: ' + (err instanceof Error ? err.message : String(err)));
        setLoading(false);
      }
    };

    // Give DOM time to settle
    const timer = setTimeout(initMap, 100);

    return () => {
      clearTimeout(timer);
      // Cleanup
      if (mapContainer.current) {
        mapContainer.current.innerHTML = '';
      }
    };
  }, [latitude, longitude, address]);

  if (loading) {
    return (
      <div
        style={{ height: '400px', width: '100%' }}
        className="flex items-center justify-center bg-gray-100 rounded"
      >
        <p className="text-gray-600">Memuat peta...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ height: '400px', width: '100%' }}
        className="flex items-center justify-center bg-red-50 rounded border border-red-200"
      >
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

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
