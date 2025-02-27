import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockVotes, mockCandidates } from "@/lib/mockData";
import type { Vote } from "@/types/schema";

export default function Explorer() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setVotes(mockVotes);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getCandidateName = (candidateId: number) => {
    return mockCandidates.find(c => c.id === candidateId)?.name || "Unknown";
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

  // Get the latest block height
  const latestBlockHeight = Math.max(...votes.map(vote => vote.blockHeight));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Blockchain Explorer</h1>
        <p className="text-muted-foreground">View all transactions on the blockchain</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{votes.length.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">Verified transactions on the blockchain</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Latest Block</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{latestBlockHeight.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">Current blockchain height</p>
          </CardContent>
        </Card>
      </div>

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
                <TableHead>Block Height</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Candidate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVotes.map((vote) => (
                <TableRow key={vote.transactionHash}>
                  <TableCell className="font-mono">{vote.transactionHash.substring(0, 16)}...</TableCell>
                  <TableCell>{vote.blockHeight}</TableCell>
                  <TableCell>{new Date(vote.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{getCandidateName(vote.candidateId)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {page} of {totalPages}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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