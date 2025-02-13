import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

export default function FacialVerification() {
  const [, setLocation] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureSuccess, setCaptureSuccess] = useState(false);

  useEffect(() => {
    if (isCapturing) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Error accessing camera:", err);
          setIsCapturing(false);
        });
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    }
  }, [isCapturing]);

  const handleCapture = () => {
    // Simulate verification success
    setIsCapturing(false);
    setCaptureSuccess(true);
    setTimeout(() => {
      setLocation("/vote");
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Facial Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isCapturing && !captureSuccess ? (
            <div className="text-center">
              <Button 
                onClick={() => setIsCapturing(true)}
                className="w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </Button>
            </div>
          ) : captureSuccess ? (
            <div className="text-center text-green-600">
              <p>Verification successful!</p>
              <p className="text-sm">Redirecting to voting page...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCapturing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCapture}
                  className="flex-1"
                >
                  Capture
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
