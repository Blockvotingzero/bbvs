
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { getCandidates } from "@/lib/mockBlockchainData";

export default function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const { toast } = useToast();

  const COLORS = ['#FF8042', '#00C49F', '#0088FE'];

  useEffect(() => {
    // Check if user has already voted (could be from localStorage or blockchain)
    const alreadyVoted = localStorage.getItem("hasVoted") === "true";
    setHasVoted(alreadyVoted);

    // Simulate blockchain data fetch
    setTimeout(() => {
      setCandidates(getCandidates());
      setIsLoading(false);
    }, 800);
  }, []);

  const onVoteSubmit = () => {
    if (!selectedCandidate) return;

    setIsVoting(true);

    // Simulate blockchain transaction
    setTimeout(() => {
      // Save vote to localStorage for this demo
      localStorage.setItem("hasVoted", "true");
      localStorage.setItem("votedFor", selectedCandidate.toString());

      setHasVoted(true);
      setIsVoting(false);
      
      toast({
        title: "Vote Cast Successfully",
        description: "Your vote has been recorded on the blockchain.",
      });
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Cast Your Vote</h1>
        <p className="text-muted-foreground">Select a candidate to vote for in the current election</p>
      </div>

      {hasVoted ? (
        <Card>
          <CardHeader>
            <CardTitle>You Have Already Voted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Your vote has been recorded on the blockchain. Thank you for participating in the democratic process.
            </p>
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm font-mono mb-2">Transaction recorded successfully</p>
              <p className="text-xs text-muted-foreground">
                Transaction Hash: 0x{Math.random().toString(16).substring(2, 10)}...{Math.random().toString(16).substring(2, 10)}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Current Voting Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidates.map((candidate, index) => (
                  <div key={candidate.id}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{candidate.name} ({candidate.party})</span>
                      <span className="text-sm">{candidate.votes.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(candidate.votes / candidates.reduce((sum, c) => sum + c.votes, 0)) * 100}
                      className="h-2"
                      style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                      indicator={{ style: { backgroundColor: COLORS[index] } }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Your Candidate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {candidates.map((candidate) => (
                  <div 
                    key={candidate.id}
                    className={`p-4 border rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                      selectedCandidate === candidate.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedCandidate(candidate.id)}
                  >
                    <div className="w-4 h-4 rounded-full border flex items-center justify-center">
                      {selectedCandidate === candidate.id && (
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{candidate.name}</div>
                      <div className="text-sm text-muted-foreground">{candidate.party}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                className="w-full mt-6"
                size="lg"
                disabled={!selectedCandidate || isVoting}
                onClick={onVoteSubmit}
              >
                {isVoting ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Recording Vote on Blockchain...
                  </>
                ) : (
                  "Cast Your Vote"
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
