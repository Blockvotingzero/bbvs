import React, { useState } from "react";
import { useLocation } from "wouter";
import { type Candidate } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, Loader2 } from "lucide-react";
import { mockCandidates } from "@/lib/mockData";

export default function Vote() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [voteHash, setVoteHash] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [votedCandidateName, setVotedCandidateName] = useState<string>("");
  const [isVoting, setIsVoting] = useState(false);

  // Check if user is authenticated
  React.useEffect(() => {
    const nin = localStorage.getItem('userNIN');
    if (!nin) {
      console.log('No NIN found, redirecting to login');
      setLocation('/login');
    }
  }, [setLocation]);

  // Mock vote submission
  const handleVoteSubmission = async () => {
    try {
      console.log('Starting vote submission for candidate:', selectedCandidate);

      if (!selectedCandidate) {
        throw new Error('No candidate selected');
      }

      setIsVoting(true);

      // Simulate blockchain processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate a mock transaction hash
      const hash = "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("")
        .slice(0, 42);

      console.log('Generated vote hash:', hash);

      const candidate = mockCandidates.find(c => c.id === selectedCandidate);
      if (!candidate) {
        throw new Error('Selected candidate not found in mock data');
      }

      setVoteHash(hash);
      setHasVoted(true);
      setShowConfirmDialog(false);
      setShowSuccessDialog(true);
      setVotedCandidateName(candidate.name);
      setSelectedCandidate(null);

      console.log('Vote successfully submitted');

      toast({
        title: "Vote Submitted",
        description: "Your vote has been recorded on the blockchain."
      });
    } catch (error) {
      console.error('Vote submission failed:', error);
      toast({
        title: "Error",
        description: "Failed to submit vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVoting(false);
    }
  };

  const onVoteSubmit = () => {
    console.log('Vote submission requested for candidate:', selectedCandidate);
    if (!selectedCandidate || hasVoted) return;
    setShowConfirmDialog(true);
  };

  const handleCopyHash = async () => {
    try {
      await navigator.clipboard.writeText(voteHash);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      console.log('Vote hash copied to clipboard');
    } catch (err) {
      console.error('Failed to copy hash:', err);
      toast({
        title: "Error",
        description: "Failed to copy hash to clipboard",
        variant: "destructive"
      });
    }
  };

  const selectedCandidateName = mockCandidates.find(c => c.id === selectedCandidate)?.name;

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8 p-4 sm:p-6 bg-card rounded-lg border shadow">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Voter Profile</h2>
            <p className="text-muted-foreground">NIN: {localStorage.getItem('userNIN')}</p>
          </div>
        </div>
      </div>

      {hasVoted && (
        <div className="mb-8 p-4 sm:p-6 bg-card rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Your Vote Details</h3>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row justify-between py-2 border-b">
              <span className="text-muted-foreground">Candidate</span>
              <span className="font-medium">{votedCandidateName}</span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between py-2 border-b">
              <span className="text-muted-foreground">Transaction Hash</span>
              <div className="flex items-center gap-2 overflow-hidden">
                <code className="font-mono text-sm overflow-hidden text-ellipsis">{voteHash.slice(0, 16)}...</code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyHash}
                  className="h-6 w-6"
                >
                  {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Timestamp</span>
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8">Select a Candidate</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCandidates?.map((candidate) => (
          <Card
            key={candidate.id}
            className={`cursor-pointer transition-colors ${
              selectedCandidate === candidate.id ? "border-primary" : ""
            } ${hasVoted ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => {
              if (!hasVoted) {
                console.log('Selected candidate:', candidate.id);
                setSelectedCandidate(candidate.id);
              }
            }}
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
        disabled={!selectedCandidate || isVoting || hasVoted}
        onClick={onVoteSubmit}
        variant={hasVoted ? "secondary" : "default"}
      >
        {isVoting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting Vote...
          </div>
        ) : hasVoted ? (
          "Vote Submitted"
        ) : (
          "Submit Vote"
        )}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm Your Vote
            </DialogTitle>
            <DialogDescription>
              {!isVoting ? (
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
            {!isVoting && (
              <>
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleVoteSubmission}>
                  Continue
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Vote Submitted Successfully!
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 mt-4 px-2 sm:px-4">
                <div className="p-4 sm:p-6 bg-muted rounded-lg">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">You voted for</div>
                      <div className="text-lg sm:text-xl font-semibold">{votedCandidateName}</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Your vote hash (click to copy)</div>
                      <div 
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-background rounded border cursor-pointer hover:bg-accent transition-colors gap-2"
                        onClick={handleCopyHash}
                      >
                        <code className="font-mono text-xs sm:text-sm break-all">{voteHash}</code>
                        <div className="flex items-center gap-2 text-muted-foreground shrink-0">
                          {isCopied ? (
                            <>
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-sm">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span className="text-sm">Copy hash</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="text-sm text-muted-foreground">Timestamp</div>
                      <div className="text-sm sm:text-base">{new Date().toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground text-center">
                  Please save this hash to track your vote on the blockchain
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}