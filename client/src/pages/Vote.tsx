import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Candidate } from "@shared/schema";
import { Check, Copy, ExternalLink } from "lucide-react";

export default function Vote() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [voteHash, setVoteHash] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);

  const { data: candidates } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"]
  });

  const voteMutation = useMutation({
    mutationFn: async (data: { candidateId: number }) => {
      const res = await apiRequest("POST", "/api/vote", data);
      return res.json();
    },
    onSuccess: (data) => {
      // Generate an Ethereum-style hash (for demo purposes)
      const hash = '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      setVoteHash(hash);
      setHasVoted(true);
      toast({
        title: "Vote Recorded",
        description: "Your vote has been recorded on the blockchain."
      });
    }
  });

  const handleCopyHash = useCallback(async () => {
    if (!voteHash) return;
    try {
      setCopying(true);
      await navigator.clipboard.writeText(voteHash);
      toast({
        title: "Hash Copied",
        description: "Vote hash has been copied to clipboard"
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy hash to clipboard",
        variant: "destructive"
      });
    } finally {
      setCopying(false);
    }
  }, [voteHash, toast]);

  const onVoteSubmit = () => {
    if (!selectedCandidate || hasVoted) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmVote = () => {
    voteMutation.mutate({
      candidateId: selectedCandidate!
    });
    setShowConfirmDialog(false);
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

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>
              Are you sure you want to vote for {candidates?.find(c => c.id === selectedCandidate)?.name}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmVote}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={hasVoted && !!voteHash}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vote Recorded Successfully!</DialogTitle>
            <DialogDescription>
              Your vote has been recorded on the blockchain. You can verify your vote using the hash below:
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 my-4">
            <Input value={voteHash} readOnly className="font-mono text-sm" />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyHash}
              className="shrink-0"
            >
              {copying ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            You can verify your vote on the{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => setLocation("/explorer")}
            >
              Blockchain Explorer
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}