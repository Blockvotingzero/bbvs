import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useCandidates, useVerifyUser, useSubmitVote } from "@/hooks/useApi";

export default function Vote() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: candidates = [] } = useCandidates();

  const [step, setStep] = useState<"verify" | "otp" | "vote" | "complete">("verify");
  const [formData, setFormData] = useState({
    nin: "",
    phoneNumber: "",
    otp: "",
    selectedCandidate: 0
  });

  const verifyMutation = useVerifyUser();
  const voteMutation = useSubmitVote();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nin || !formData.phoneNumber) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await verifyMutation.mutateAsync({ 
        nin: formData.nin, 
        phoneNumber: formData.phoneNumber 
      });
      setStep("otp");
      toast({
        title: "OTP Sent",
        description: "We've sent an OTP to your phone",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify user",
        variant: "destructive",
      });
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) {
      toast({
        title: "Error",
        description: "Please enter OTP",
        variant: "destructive",
      });
      return;
    }

    // In real implementation, verify OTP
    setStep("vote");
  };

  const handleVoteSubmit = async (candidateId: number) => {
    setFormData({
      ...formData,
      selectedCandidate: candidateId
    });

    try {
      await voteMutation.mutateAsync({
        nin: formData.nin,
        phoneNumber: formData.phoneNumber,
        candidateId,
        otp: formData.otp
      });

      setStep("complete");
      toast({
        title: "Success",
        description: "Your vote has been recorded on the blockchain",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit vote",
        variant: "destructive",
      });
    }
  };

  const handleViewResults = () => {
    setLocation("/results");
  };

  return (
    <div className="container max-w-lg mx-auto py-8">
      {step === "verify" && (
        <Card>
          <CardHeader>
            <CardTitle>Voter Verification</CardTitle>
            <CardDescription>
              Please enter your details to verify your identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label htmlFor="nin" className="block text-sm font-medium mb-1">
                  National ID Number
                </label>
                <Input
                  id="nin"
                  value={formData.nin}
                  onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                  placeholder="Enter your NIN"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
              <Button type="submit" className="w-full">
                Verify Identity
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === "otp" && (
        <Card>
          <CardHeader>
            <CardTitle>OTP Verification</CardTitle>
            <CardDescription>
              Enter the OTP sent to your phone
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium mb-1">
                  OTP Code
                </label>
                <Input
                  id="otp"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  placeholder="Enter 6-digit OTP"
                />
              </div>
              <Button type="submit" className="w-full">
                Verify OTP
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === "vote" && (
        <Card>
          <CardHeader>
            <CardTitle>Cast Your Vote</CardTitle>
            <CardDescription>
              Select a candidate to vote for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="border rounded-lg p-4 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => handleVoteSubmit(candidate.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden">
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {candidate.party}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {step === "complete" && (
        <Card>
          <CardHeader>
            <CardTitle>Vote Successfully Recorded</CardTitle>
            <CardDescription>
              Your vote has been securely recorded on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-lg">
                Thank you for participating in the democratic process
              </p>
            </div>
            <Button className="w-full" onClick={handleViewResults}>
              View Results
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}