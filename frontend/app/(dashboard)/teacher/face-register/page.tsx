'use client';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { useModules } from '@/lib/ModuleContext';
import * as faceapi from '@vladmandic/face-api';
import { ScanFace, CheckCircle2, AlertTriangle, Camera, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FaceRegisterPage() {
  const { hasModule } = useModules();
  const { user } = useAuth();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [loadingModels, setLoadingModels] = useState(true);
  const [modelError, setModelError] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

  useEffect(() => {
    if (!hasModule('mod_face_attendance')) return;
    
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        setLoadingModels(false);
        startCamera();
      } catch (err: any) {
        console.error('Error loading models', err);
        setModelError('Failed to load face recognition models. Please check your internet connection.');
        setLoadingModels(false);
      }
    };
    loadModels();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [hasModule]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError('Unable to access camera. Please allow camera permissions.');
    }
  };

  const handleRegister = async () => {
    if (!videoRef.current || !user) return;
    setRegistering(true);
    setCameraError('');

    try {
      const detection = await faceapi.detectSingleFace(videoRef.current).withFaceLandmarks().withFaceDescriptor();
      if (!detection) {
        setCameraError('No face detected. Please ensure your face is clearly visible and well-lit.');
        setRegistering(false);
        return;
      }

      // We have the 128-float descriptor
      const descriptorArray = Array.from(detection.descriptor);

      const res = await fetch('/api/v1/face/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descriptor: descriptorArray })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to register face on server');
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      setCameraError(err.message || 'An error occurred during registration.');
    } finally {
      setRegistering(false);
    }
  };

  if (!hasModule('mod_face_attendance')) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Premium Feature</h2>
        <p className="text-gray-500 mt-2">Face Recognition Attendance is not enabled for your institution.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ScanFace className="h-6 w-6 text-purple-600" /> Face Registration
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">Register your face to enable quick AI attendance check-ins.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Register Your Face Identity</CardTitle>
          <CardDescription>Position your face clearly in the camera view. Make sure you are in a well-lit area.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          
          {success ? (
            <div className="flex flex-col items-center justify-center p-8 bg-green-50 rounded-xl border border-green-200 w-full">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-green-800">Face Registered Successfully</h3>
              <p className="text-green-600 text-sm mt-2 mb-6 text-center">Your face descriptor has been securely saved. You can now mark your attendance using face recognition.</p>
              <Button onClick={() => router.push('/teacher/face-attendance')} className="bg-green-600 hover:bg-green-700">
                Go to Attendance Check-in
              </Button>
            </div>
          ) : (
            <>
              {modelError ? (
                <div className="text-red-500 bg-red-50 p-4 rounded-lg flex items-center gap-2 text-sm w-full">
                  <AlertTriangle className="h-5 w-5" /> {modelError}
                </div>
              ) : loadingModels ? (
                <div className="flex flex-col items-center justify-center p-12 w-full bg-gray-50 rounded-xl border border-gray-100">
                  <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-4" />
                  <p className="text-gray-600 font-medium">Loading AI Models...</p>
                  <p className="text-gray-400 text-xs mt-2">This may take a few moments on the first load.</p>
                </div>
              ) : (
                <div className="relative w-full max-w-md mx-auto aspect-video bg-black rounded-xl overflow-hidden shadow-inner border border-gray-800">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                  
                  {cameraError && (
                    <div className="absolute bottom-4 left-4 right-4 bg-red-500/90 text-white text-xs p-3 rounded-lg backdrop-blur-sm border border-red-400">
                      {cameraError}
                    </div>
                  )}
                </div>
              )}

              {!loadingModels && !modelError && (
                <Button 
                  onClick={handleRegister} 
                  disabled={registering}
                  className="w-full max-w-md h-12 text-base font-semibold bg-purple-600 hover:bg-purple-700"
                >
                  {registering ? (
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Analyzing Face...</>
                  ) : (
                    <><Camera className="h-5 w-5 mr-2" /> Capture & Register</>
                  )}
                </Button>
              )}
            </>
          )}

        </CardContent>
      </Card>
      
      <div className="text-xs text-gray-400 text-center flex items-center justify-center gap-2">
        <ScanFace className="h-4 w-4" />
        We only store a secure mathematical descriptor of your face, not your actual photo.
      </div>
    </div>
  );
}
