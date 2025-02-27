
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { type MockVote, type MockCandidate, getVotes, getCandidates } from "@/lib/mockBlockchainData";

export default function Explorer() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [votes, setVotes] = useState<MockVote[]>([]);
  const [candidates, setCandidates] = useState<MockCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 20;
  const COLORS = ['#FF8042', '#00C49F', '#0088FE'];

  useEffect(() => {
    // Simulate blockchain data fetch
    setTimeout(() => {
      setVotes(getVotes());
      setCandidates(getCandidates());
      setIsLoading(false);
    }, 800);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getCandidateName = (candidateId: number) => {
    return candidates.find(c => c.id === candidateId)?.name || "Unknown";
  };

  const filteredVotes = votes.filter(vote => 
    vote.transactionHash.toLowerCase().includes(search.toLowerCase()) ||
    getCandidateName(vote.candidateId).toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVotes.length / ITEMS_PER_PAGE);
  const paginatedVotes = filteredVotes.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Calculate statistics
  const totalVotes = votes.length;
  const uniqueVoters = new Set(votes.map(vote => vote.voterAddress)).size;
  const latestBlock = Math.max(...votes.map(vote => vote.blockNumber));
  const averageBlockTime = 13.2; // Mock average block time in seconds

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Blockchain Explorer</h1>
        <p className="text-muted-foreground">View all transactions on the blockchain</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Votes recorded on the blockchain
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Voters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueVoters.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Distinct wallet addresses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Latest Block</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{latestBlock.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Current blockchain height
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Block Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageBlockTime}s</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average time between blocks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Candidate Vote Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Vote Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {candidates.map((candidate, index) => {
              const candidateVotes = votes.filter(v => v.candidateId === candidate.id).length;
              const percentage = totalVotes > 0 ? (candidateVotes / totalVotes) * 100 : 0;
              
              return (
                <div key={candidate.id}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{candidate.name} ({candidate.party})</span>
                    <span className="text-sm">{candidateVotes.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="h-2"
                    style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                    indicator={{ style: { backgroundColor: COLORS[index] } }}
                  />
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-between text-sm mt-4">
            {candidates.map((candidate, index) => (
              <div key={candidate.id} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: COLORS[index] }}
                ></div>
                <span>{candidate.party}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by transaction hash or candidate name"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          Showing {filteredVotes.length} transactions
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Hash</TableHead>
                <TableHead>Block Number</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Candidate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVotes.map((vote) => (
                <TableRow key={vote.transactionHash}>
                  <TableCell className="font-mono">{vote.transactionHash.substring(0, 16)}...</TableCell>
                  <TableCell>{vote.blockNumber}</TableCell>
                  <TableCell>{new Date(vote.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{getCandidateName(vote.candidateId)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page => Math.max(page - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page => Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
