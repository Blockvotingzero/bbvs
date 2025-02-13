import { useState } from 'react';
//import { useQuery } from "@tanstack/react-query";
//import { Input } from "./ui/input";
//import { type Vote } from "@shared/schema";

export default function NigeriaMap() {
  //const [selectedState, setSelectedState] = useState('');
  //const [searchQuery, setSearchQuery] = useState('');
  //
  //const { data: votes } = useQuery<Vote[]>({
  //  queryKey: ["/api/votes"]
  //});
  //
  //if (!votes) return null;
  //
  //const getVoteStats = (state: string | null) => {
  //  const relevantVotes = votes;
  //  return {
  //    total: relevantVotes.length,
  //    tinubu: relevantVotes.filter(v => v.candidateId === 1).length,
  //    obi: relevantVotes.filter(v => v.candidateId === 2).length,
  //    atiku: relevantVotes.filter(v => v.candidateId === 3).length,
  //  };
  //};

  return (
    <div className="flex gap-4 bg-card rounded-lg p-4 mb-6">
      <div className="w-1/3 space-y-4">
        <h3 className="font-semibold mb-2">National Statistics</h3>
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <p>Total Votes: Loading...</p>
        </div>
      </div>

      <div className="w-2/3">
        <iframe 
          src={window.location.origin + "/map.html"} 
          className="w-full h-[500px] border-none rounded-lg"
          title="Nigeria Map"
        />
      </div>
    </div>
  );
}