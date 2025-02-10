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

const verifySchema = z.object({
  nin: z.string().min(10, "NIN must be at least 10 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters")
});

export default function Vote() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<"verify" | "otp" | "vote">("verify");
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [verificationData, setVerificationData] = useState<{
    nin: string;
    phoneNumber: string;
    otp?: string;
  } | null>(null);

  const { data: candidates } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"]
  });

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema)
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof verifySchema>) => {
      const res = await apiRequest("POST", "/api/verify", data);
      return res.json();
    },
    onSuccess: (data, variables) => {
      setVerificationData({ ...variables });
      setStep("otp");
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code."
      });
    }
  });

  const voteMutation = useMutation({
    mutationFn: async (data: { nin: string; phoneNumber: string; otp: string; candidateId: number }) => {
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

  const onOtpSubmit = (otp: string) => {
    if (!verificationData) return;
    setVerificationData({ ...verificationData, otp });
    setStep("vote");
  };

  const onVoteSubmit = () => {
    if (!verificationData?.otp || !selectedCandidate) return;
    voteMutation.mutate({
      nin: verificationData.nin,
      phoneNumber: verificationData.phoneNumber,
      otp: verificationData.otp,
      candidateId: selectedCandidate
    });
  };

  if (step === "verify") {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Voter Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onVerifySubmit)} className="space-y-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={verifyMutation.isPending}>
                  {verifyMutation.isPending ? "Verifying..." : "Verify"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Enter OTP</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Enter OTP"
              className="mb-4"
              onChange={(e) => onOtpSubmit(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Enter the verification code sent to your phone
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
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
                <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="w-16 h-16 rounded-full"
                />
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
        disabled={!selectedCandidate || voteMutation.isPending}
        onClick={onVoteSubmit}
      >
        {voteMutation.isPending ? "Submitting Vote..." : "Submit Vote"}
      </Button>
    </div>
  );
}
