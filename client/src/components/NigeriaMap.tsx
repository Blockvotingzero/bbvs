import { useState } from 'react';

interface StateData {
  name: string;
  votes: {
    [key: string]: number;
  };
}

interface Props {
  stateData: Record<string, StateData>;
  onStateClick: (state: string) => void;
}

export default function NigeriaMap({ stateData, onStateClick }: Props) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const handleStateHover = (state: string | null) => {
    setHoveredState(state);
  };

  return (
    <div className="relative w-full h-[600px]">
      {hoveredState && stateData[hoveredState] && (
        <div className="absolute top-4 left-4 bg-background border rounded-lg p-4 shadow-lg z-10">
          <h3 className="font-semibold">{hoveredState}</h3>
          <div className="space-y-2 mt-2">
            {Object.entries(stateData[hoveredState].votes).map(([candidate, votes]) => (
              <p key={candidate} className="text-sm">
                {candidate}: {votes} votes
              </p>
            ))}
          </div>
        </div>
      )}
      
      <svg
        viewBox="0 0 800 800"
        className="w-full h-full"
      >
        {/* This is a simplified example - you would need to add all state paths */}
        <path
          d="M400 300 L450 350 L400 400 L350 350 Z"
          className={`
            ${hoveredState === 'Lagos' ? 'fill-primary/20' : 'fill-muted'}
            stroke-border hover:fill-primary/20 cursor-pointer transition-colors
          `}
          onMouseEnter={() => handleStateHover('Lagos')}
          onMouseLeave={() => handleStateHover(null)}
          onClick={() => onStateClick('Lagos')}
        />
        {/* Add more state paths here */}
      </svg>
    </div>
  );
}
