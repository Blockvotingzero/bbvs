import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { type Vote, type Candidate } from "@shared/schema";

export default function Home() {
  const { data: votes, isLoading: votesLoading } = useQuery<Vote[]>({
    queryKey: ["/api/votes"]
  });

  const { data: candidates, isLoading: candidatesLoading } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"]
  });

  if (votesLoading || candidatesLoading) {
    return <div className="space-y-4">
      <Skeleton className="h-[400px] w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
      </div>
    </div>;
  }

  if (!votes || !candidates) return null;

  const candidateVoteCounts = candidates.map(candidate => ({
    ...candidate,
    voteCount: votes.filter(vote => vote.candidateId === candidate.id).length
  })).sort((a, b) => b.voteCount - a.voteCount); // Sort by vote count

  const chartData = candidateVoteCounts.map(({ name, voteCount }) => ({
    name,
    votes: voteCount
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Live Voting Statistics</h1>
        <p className="text-muted-foreground">Real-time overview of the current election results</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vote Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votes" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {candidateVoteCounts.map(candidate => {
          const percentage = ((candidate.voteCount / votes.length) * 100).toFixed(1);

          return (
            <Card key={candidate.id}>
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
                <div className="mt-4">
                  <p className="text-2xl font-bold">{candidate.voteCount} votes</p>
                  <p className="text-sm text-muted-foreground">{percentage}% of total votes</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}