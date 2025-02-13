import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { stateVotes } from "@/lib/mock-data";

export default function NigeriaMap() {
  const [selectedState, setSelectedState] = useState('');

  const getVoteStats = (state: string | null) => {
    if (!state || state === '') {
      // Calculate national totals
      const totalVotes = Object.values(stateVotes).reduce(
        (acc, curr) => ({
          APC: acc.APC + curr.APC,
          LP: acc.LP + curr.LP,
          PDP: acc.PDP + curr.PDP
        }),
        { APC: 0, LP: 0, PDP: 0 }
      );
      return totalVotes;
    }
    return stateVotes[state];
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-card rounded-lg p-4 mb-6">
      <div className="w-full md:w-1/3 space-y-4 order-2 md:order-1">
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Select a state..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Nigeria</SelectItem>
            {Object.keys(stateVotes).sort().map((state) => (
              <SelectItem key={state} value={state}>{state}</SelectItem>
            ))}
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
                <p>Total Votes: {stats.APC + stats.LP + stats.PDP}</p>
                <p>APC: {stats.APC}</p>
                <p>LP: {stats.LP}</p>
                <p>PDP: {stats.PDP}</p>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="w-full md:w-2/3 order-1 md:order-2">
        <iframe 
          src="https://blockvotingzero.github.io/"
          className="w-full aspect-[4/3] border-0"
          title="Nigeria Map"
        />
      </div>
    </div>
  );
}