import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { type Vote } from "@/types/schema";
import { mockVotes } from "@/lib/mockData";
import { VoteDistributionChart } from './VoteDistributionChart';

export default function NigeriaMap() {
  const [selectedState, setSelectedState] = useState('');

  const getVoteStats = (state: string | null) => {
    const votes = mockVotes;
    const stateVotes = state === "all" || !state ? votes : votes.filter(v => (v as any).state === state);
    return {
      total: stateVotes.length,
      tinubu: stateVotes.filter(v => v.candidateId === 1).length,
      obi: stateVotes.filter(v => v.candidateId === 2).length,
      atiku: stateVotes.filter(v => v.candidateId === 3).length,
    };
  };

  // Transform data for the chart
  const chartData = [
    {
      state: selectedState || 'National',
      ...(() => {
        const stats = getVoteStats(selectedState);
        return {
          apc: stats.tinubu,
          pdp: stats.atiku,
          lp: stats.obi
        };
      })()
    }
  ];

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
            {/* Add more states as needed */}
          </SelectContent>
        </Select>

        <div className="bg-muted p-4 rounded-lg space-y-4">
          <h3 className="font-semibold mb-2">
            {selectedState || 'National'} Statistics
          </h3>
          <VoteDistributionChart data={chartData} />
        </div>
      </div>

      <div className="w-full md:w-2/3 order-1 md:order-2">
        <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
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