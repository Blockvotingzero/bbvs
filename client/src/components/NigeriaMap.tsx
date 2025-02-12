
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Input } from "./ui/input";
import { type Vote } from "@shared/schema";
import { cn } from '@/lib/utils';

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

  const getStateStats = (state: string) => {
    const stateVotes = Math.floor(Math.random() * 1000) + 100; // Random votes for demo
    const candidateVotes = {
      1: Math.floor(Math.random() * stateVotes), // Tinubu
      2: Math.floor(Math.random() * stateVotes), // Obi
      3: Math.floor(Math.random() * stateVotes), // Atiku
    };
    
    const leadingCandidate = Object.entries(candidateVotes)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    return {
      totalVotes: stateVotes,
      leadingCandidate: parseInt(leadingCandidate),
      votes: candidateVotes
    };
  };

  const stateStats = nigerianStates.map(state => ({
    name: state,
    ...getStateStats(state)
  }));

  const maxVotes = Math.max(...stateStats.map(s => s.totalVotes));
  const minVotes = Math.min(...stateStats.map(s => s.totalVotes));

  const getStateSize = (votes: number) => {
    const normalized = (votes - minVotes) / (maxVotes - minVotes);
    return 60 + normalized * 20; // Size between 60px and 80px
  };

  const getCandidateColor = (candidateId: number) => {
    switch(candidateId) {
      case 1: return 'bg-red-500/80';
      case 2: return 'bg-green-500/80';
      case 3: return 'bg-blue-500/80';
      default: return 'bg-muted';
    }
  };

  const filteredStates = stateStats.filter(state => 
    state.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          {selectedState && (
            <div className="space-y-2">
              {stateStats.find(s => s.name === selectedState) && (
                <>
                  <p>Total Votes: {stateStats.find(s => s.name === selectedState)?.totalVotes}</p>
                  <p>Leading: {
                    stateStats.find(s => s.name === selectedState)?.leadingCandidate === 1 ? "Tinubu" :
                    stateStats.find(s => s.name === selectedState)?.leadingCandidate === 2 ? "Obi" : "Atiku"
                  }</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="w-2/3 grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-2 place-items-center">
        {filteredStates.map((state) => (
          <div
            key={state.name}
            className={cn(
              'flex items-center justify-center text-center text-xs cursor-pointer transition-all duration-300',
              'rounded hover:opacity-80',
              getCandidateColor(state.leadingCandidate),
              selectedState === state.name ? 'ring-2 ring-primary' : ''
            )}
            style={{
              width: `${getStateSize(state.totalVotes)}px`,
              height: `${getStateSize(state.totalVotes)}px`,
            }}
            onClick={() => setSelectedState(state.name)}
          >
            {state.name}
          </div>
        ))}
      </div>
    </div>
  );
}
