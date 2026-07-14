'use client';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { useModules } from '@/lib/ModuleContext';
import { MapPin, Navigation, StopCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function BusTrackingPage() {
  const { hasModule } = useModules();
  const { user } = useAuth();
  
  const [sharing, setSharing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [location, setLocation] = useState<{lat: number, lng: number, accuracy: number, speed: number | null} | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => stopSharing();
  }, []);

  const startSharing = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }
    setErrorMsg('');
    setSharing(true);

    let lastPostTime = 0;

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude, accuracy, speed, heading } = pos.coords;
        setLocation({ lat: latitude, lng: longitude, accuracy, speed });

        // Throttle posts to once every 15 seconds max
        const now = Date.now();
        if (now - lastPostTime < 15000) return;
        lastPostTime = now;

        try {
          await fetch('/api/v1/bus/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude,
              longitude,
              accuracy,
              speed,
              heading
            })
          });
        } catch (err) {
          console.error('Failed to post location:', err);
        }
      },
      (err) => {
        console.error('Geolocation watch error:', err);
        setErrorMsg(`Location error: ${err.message}`);
        setSharing(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000
      }
    );
  };

  const stopSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setSharing(false);
    setLocation(null);
  };

  if (!hasModule('mod_bus_tracking')) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Premium Feature</h2>
        <p className="text-gray-500 mt-2">Bus GPS Tracking is not enabled.</p>
      </div>
    );
  }

  // Assuming only staff with a bus assignment should use this, but we'll show it to any teacher/staff for demo
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Navigation className="h-6 w-6 text-amber-600" /> Driver Tracking
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Share your live location while driving the institution bus.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Live GPS Broadcast</CardTitle>
          <CardDescription>Keep the institution admin informed of the bus location.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          
          {errorMsg && (
            <div className="text-red-500 bg-red-50 p-4 rounded-lg flex items-center gap-2 text-sm w-full">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" /> 
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="relative w-48 h-48 rounded-full flex items-center justify-center bg-gray-50 border-8 border-gray-100 shadow-inner">
            {sharing ? (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-amber-500 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75" />
                <Navigation className="h-16 w-16 text-amber-500 animate-pulse" />
              </>
            ) : (
              <MapPin className="h-16 w-16 text-gray-300" />
            )}
          </div>

          <div className="text-center">
            <h3 className={`text-xl font-bold ${sharing ? 'text-amber-600' : 'text-gray-900'}`}>
              {sharing ? 'Broadcasting Location' : 'Tracker Offline'}
            </h3>
            {sharing && location ? (
              <p className="text-sm text-gray-500 mt-2 font-mono">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                <br/>
                Accuracy: ±{Math.round(location.accuracy)}m
                {location.speed !== null && ` • Speed: ${Math.round(location.speed * 3.6)} km/h`}
              </p>
            ) : (
              <p className="text-sm text-gray-500 mt-2">Click below when you start your route.</p>
            )}
          </div>

          {sharing ? (
            <Button 
              onClick={stopSharing} 
              variant="destructive"
              className="w-full h-14 text-lg font-bold"
            >
              <StopCircle className="h-6 w-6 mr-2" /> Stop Sharing
            </Button>
          ) : (
            <Button 
              onClick={startSharing} 
              className="w-full h-14 text-lg font-bold bg-amber-600 hover:bg-amber-700"
            >
              <Navigation className="h-6 w-6 mr-2" /> Start Driving
            </Button>
          )}

        </CardContent>
      </Card>
      
      <p className="text-xs text-gray-400 text-center px-4">
        Ensure you keep this page open and allow location access. GPS data is only recorded while sharing is active.
      </p>
    </div>
  );
}
