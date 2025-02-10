
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { type Vote } from "@shared/schema";

const states = [
  { id: 'LG', name: 'Lagos', position: { x: 200, y: 400 } },
  { id: 'AB', name: 'Abuja', position: { x: 400, y: 200 } },
  { id: 'KN', name: 'Kano', position: { x: 400, y: 100 } },
  { id: 'RV', name: 'Rivers', position: { x: 300, y: 450 } },
];

export default function NigeriaMap() {
  const [hoveredState, setHoveredState] = useState('');
  
  const { data: votes } = useQuery<Vote[]>({
    queryKey: ["/api/votes"]
  });

  if (!votes) return null;

  const getVotesByCandidate = (stateName: string) => {
    // Simulate state-specific votes by dividing total votes
    const stateVotes = votes.slice(0, Math.floor(votes.length / states.length));
    const counts = {
      'Bola Ahmed Tinubu': stateVotes.filter(v => v.candidateId === 1).length,
      'Peter Obi': stateVotes.filter(v => v.candidateId === 2).length,
      'Atiku Abubakar': stateVotes.filter(v => v.candidateId === 3).length,
    };
    return counts;
  };
  
  return (
    <div className="w-full bg-card rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Voting Distribution Map</h2>
      <div className="aspect-[2/1] relative" style={{ maxHeight: '300px' }}>
        <svg viewBox="0 0 800 500" className="w-full h-full">
          {states.map((state) => (
            <g key={state.id}>
              <rect
                x={state.position.x}
                y={state.position.y}
                width="80"
                height="80"
                className="fill-primary/20 hover:fill-primary/40 transition-colors cursor-pointer stroke-primary/50"
                onMouseEnter={() => setHoveredState(state.name)}
                onMouseLeave={() => setHoveredState('')}
              />
              <text
                x={state.position.x + 40}
                y={state.position.y + 45}
                className="text-xs font-medium"
                textAnchor="middle"
              >
                {state.id}
              </text>
            </g>
          ))}
        </svg>
        {hoveredState && (
          <div className="absolute top-2 right-2 bg-background p-2 rounded shadow-sm border">
            <p className="text-sm font-medium">{hoveredState}</p>
            {Object.entries(getVotesByCandidate(hoveredState)).map(([candidate, count]) => (
              <p key={candidate} className="text-xs text-muted-foreground">
                {candidate.split(' ')[0]}: {count} votes
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
