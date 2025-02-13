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
          <div className="space-y-2">
            <div className="w-full h-6 bg-gray-200 rounded-sm overflow-hidden">
              {(() => {
                const totalVotes = votes.length;
                const apcVotes = (votes.filter(v => v.candidateId === 1).length / totalVotes) * 100;
                const lpVotes = (votes.filter(v => v.candidateId === 2).length / totalVotes) * 100;
                const pdpVotes = (votes.filter(v => v.candidateId === 3).length / totalVotes) * 100;

                return (
                  <>
                    <div className="flex h-full relative">
                      <div style={{ width: `${apcVotes}%` }} className="bg-red-500">
                        <span className="absolute text-xs text-white left-1 top-1/2 -translate-y-1/2">APC</span>
                      </div>
                      <div style={{ width: `${lpVotes}%` }} className="bg-blue-500">
                        <span className="absolute text-xs text-white left-[calc(33%+8px)] top-1/2 -translate-y-1/2">LP</span>
                      </div>
                      <div style={{ width: `${pdpVotes}%` }} className="bg-green-500">
                        <span className="absolute text-xs text-white left-[calc(66%+8px)] top-1/2 -translate-y-1/2">PDP</span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 mr-1"></div>
                <span>APC</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 mr-1"></div>
                <span>LP</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 mr-1"></div>
                <span>PDP</span>
              </div>
            </div>
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