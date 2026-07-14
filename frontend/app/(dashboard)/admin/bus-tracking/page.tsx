'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useModules } from '@/lib/ModuleContext';
import { AlertTriangle, Navigation } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import map to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

// Leaflet icon fix for Next.js
const customIcon = typeof window !== 'undefined' ? new (window as any).L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}) : null;

type BusLocation = {
  id: string;
  driver: { name: string; phone: string | null };
  latitude: number;
  longitude: number;
  speed: number | null;
  timestamp: string;
};

export default function AdminBusTrackingPage() {
  const { hasModule } = useModules();
  const [locations, setLocations] = useState<BusLocation[]>([]);

  useEffect(() => {
    if (!hasModule('mod_bus_tracking')) return;
    
    const fetchLocations = async () => {
      try {
        const res = await fetch('/api/v1/bus/locations');
        if (res.ok) {
          const data = await res.json();
          setLocations(data);
        }
      } catch (err) {
        console.error('Failed to fetch bus locations', err);
      }
    };

    fetchLocations();
    const interval = setInterval(fetchLocations, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [hasModule]);

  if (!hasModule('mod_bus_tracking')) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Premium Feature</h2>
        <p className="text-gray-500 mt-2">Bus GPS Tracking is not enabled.</p>
      </div>
    );
  }

  // Default center: roughly center of India if no buses, else center on first bus
  const center = locations.length > 0 
    ? [locations[0].latitude, locations[0].longitude] as [number, number]
    : [20.5937, 78.9629] as [number, number];
  
  const zoom = locations.length > 0 ? 13 : 5;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Navigation className="h-6 w-6 text-amber-600" /> Live Bus Tracking
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Real-time GPS locations of active institution transport buses.</p>
      </div>

      <Card className="h-[70vh] flex flex-col">
        <CardHeader className="py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Fleet Map</CardTitle>
              <CardDescription>Auto-updates every 15 seconds. Active buses: {locations.length}</CardDescription>
            </div>
            {locations.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-green-700">Live</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative bg-gray-100 z-0">
          
          {typeof window !== 'undefined' && customIcon && (
            <MapContainer 
              center={center} 
              zoom={zoom} 
              style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {locations.map((loc) => (
                <Marker 
                  key={loc.id} 
                  position={[loc.latitude, loc.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="font-semibold text-gray-900">{loc.driver.name}</div>
                    <div className="text-xs text-gray-500 mt-1">Bus Route Active</div>
                    {loc.driver.phone && (
                      <div className="text-xs mt-1">📞 {loc.driver.phone}</div>
                    )}
                    <div className="text-xs mt-2 pt-2 border-t font-mono">
                      Speed: {loc.speed !== null ? \`\${Math.round(loc.speed * 3.6)} km/h\` : 'N/A'}<br/>
                      Last seen: {new Date(loc.timestamp).toLocaleTimeString()}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
