
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
        title: "Vote submitted successfully!",
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
        <p className="text-muted-foreground">Your vote is secure and anonymous on the blockchain</p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {candidates.map((candidate, index) => (
                  <Card 
                    key={candidate.id}
                    className={`cursor-pointer transition-all duration-200 ${selectedCandidate === candidate.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedCandidate(candidate.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: COLORS[index] }}
                        >
                          {candidate.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground">{candidate.party}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button 
                onClick={onVoteSubmit} 
                disabled={!selectedCandidate || isVoting} 
                className="w-full"
              >
                {isVoting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Recording on Blockchain...
                  </>
                ) : (
                  "Confirm & Submit Vote"
                )}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
