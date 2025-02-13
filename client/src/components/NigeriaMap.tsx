
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
    <div className="flex gap-4 bg-card rounded-lg p-4 mb-6">
      <div className="w-1/3 space-y-4">
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

      <div className="w-2/3">
        <iframe 
          src="/map.html" 
          className="w-full h-[500px] border-none rounded-lg"
          title="Nigeria Map"
        />
      </div>
    </div>
  );
}
