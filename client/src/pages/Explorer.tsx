import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { getVotes, getCandidates } from "@/lib/mockBlockchainData";

export default function Explorer() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const votes = getVotes();
  const candidates = getCandidates();
  const ITEMS_PER_PAGE = 10;

  const getCandidateName = (candidateId: number) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    return candidate ? candidate.name : "Unknown";
  };

  const getCandidateParty = (candidateId: number) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    return candidate ? candidate.party : "Unknown";
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
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
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Transactions recorded on blockchain</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Voters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueVoters.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Distinct wallet addresses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Latest Block</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{latestBlock.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Current blockchain height</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Block Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageBlockTime}s</div>
            <p className="text-xs text-muted-foreground mt-1">Time between blocks</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Input
              placeholder="Search by transaction hash or candidate name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm mr-2"
            />
            <Button variant="outline" onClick={() => setSearch("")}>Clear</Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction Hash</TableHead>
                  <TableHead>Block</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Voter Address</TableHead>
                  <TableHead>Candidate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVotes.map((vote) => (
                  <TableRow key={vote.id}>
                    <TableCell className="font-mono">{vote.transactionHash}</TableCell>
                    <TableCell>#{vote.blockNumber.toLocaleString()}</TableCell>
                    <TableCell>{formatDate(vote.timestamp)}</TableCell>
                    <TableCell className="font-mono">{vote.voterAddress.slice(0, 10)}...</TableCell>
                    <TableCell>
                      {getCandidateName(vote.candidateId)} ({getCandidateParty(vote.candidateId)})
                    </TableCell>
                  </TableRow>
                ))}

                {paginatedVotes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="mx-4 flex items-center">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}