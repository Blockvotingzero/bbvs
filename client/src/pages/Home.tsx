
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import NigeriaMap from "@/components/NigeriaMap";
import { getCandidates, getVotes } from "@/lib/mockBlockchainData";

export default function Home() {
  const [votes, setVotes] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate blockchain data fetch
    setTimeout(() => {
      setVotes(getVotes());
      setCandidates(getCandidates());
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Prepare chart data
  const pieData = candidates.map(candidate => ({
    name: candidate.name,
    value: candidate.votes,
    party: candidate.party
  }));

  const COLORS = ['#FF8042', '#00C49F', '#0088FE'];

  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
  const formattedTotalVotes = totalVotes.toLocaleString();

  const renderPercentage = (value) => {
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
                {(() => {
                  const totalVotes = votes.length;
                  if (totalVotes === 0) return null;
                  
                  const apcVotes = candidates.find(c => c.id === 1)?.votes || 0;
                  const lpVotes = candidates.find(c => c.id === 2)?.votes || 0;
                  const pdpVotes = candidates.find(c => c.id === 3)?.votes || 0;
                  
                  const apcPercentage = (apcVotes / totalVotes) * 100;
                  const lpPercentage = (lpVotes / totalVotes) * 100;
                  const pdpPercentage = (pdpVotes / totalVotes) * 100;
                  
                  return (
                    <div className="flex h-full">
                      <div className="bg-[#FF8042]" style={{ width: `${apcPercentage}%` }}></div>
                      <div className="bg-[#00C49F]" style={{ width: `${lpPercentage}%` }}></div>
                      <div className="bg-[#0088FE]" style={{ width: `${pdpPercentage}%` }}></div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex justify-between text-sm">
                {candidates.map((candidate, index) => (
                  <div key={candidate.id} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <span>{candidate.party}: {renderPercentage(candidate.votes)}</span>
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
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
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
                  <Progress value={100} />
                </div>

                {candidates.map((candidate, index) => (
                  <div key={candidate.id}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{candidate.name} ({candidate.party})</span>
                      <span className="text-sm">{candidate.votes.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={(candidate.votes / totalVotes) * 100} 
                      className="h-2"
                      style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                      indicator={{ style: { backgroundColor: COLORS[index] } }}
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
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCandidates, useVotes } from "@/hooks/useApi";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: candidates = [] } = useCandidates();
  const { data: votes = [] } = useVotes();

  const totalVotes = votes.length;
  
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Secure Blockchain Voting System
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          A transparent and secure way to cast your vote using blockchain technology
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border rounded-lg p-6">
            <div className="text-4xl font-bold mb-2">{candidates.length}</div>
            <div className="text-muted-foreground">Candidates</div>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <div className="text-4xl font-bold mb-2">{totalVotes}</div>
            <div className="text-muted-foreground">Votes Cast</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => setLocation("/liveness-check")}>
            Cast Your Vote
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setLocation("/results")}
          >
            View Results
          </Button>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        {candidates.map(candidate => (
          <div key={candidate.id} className="bg-card border rounded-lg p-6 text-center">
            <div className="mx-auto w-24 h-24 rounded-full overflow-hidden mb-4">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-medium mb-1">{candidate.name}</h3>
            <p className="text-muted-foreground mb-4">{candidate.party}</p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setLocation("/liveness-check")}
            >
              Vote for {candidate.name.split(' ')[0]}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
