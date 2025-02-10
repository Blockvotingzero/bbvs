
import { useState } from 'react';

export default function NigeriaMap() {
  const [hoveredState, setHoveredState] = useState('');
  
  return (
    <div className="w-full bg-card rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Voting Distribution Map</h2>
      <div className="aspect-[4/3] relative">
        <svg viewBox="0 0 800 600" className="w-full h-full">
          {/* Simplified Nigeria map paths */}
          <path
            d="M400 300 L450 250 L500 300 L450 350 Z"
            className="fill-primary/20 hover:fill-primary/40 transition-colors cursor-pointer"
            onMouseEnter={() => setHoveredState('Lagos')}
            onMouseLeave={() => setHoveredState('')}
          />
          <path
            d="M300 250 L350 200 L400 250 L350 300 Z"
            className="fill-primary/20 hover:fill-primary/40 transition-colors cursor-pointer"
            onMouseEnter={() => setHoveredState('Abuja')}
            onMouseLeave={() => setHoveredState('')}
          />
          {/* Add more state paths here */}
        </svg>
        {hoveredState && (
          <div className="absolute top-4 right-4 bg-background p-2 rounded shadow-sm border">
            <p className="text-sm font-medium">{hoveredState}</p>
            <p className="text-xs text-muted-foreground">Votes: 1,234</p>
          </div>
        )}
      </div>
    </div>
  );
}
