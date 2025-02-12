
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Input } from "./ui/input";
import { type Vote } from "@shared/schema";

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

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

  const filteredStates = nigerianStates.filter(state => 
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      
      <div className="w-2/3 grid grid-cols-6 gap-2">
        {filteredStates.map((state) => (
          <div
            key={state}
            className={`aspect-square p-2 rounded flex items-center justify-center text-center text-xs cursor-pointer transition-colors
              ${selectedState === state ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-primary/20'}`}
            onClick={() => setSelectedState(state)}
          >
            {state}
          </div>
        ))}
      </div>
    </div>
  );
}
