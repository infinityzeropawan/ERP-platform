'use client';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { useModules } from '@/lib/ModuleContext';
import * as faceapi from '@vladmandic/face-api';
import { ScanFace, CheckCircle2, AlertTriangle, Loader2, MapPin } from 'lucide-react';

export default function FaceAttendancePage() {
  const { hasModule } = useModules();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [savedDescriptor, setSavedDescriptor] = useState<Float32Array | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [verifiedBadge, setVerifiedBadge] = useState<boolean>(false);
  
  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

  useEffect(() => {
    if (!hasModule('mod_face_attendance')) return;
    
    const init = async () => {
      try {
        // 1. Fetch user's registered descriptor
        const res = await fetch('/api/v1/face/descriptor');
        if (!res.ok) {
          if (res.status === 404) throw new Error('No face registered. Please register your face first.');
          throw new Error('Failed to load registered face data.');
        }
        const data = await res.json();
        setSavedDescriptor(new Float32Array(data.descriptor));

        // 2. Load Models
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);

        // 3. Get Location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => console.warn('Geolocation error:', err)
          );
        }

        // 4. Start Camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
        
        setLoading(false);
      } catch (err: any) {
        console.error('Init error:', err);
        setErrorMsg(err.message || 'Initialization failed.');
        setLoading(false);
      }
    };
    init();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [hasModule]);

  const handleCheckIn = async () => {
    if (!videoRef.current || !savedDescriptor) return;
    setVerifying(true);
    setErrorMsg('');

    try {
      // Get live face descriptor
      const detection = await faceapi.detectSingleFace(videoRef.current).withFaceLandmarks().withFaceDescriptor();
      if (!detection) {
        throw new Error('No face detected. Please look directly at the camera.');
      }

      // Calculate distance
      const distance = faceapi.euclideanDistance(detection.descriptor, savedDescriptor);
      const MATCH_THRESHOLD = 0.5; // Lower is stricter

      if (distance > MATCH_THRESHOLD) {
        throw new Error(`Face mismatch (Distance: ${distance.toFixed(2)}). Please try again or re-register.`);
      }

      const confidenceScore = Math.max(0, 100 - (distance * 100));

      // Post Attendance
      const attendRes = await fetch('/api/v1/face/attend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confidenceScore,
          latitude: location?.lat,
          longitude: location?.lng
        })
      });

      if (!attendRes.ok) {
        const errData = await attendRes.json();
        throw new Error(errData.message || 'Failed to submit attendance.');
      }

      const attendData = await attendRes.json();
      setVerifiedBadge(attendData.verified);
      setSuccess(true);
      
      // Stop camera
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      
    } catch (err: any) {
      console.error('Check-in error:', err);
      setErrorMsg(err.message || 'Check-in failed.');
    } finally {
      setVerifying(false);
    }
  };

  if (!hasModule('mod_face_attendance')) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Premium Feature</h2>
        <p className="text-gray-500 mt-2">Face Recognition Attendance is not enabled.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ScanFace className="h-6 w-6 text-blue-600" /> Daily Check-in
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Mark your attendance securely using face and location verification.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Attendance Terminal</CardTitle>
          <CardDescription>We will match your face and verify you are within the institution's premises.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          
          {success ? (
            <div className="flex flex-col items-center justify-center p-8 bg-green-50 rounded-xl border border-green-200 w-full">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-green-800">Attendance Marked!</h3>
              <p className="text-green-600 text-sm mt-2 text-center">Your attendance for today has been successfully recorded.</p>
              
              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200 shadow-sm">
                  <ScanFace className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">Face Matched</span>
                </div>
                {verifiedBadge ? (
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-green-200 shadow-sm">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-800">Location Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200 shadow-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">Location Not Verified</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {errorMsg ? (
                <div className="text-red-500 bg-red-50 p-4 rounded-lg flex items-center gap-2 text-sm w-full">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" /> 
                  <span className="flex-1">{errorMsg}</span>
                </div>
              ) : null}

              {loading ? (
                <div className="flex flex-col items-center justify-center p-12 w-full bg-gray-50 rounded-xl border border-gray-100">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
                  <p className="text-gray-600 font-medium">Initializing Terminal...</p>
                  <p className="text-gray-400 text-xs mt-2 text-center">Loading AI models, fetching your profile, and verifying location.</p>
                </div>
              ) : (
                <div className="relative w-full max-w-md mx-auto aspect-video bg-black rounded-xl overflow-hidden shadow-inner border border-gray-800 group">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                  
                  {/* Overlay scanning effect */}
                  <div className="absolute inset-0 border-2 border-blue-500/50 rounded-xl pointer-events-none group-hover:border-blue-400 transition-colors">
                    <div className="w-full h-1 bg-blue-400/50 blur-[2px] animate-[scan_2s_ease-in-out_infinite]" />
                  </div>
                  
                  {/* Location status badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    <MapPin className={`h-3 w-3 ${location ? 'text-green-400' : 'text-gray-400 animate-pulse'}`} />
                    <span className="text-[10px] font-medium text-white/90">
                      {location ? 'GPS Active' : 'Locating...'}
                    </span>
                  </div>
                </div>
              )}

              {!loading && (
                <Button 
                  onClick={handleCheckIn} 
                  disabled={verifying || !!errorMsg.includes('register')}
                  className="w-full max-w-md h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                >
                  {verifying ? (
                    <><Loader2 className="h-6 w-6 mr-2 animate-spin" /> Verifying Identity...</>
                  ) : (
                    <><ScanFace className="h-6 w-6 mr-2" /> Check In Now</>
                  )}
                </Button>
              )}
            </>
          )}

        </CardContent>
      </Card>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(220px); }
          100% { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
