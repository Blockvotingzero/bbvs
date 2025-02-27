
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useCandidates, useVotes } from "@/hooks/useApi";
import type { Vote } from "../mockData";

export default function Results() {
  const { data: candidates = [] } = useCandidates();
  const { data: votes = [] } = useVotes();

  const totalVotes = votes.length;
  
  // Calculate vote counts per candidate
  const voteCounts = candidates.map(candidate => {
    const count = votes.filter((vote: Vote) => vote.candidateId === candidate.id).length;
    const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
    return {
      ...candidate,
      votes: count,
      percentage: percentage.toFixed(2)
    };
  }).sort((a, b) => b.votes - a.votes);

  // Get the latest 5 votes
  const latestVotes = [...votes]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Election Results</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Results</CardTitle>
            <CardDescription>
              Live results from the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {voteCounts.map(candidate => (
                <div key={candidate.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full overflow-hidden">
                        <img
                          src={candidate.avatar}
                          alt={candidate.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span>{candidate.name}</span>
                    </div>
                    <span className="font-medium">{candidate.votes} votes ({candidate.percentage}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${candidate.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Votes</CardTitle>
            <CardDescription>
              Most recent votes recorded on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestVotes.map(vote => {
                const candidate = candidates.find(c => c.id === vote.candidateId);
                return (
                  <div key={vote.id} className="border-b pb-3 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-6 w-6 rounded-full overflow-hidden">
                        <img
                          src={candidate?.avatar}
                          alt={candidate?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{candidate?.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Voter: {vote.voterHash.substring(0, 8)}...{vote.voterHash.substring(vote.voterHash.length - 6)}</p>
                      <p>Time: {new Date(vote.timestamp).toLocaleString()}</p>
                      <p>Block: {vote.blockHeight}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
