import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { type Vote, type Candidate } from "@shared/schema";
import NigeriaMap from "@/components/NigeriaMap"; // Import NigeriaMap component

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

  const votesByCandidate = candidates.map(candidate => ({
    name: candidate.name,
    votes: votes.filter(vote => vote.candidateId === candidate.id).length
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Live Voting Statistics</h1>
        <p className="text-muted-foreground">Real-time overview of the current election results</p>
        <NigeriaMap /> {/* Add NigeriaMap component here */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vote Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={votesByCandidate}>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map(candidate => {
          const candidateVotes = votes.filter(vote => vote.candidateId === candidate.id).length;
          const percentage = ((candidateVotes / votes.length) * 100).toFixed(1);

          return (
            <Card key={candidate.id}>
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
                <div className="mt-4">
                  <p className="text-2xl font-bold">{candidateVotes} votes</p>
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