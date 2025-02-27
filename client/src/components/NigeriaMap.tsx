import { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { type Vote } from "@/types/schema";
import { mockVotes } from "@/lib/mockData";

export default function NigeriaMap() {
  const [selectedState, setSelectedState] = useState('');
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const getVoteStats = (state: string | null) => {
    // For now, we'll return mock statistics since we don't have state-specific data
    const votes = mockVotes;
    const stateVotes = state === "all" || !state ? votes : votes.filter(v => v.state === state);
    return {
      total: stateVotes.length,
      tinubu: stateVotes.filter(v => v.candidateId === 1).length,
      obi: stateVotes.filter(v => v.candidateId === 2).length,
      atiku: stateVotes.filter(v => v.candidateId === 3).length,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>, stateName: string) => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setTooltip({
        show: true,
        text: stateName,
        x: e.clientX - rect.left + 10,
        y: e.clientY - rect.top + 10
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, show: false });
  };

  const handleStateClick = (stateId: string) => {
    setSelectedState(stateId);
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
            {/* Add more states as needed */}
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
        <style>
          {`
            .map-container { 
              width: 100%; 
              height: 100%; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              background-color: transparent;
              position: relative;
            }
            svg { 
              width: 100%; 
              height: 100%; 
              max-width: 100%; 
              max-height: 100%; 
            }
            path { 
              fill: rgb(166, 192, 172); 
              stroke: #fff; 
              stroke-width: 2; 
              transition: all 0.3s; 
              cursor: pointer;
            }
            path:hover {
              fill: rgb(100, 100, 100);
            }
            .tooltip {
              position: absolute;
              background: rgba(0, 0, 0, 0.7);
              color: white;
              padding: 5px 10px;
              border-radius: 5px;
              font-size: 12px;
              pointer-events: none;
              z-index: 10;
            }
          `}
        </style>
        <div className="aspect-[4/3] bg-muted rounded-lg">
          <div className="map-container" ref={mapRef}>
            {tooltip.show && (
              <div 
                className="tooltip"
                style={{
                  left: `${tooltip.x}px`,
                  top: `${tooltip.y}px`,
                }}
              >
                {tooltip.text}
              </div>
            )}
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 744 600" 
              preserveAspectRatio="xMidYMid meet"
            >
              <path 
                d="m 291.01165,491.65874 0.6,0.77 4.83,-0.89 2.71,0.27 2.05,1.34 0.33,1.46 0,0 0.07,4.36 -0.55,2.86 0.05,0.73 0.94,1.03 14.09,0.86 1.24,1.86 0.22,2.19 0.7,1.04 3.21,2.33 1.34,0.21 0,0 1.08,1.29 -0.59,3.72 0.15,3.78 1.37,4.63 0.73,1.68 1.71,2 0.76,2.55 -0.6,1.21 -3.42,-0.76 0,0 -2.69,-2.61 -2.54,-0.84 -2.76,-2.14 -0.58,-2.11 -1.19,-1.47 -3.4,-0.91 -2.42,0.14 -0.28,0.91 0.53,3.51 -1.84,5.1 0.32,0.45 2.23,-0.16 -0.7,2.44 -0.73,0.9 -6.08,-0.16 -1.1,0.98 -0.07,0.75 1.07,1.94 -1.21,5.81 -0.03,2.4 0.66,2.49 -1.17,2.89 -2.52,1.94 0.09,0.77 -0.47,0.64 0.22,1.47 0.59,0.67 0.02,1.17 -0.67,1.62 1.79,3.37 0.13,1.85 0,0 -2.36,-1.79 -2.94,-1.41 -1.8,0.43 -3.28,-1.22 -2.79,0.12 -1.11,0.64 -3.13,0.58 -1.8,-0.27 -1.45,-1.41 -0.59,-1.1 0.16,-1.1 1.37,-3.7 3.42,-4.33 2.39,-4.19 -0.05,-2.78 -0.66,-1.72 -0.54,-0.05 0,0 3.09,-10.25 2.1,-3.87 1.82,-1.68 1.18,-3.04 0.89,-0.9 0.43,-2.01 -0.36,-3.45 0.28,-2.05 -1.51,-2.44 1.23,-0.77 -0.38,-8.47 -0.47,-1.35 -1.04,-1.45 -5.34,-1.78 -2.01,-1.69 0,0 1.27,-2.22 1.36,-1.3 z" 
                id="NG-AB"
                onMouseMove={(e) => handleMouseMove(e, "Abia")}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleStateClick("Abia")}
              />
              {/* Add all other state paths here with the same event handlers */}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}