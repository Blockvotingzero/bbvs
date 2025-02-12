
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState, useEffect } from "react";

type StateStats = {
  totalVotes: number;
  leadingCandidate: string;
  votes: {
    APC: number;
    LP: number;
    PDP: number;
  }
}

export default function NigeriaStatesMap() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    fetch('https://mapsvg.com/maps/geo-calibrated/nigeria.svg')
      .then(response => response.text())
      .then(data => {
        // Clean and process SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, 'image/svg+xml');
        const svg = svgDoc.querySelector('svg');
        if (svg) {
          svg.setAttribute('width', '100%');
          svg.setAttribute('height', '100%');
          setSvgContent(svg.outerHTML);
        }
      });
  }, []);

  const getStateStats = (state: string): StateStats => {
    // Simulated stats
    return {
      totalVotes: Math.floor(Math.random() * 1000) + 100,
      leadingCandidate: ['APC', 'LP', 'PDP'][Math.floor(Math.random() * 3)],
      votes: {
        APC: Math.floor(Math.random() * 500),
        LP: Math.floor(Math.random() * 500),
        PDP: Math.floor(Math.random() * 500)
      }
    };
  };

  const getCandidateColor = (candidate: string) => {
    switch(candidate) {
      case 'APC': return 'bg-red-500/80';
      case 'LP': return 'bg-green-500/80';
      case 'PDP': return 'bg-blue-500/80';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex gap-6">
        <div className="w-2/3">
          <div 
            className="aspect-square bg-white rounded-lg p-4"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
        
        <div className="w-1/3 space-y-4">
          <Select onValueChange={setSelectedState} value={selectedState ?? undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {nigerianStates.map(state => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedState && (
            <div className="space-y-2">
              <h3 className="font-semibold">{selectedState} Statistics</h3>
              <div className="space-y-1">
                {(() => {
                  const stats = getStateStats(selectedState);
                  return (
                    <>
                      <div className="flex justify-between">
                        <span>Total Votes:</span>
                        <span>{stats.totalVotes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Leading:</span>
                        <span className={cn(
                          "px-2 rounded",
                          getCandidateColor(stats.leadingCandidate)
                        )}>
                          {stats.leadingCandidate}
                        </span>
                      </div>
                      <div className="h-px bg-border my-2" />
                      <div className="flex justify-between">
                        <span>APC:</span>
                        <span>{stats.votes.APC}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>LP:</span>
                        <span>{stats.votes.LP}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PDP:</span>
                        <span>{stats.votes.PDP}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
];
