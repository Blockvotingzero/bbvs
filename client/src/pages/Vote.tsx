import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Candidate } from "@shared/schema";
import { Camera } from "lucide-react";

const verifySchema = z.object({
  nin: z.string().min(10, "NIN must be at least 10 characters"),
  phoneNumber: z.string().optional(),
});

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers")
});

export default function Vote() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<"verify" | "otp" | "vote">("verify");
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [verificationData, setVerificationData] = useState<{
    nin: string;
    phoneNumber?: string;
    otp?: string;
  } | null>(null);

  const { data: candidates } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"]
  });

  const verifyForm = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      nin: "",
      phoneNumber: ""
    }
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ""
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof verifySchema>) => {
      const res = await apiRequest("POST", "/api/verify", data);
      return res.json();
    },
    onSuccess: (data, variables) => {
      setVerificationData({ ...variables });
      if (variables.phoneNumber) {
        setStep("otp");
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code."
        });
      } else {
        setStep("vote");
      }
    }
  });

  const voteMutation = useMutation({
    mutationFn: async (data: { nin: string; phoneNumber?: string; otp?: string; candidateId: number }) => {
      const res = await apiRequest("POST", "/api/vote", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded on the blockchain."
      });
      setLocation("/");
    }
  });

  const onVerifySubmit = (data: z.infer<typeof verifySchema>) => {
    verifyMutation.mutate(data);
  };

  const onOtpSubmit = (data: z.infer<typeof otpSchema>) => {
    if (!verificationData) return;

    // Check for correct OTP (123456)
    if (data.otp === "123456") {
      setVerificationData({ ...verificationData, otp: data.otp });
      setStep("vote");
      toast({
        title: "Verification successful",
        description: "You can now proceed to vote"
      });
      return;
    }

    // Handle incorrect OTP
    const newAttempts = otpAttempts + 1;
    setOtpAttempts(newAttempts);

    if (newAttempts >= 3) {
      toast({
        title: "Too many failed attempts",
        description: "Redirecting to facial verification...",
        variant: "destructive"
      });
      setTimeout(() => setLocation("/facial-verification"), 2000);
    } else {
      toast({
        title: "Invalid OTP",
        description: `Incorrect code, please try again. ${3 - newAttempts} ${newAttempts === 2 ? 'attempt' : 'attempts'} remaining.`,
        variant: "destructive"
      });
      otpForm.reset();
    }
  };

  const resendOtp = () => {
    if (!verificationData?.phoneNumber) return;
    verifyMutation.mutate({
      nin: verificationData.nin,
      phoneNumber: verificationData.phoneNumber
    });
  };

  const [hasVoted, setHasVoted] = useState(false);

  const onVoteSubmit = () => {
    if (!selectedCandidate || hasVoted) return;

    const selectedCandidateName = candidates?.find(c => c.id === selectedCandidate)?.name;

    if (window.confirm(`Are you sure you want to vote for ${selectedCandidateName}? This action cannot be undone.`)) {
      voteMutation.mutate({
        nin: verificationData!.nin,
        phoneNumber: verificationData?.phoneNumber,
        otp: verificationData?.otp,
        candidateId: selectedCandidate
      }, {
        onSuccess: () => {
          setHasVoted(true);
        }
      });
    }
  };

  if (step === "verify") {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Voter Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...verifyForm}>
              <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-4">
                <FormField
                  control={verifyForm.control}
                  name="nin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>National Identification Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={verifyForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={verifyMutation.isPending}>
                    {verifyMutation.isPending ? "Verifying..." : "Verify with Phone"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setLocation("/facial-verification")}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Verify with Face
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Enter OTP</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          value={field.value}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                            field.onChange(value);
                          }}
                          maxLength={6}
                          type="text"
                          placeholder="Enter 6-digit code"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={otpForm.formState.isSubmitting}
                >
                  Verify OTP
                </Button>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Enter the verification code sent to your phone
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm"
                    onClick={resendOtp}
                    disabled={verifyMutation.isPending}
                    type="button"
                  >
                    {verifyMutation.isPending ? "Sending..." : "Didn't get the code? Resend"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 p-6 bg-card rounded-lg border shadow">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Voter</h2>
            <p className="text-muted-foreground">NIN: {verificationData?.nin}</p>
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-8">Select a Candidate</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates?.map((candidate) => (
          <Card
            key={candidate.id}
            className={`cursor-pointer transition-colors ${
              selectedCandidate === candidate.id ? "border-primary" : ""
            }`}
            onClick={() => setSelectedCandidate(candidate.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">{candidate.name}</h3>
                  <p className="text-sm text-muted-foreground">{candidate.party}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        className="mt-8 w-full"
        disabled={!selectedCandidate || voteMutation.isPending || hasVoted}
        onClick={onVoteSubmit}
      >
        {voteMutation.isPending ? "Submitting Vote..." : "Submit Vote"}
      </Button>
      {hasVoted && (
        <p className="mt-4 text-center text-green-600 font-medium">
          Your vote has been successfully cast. Thank you for participating!
        </p>
      )}
    </div>
  );
}