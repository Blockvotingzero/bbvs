import { useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";

export default function LivenessCheck() {
  const [, setLocation] = useLocation();

  const handleVerification = useCallback(() => {
    setLocation("/vote");
  }, [setLocation]);

  return (
    <div className="container max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Liveness Check</CardTitle>
          <CardDescription>
            Please complete the facial verification process to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <Video className="h-12 w-12 text-muted-foreground" />
          </div>

          <Button 
            onClick={handleVerification}
            className="w-full"
          >
            Start Verification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
