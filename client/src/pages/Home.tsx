import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { type Vote, type Candidate } from "@shared/schema";
import NigeriaMap from "@/components/NigeriaMap";

// Mock state data
const mockStateData = {
  Lagos: {
    name: "Lagos",
    votes: {
      "Bola Ahmed Tinubu": 45,
      "Peter Obi": 35,
      "Atiku Abubakar": 20
    }
  },
  // Add more states here
};

export default function Home() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Live Voting Statistics</h1>
          <p className="text-muted-foreground">
            {selectedState ? `Viewing results for ${selectedState}` : 'National results'}
          </p>
        </div>
        {selectedState && (
          <Button
            variant="outline"
            onClick={() => setSelectedState(null)}
          >
            View National Results
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Map</CardTitle>
        </CardHeader>
        <CardContent>
          <NigeriaMap
            stateData={mockStateData}
            onStateClick={setSelectedState}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vote Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={selectedState ? 
                Object.entries(mockStateData[selectedState]?.votes || {}).map(([name, votes]) => ({ name, votes }))
                : votesByCandidate
              }>
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
        {candidates.map(candidate => {
          const candidateVotes = votes.filter(vote => vote.candidateId === candidate.id).length;
          const percentage = ((candidateVotes / votes.length) * 100).toFixed(1);

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