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

export default function Vote() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const { data: candidates } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"]
  });

  const voteMutation = useMutation({
    mutationFn: async (data: { candidateId: number }) => {
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

  const onVoteSubmit = () => {
    if (!selectedCandidate || hasVoted) return;

    const selectedCandidateName = candidates?.find(c => c.id === selectedCandidate)?.name;

    if (window.confirm(`Are you sure you want to vote for ${selectedCandidateName}? This action cannot be undone.`)) {
      voteMutation.mutate({
        candidateId: selectedCandidate
      }, {
        onSuccess: () => {
          setHasVoted(true);
        }
      });
    }
  };

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
            <h2 className="text-2xl font-semibold">Abubakar</h2>
            <p className="text-muted-foreground">Date of Birth: 4th November 2000</p>
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