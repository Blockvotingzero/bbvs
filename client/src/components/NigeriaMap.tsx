import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { type Vote } from "@/types/schema";
import { mockCandidates, mockVotes, getVotesByCandidate } from "@/lib/mockData";

export default function NigeriaMap() {
  const [selectedState, setSelectedState] = useState<string>('');

  const getVoteStats = (state: string | null) => {
    // For now, we'll return mock statistics since we don't have state-specific data
    const votes = mockVotes;
    return {
      total: votes.length,
      tinubu: getVotesByCandidate(1).length,
      obi: getVotesByCandidate(2).length,
      atiku: getVotesByCandidate(3).length,
    };
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-card rounded-lg p-4 mb-6">
      <div className="w-full md:w-1/3 space-y-4 order-2 md:order-1">
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Select a state..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Nigeria</SelectItem>
            <SelectItem value="Lagos">Lagos</SelectItem>
            <SelectItem value="Abuja">Abuja</SelectItem>
            <SelectItem value="Kano">Kano</SelectItem>
          </SelectContent>
        </Select>
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">
            {selectedState || 'National'} Statistics
          </h3>
          {(() => {
            const stats = getVoteStats(selectedState);
            return (
              <div className="space-y-2">
                <p>Total Votes: {stats.total.toLocaleString()}</p>
                <p>Tinubu (APC): {stats.tinubu.toLocaleString()}</p>
                <p>Obi (LP): {stats.obi.toLocaleString()}</p>
                <p>Atiku (PDP): {stats.atiku.toLocaleString()}</p>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="w-full md:w-2/3 order-1 md:order-2">
        <div className="aspect-[16/9] max-h-[500px] bg-muted rounded-lg overflow-hidden">
          <iframe 
            src="https://blockvotingzero.github.io"
            className="w-full h-full border-0"
            title="Nigeria Voting Map"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>
    </div>
  );
}