import { useLocation } from "wouter";
import { useCandidates, useVotes } from "@/hooks/useApi";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { data: candidates = [] } = useCandidates();
  const { data: votes = [] } = useVotes();

  const totalVotes = votes.length;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Secure Blockchain Voting System
        </h1>
        <p className="text-xl text-muted-foreground">
          A transparent and secure way to cast your vote
        </p>
      </div>

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
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => setLocation("/vote")}
        >
          Cast Your Vote
        </button>
        <button
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md"
          onClick={() => setLocation("/results")}
        >
          View Results
        </button>
      </div>
    </div>
  );
}