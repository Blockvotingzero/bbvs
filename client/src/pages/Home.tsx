import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import NigeriaMap from "@/components/NigeriaMap";
import { mockCandidates, mockVotes } from "@/lib/mockData";
import type { Vote, Candidate } from "@/types/schema";

export default function Home() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setVotes(mockVotes);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate vote distribution
  const voteDistribution = mockCandidates.map(candidate => {
    const candidateVotes = votes.filter(vote => vote.candidateId === candidate.id).length;
    return {
      name: candidate.name,
      value: candidateVotes,
      party: candidate.party
    };
  });

  const COLORS = ['#FF8042', '#00C49F', '#0088FE'];
  const totalVotes = votes.length;
  const formattedTotalVotes = totalVotes.toLocaleString();

  const renderPercentage = (value: number) => {
    return `${((value / totalVotes) * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Live Voting Statistics</h1>
        <p className="text-muted-foreground">Real-time overview of the current election results</p>
        <NigeriaMap />
      </div>

      <div className="space-y-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Vote Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="w-full h-6 bg-gray-200 rounded-sm overflow-hidden">
                <div className="flex h-full">
                  {voteDistribution.map((dist, index) => (
                    <div
                      key={dist.party}
                      className="h-full"
                      style={{
                        backgroundColor: COLORS[index],
                        width: `${(dist.value / totalVotes) * 100}%`
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-sm">
                {voteDistribution.map((dist, index) => (
                  <div key={dist.party} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-1"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span>{dist.party}: {renderPercentage(dist.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Vote Count</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={voteDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {voteDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Votes']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voting Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Total Votes Cast</span>
                    <span className="text-sm">{formattedTotalVotes}</span>
                  </div>
                  <Progress value={100} className="bg-gray-200" />
                </div>

                {voteDistribution.map((dist, index) => (
                  <div key={dist.party}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{dist.name} ({dist.party})</span>
                      <span className="text-sm">{dist.value.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={(dist.value / totalVotes) * 100}
                      className="h-2 bg-gray-200"
                      style={{
                        "--progress-background": COLORS[index]
                      } as React.CSSProperties}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}