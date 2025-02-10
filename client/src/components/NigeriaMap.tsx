
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

  const getStateVotes = (state: string) => {
    // Simulate state-specific votes by using a deterministic but random-looking distribution
    const hash = state.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const stateVotes = votes.filter((_, index) => index % nigerianStates.length === hash % nigerianStates.length);
    
    return {
      total: stateVotes.length,
      tinubu: stateVotes.filter(v => v.candidateId === 1).length,
      obi: stateVotes.filter(v => v.candidateId === 2).length,
      atiku: stateVotes.filter(v => v.candidateId === 3).length,
    };
  };

  const getWinningCandidate = (votes: { tinubu: number; obi: number; atiku: number }) => {
    const max = Math.max(votes.tinubu, votes.obi, votes.atiku);
    if (max === votes.tinubu) return 'red';
    if (max === votes.obi) return 'green';
    return 'blue';
  };

  const stateStats = nigerianStates.map(state => {
    const votes = getStateVotes(state);
    return {
      state,
      votes,
      total: votes.total,
      color: getWinningCandidate(votes)
    };
  });

  const maxVotes = Math.max(...stateStats.map(s => s.total));
  const minVotes = Math.min(...stateStats.map(s => s.total));

  const getStateSize = (votes: number) => {
    const normalized = (votes - minVotes) / (maxVotes - minVotes);
    return 50 + normalized * 50; // Size ranges from 50px to 100px
  };

  const filteredStates = stateStats.filter(({ state }) => 
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
          {selectedState ? (
            (() => {
              const stats = getStateVotes(selectedState);
              return (
                <div className="space-y-2">
                  <p>Total Votes: {stats.total}</p>
                  <p className="text-red-500">Tinubu: {stats.tinubu}</p>
                  <p className="text-green-500">Obi: {stats.obi}</p>
                  <p className="text-blue-500">Atiku: {stats.atiku}</p>
                </div>
              );
            })()
          ) : (
            <div className="space-y-2">
              <p>Total Votes: {votes.length}</p>
              <p className="text-red-500">Tinubu: {votes.filter(v => v.candidateId === 1).length}</p>
              <p className="text-green-500">Obi: {votes.filter(v => v.candidateId === 2).length}</p>
              <p className="text-blue-500">Atiku: {votes.filter(v => v.candidateId === 3).length}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-2/3 grid grid-cols-6 gap-2">
        {filteredStates.map(({ state, total, color }) => (
          <div
            key={state}
            style={{
              width: `${getStateSize(total)}px`,
              height: `${getStateSize(total)}px`,
              backgroundColor: color === 'red' ? 'rgb(239 68 68)' : 
                             color === 'green' ? 'rgb(34 197 94)' : 
                             'rgb(59 130 246)',
              opacity: selectedState === state ? 1 : 0.7
            }}
            className={`flex items-center justify-center text-center text-xs cursor-pointer transition-all rounded-lg text-white hover:opacity-100`}
            onClick={() => setSelectedState(state)}
          >
            {state}
          </div>
        ))}
      </div>
    </div>
  );
}
