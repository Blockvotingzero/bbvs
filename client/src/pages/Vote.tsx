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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Copy, Loader2 } from "lucide-react";

export default function Vote() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [voteHash, setVoteHash] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  const { data: candidates } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"]
  });

  const voteMutation = useMutation({
    mutationFn: async (data: { candidateId: number }) => {
      // Simulate blockchain processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      const res = await apiRequest("POST", "/api/vote", data);
      return res.json();
    },
    onSuccess: (data) => {
      // Generate a random Ethereum-style hash
      const hash = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")
        .slice(0, 42);
      setVoteHash(hash);
      setHasVoted(true);
      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded on the blockchain."
      });
      setShowConfirmDialog(false);
    }
  });

  const onVoteSubmit = () => {
    if (!selectedCandidate || hasVoted) return;
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    if (selectedCandidate) {
      voteMutation.mutate({ candidateId: selectedCandidate });
    }
  };

  const handleCopyHash = async () => {
    await navigator.clipboard.writeText(voteHash);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const selectedCandidateName = candidates?.find(c => c.id === selectedCandidate)?.name;

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
            } ${hasVoted ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !hasVoted && setSelectedCandidate(candidate.id)}
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
        {voteMutation.isPending ? "Submitting Vote..." : hasVoted ? "Vote Submitted" : "Submit Vote"}
      </Button>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm Your Vote
            </DialogTitle>
            <DialogDescription>
              {!voteMutation.isPending ? (
                <p>Are you sure you want to vote for {selectedCandidateName}? This action cannot be undone.</p>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2">Processing your vote on the blockchain...</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {!voteMutation.isPending && (
              <>
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirm}>
                  Continue
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {hasVoted && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">Vote Confirmation</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">Candidate: {selectedCandidateName}</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="font-mono text-sm truncate">{voteHash}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyHash}
                    className="h-8 w-8"
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Voted on {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}