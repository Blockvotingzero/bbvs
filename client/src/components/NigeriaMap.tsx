import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Input } from "./ui/input";
import { type Vote } from "@shared/schema";

export default function NigeriaMap() {
  const [selectedState, setSelectedState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: votes } = useQuery<Vote[]>({
    queryKey: ["/api/votes"]
  });

  if (!votes) return null;

  const getVoteStats = (state: string | null) => {
    const relevantVotes = votes;
    return {
      total: relevantVotes.length,
      tinubu: relevantVotes.filter(v => v.candidateId === 1).length,
      obi: relevantVotes.filter(v => v.candidateId === 2).length,
      atiku: relevantVotes.filter(v => v.candidateId === 3).length,
    };
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-card rounded-lg p-4 mb-6 min-h-[600px]">
      <div className="w-full md:w-1/3 space-y-4 order-2 md:order-1">
        <Input 
          placeholder="Search states..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">
            {selectedState || 'National'} Statistics
          </h3>
          {(() => {
            const stats = getVoteStats(selectedState);
            return (
              <div className="space-y-2">
                <p>Total Votes: {stats.total}</p>
                <p>Tinubu: {stats.tinubu}</p>
                <p>Obi: {stats.obi}</p>
                <p>Atiku: {stats.atiku}</p>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="w-full md:w-2/3 bg-muted rounded-lg overflow-hidden order-1 md:order-2 h-[400px] md:h-full">
        <iframe 
          src="https://blockvotingzero.github.io/"
          className="w-full h-full border-0"
          title="Nigeria Map"
        />
      </div>
    </div>
  );
}