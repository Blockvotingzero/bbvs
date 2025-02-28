import { useCallback, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Video, Camera, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function LivenessCheck() {
  const [, setLocation] = useLocation();
  const { setLivenessVerified, isAuthenticated } = useAuth();
  const [captured, setCaptured] = useState(false);

  const handleCapture = useCallback(() => {
    setCaptured(true);
  }, []);

  const handleVerification = useCallback(() => {
    // In a real implementation, we would verify the captured image
    setLivenessVerified(true);
    setLocation("/vote");
  }, [setLocation, setLivenessVerified]);

  if (!isAuthenticated) {
    return null; // Protected route will handle redirect
  }

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Liveness Check</CardTitle>
          <CardDescription>
            Please complete the facial verification process to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative">
            {captured ? (
              <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
            ) : (
              <Video className="h-12 w-12 text-muted-foreground" />
            )}
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleCapture}
              className="flex-1 gap-2"
              disabled={captured}
            >
              <Camera className="h-4 w-4" />
              Capture
            </Button>
            <Button 
              onClick={handleVerification}
              className="flex-1"
              disabled={!captured}
            >
              Verify
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}