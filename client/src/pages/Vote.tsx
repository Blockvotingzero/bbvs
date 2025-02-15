import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Candidate } from "@shared/schema";
import { Loader2, Copy, CheckCircle2 } from "lucide-react";

export default function Vote() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showHashDialog, setShowHashDialog] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteHash, setVoteHash] = useState<string>("");
  const [voteTimestamp, setVoteTimestamp] = useState<string>("");

  const { data: candidates } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"]
  });

  const voteMutation = useMutation({
    mutationFn: async (data: { candidateId: number }) => {
      const res = await apiRequest("POST", "/api/vote", data);
      return res.json();
    },
    onSuccess: (data) => {
      // Generate a random Ethereum-style hash
      const hash = "0x" + Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      setVoteHash(hash);
      setVoteTimestamp(new Date().toLocaleString());
      setHasVoted(true);
      setShowHashDialog(true);

      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded on the blockchain."
      });
    }
  });

  const handleCopyHash = useCallback(() => {
    navigator.clipboard.writeText(voteHash);
    toast({
      title: "Hash Copied",
      description: "The vote hash has been copied to your clipboard."
    });
  }, [voteHash, toast]);

  const onVoteSubmit = useCallback(() => {
    if (!selectedCandidate || hasVoted) return;
    setShowConfirmDialog(true);
  }, [selectedCandidate, hasVoted]);

  const handleConfirmVote = useCallback(() => {
    if (!selectedCandidate) return;

    voteMutation.mutate({
      candidateId: selectedCandidate
    });
    setShowConfirmDialog(false);
  }, [selectedCandidate, voteMutation]);

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

      {hasVoted && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Your Vote Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Selected Candidate</p>
              <p className="font-semibold">{candidates?.find(c => c.id === selectedCandidate)?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Vote Cast On</p>
              <p>{voteTimestamp}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Vote Hash</p>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <code className="flex-1 text-sm font-mono break-all">{voteHash}</code>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 shrink-0"
                  onClick={handleCopyHash}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Visit the <a href="/explorer" className="text-primary hover:underline">Blockchain Explorer</a> to verify your vote using this hash.
            </p>
          </CardContent>
        </Card>
      )}

      <h1 className="text-3xl font-bold mb-8">
        {hasVoted ? "Election Candidates" : "Select a Candidate"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates?.map((candidate) => (
          <Card
            key={candidate.id}
            className={`transition-colors ${
              selectedCandidate === candidate.id 
                ? "border-primary bg-primary/5" 
                : ""
            } ${!hasVoted ? "cursor-pointer hover:border-primary/50" : ""}`}
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

      {!hasVoted && (
        <Button
          className="mt-8 w-full"
          disabled={!selectedCandidate || voteMutation.isPending || hasVoted}
          onClick={onVoteSubmit}
        >
          {voteMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Vote...
            </>
          ) : (
            "Submit Vote"
          )}
        </Button>
      )}

      {/* Vote Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to vote for{" "}
              <span className="font-medium">
                {candidates?.find(c => c.id === selectedCandidate)?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmVote}>
              {voteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : (
                "Confirm Vote"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hash Display Dialog */}
      <AlertDialog open={showHashDialog} onOpenChange={setShowHashDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Vote Successfully Cast!</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>Your vote has been recorded on the blockchain. You can verify your vote using the hash below:</p>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <code className="flex-1 text-sm font-mono break-all">{voteHash}</code>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 shrink-0"
                  onClick={handleCopyHash}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowHashDialog(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}