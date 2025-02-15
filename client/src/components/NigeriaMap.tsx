import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { type Vote } from "@shared/schema";

export default function NigeriaMap() {
  const [selectedState, setSelectedState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: votes } = useQuery<Vote[]>({
    queryKey: ["/api/votes"]
  });

  if (!votes) return null;

  const getVoteStats = (state: string | null) => {
    const stateVotes = state === "all" || !state ? votes : votes.filter(v => v.state === state);
    return {
      total: stateVotes.length,
      tinubu: stateVotes.filter(v => v.candidateId === 1).length,
      obi: stateVotes.filter(v => v.candidateId === 2).length,
      atiku: stateVotes.filter(v => v.candidateId === 3).length,
    };
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-card rounded-lg p-4 mb-6">
      <div className="w-full md:w-1/3 space-y-4 order-2 md:order-1">
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Search states..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Nigeria</SelectItem>
            <SelectItem value="Abia">Abia</SelectItem>
            <SelectItem value="Adamawa">Adamawa</SelectItem>
            <SelectItem value="Akwa Ibom">Akwa Ibom</SelectItem>
            <SelectItem value="Anambra">Anambra</SelectItem>
            <SelectItem value="Bauchi">Bauchi</SelectItem>
            <SelectItem value="Bayelsa">Bayelsa</SelectItem>
            <SelectItem value="Benue">Benue</SelectItem>
            <SelectItem value="Borno">Borno</SelectItem>
            <SelectItem value="Cross River">Cross River</SelectItem>
            <SelectItem value="Delta">Delta</SelectItem>
            <SelectItem value="Ebonyi">Ebonyi</SelectItem>
            <SelectItem value="Edo">Edo</SelectItem>
            <SelectItem value="Ekiti">Ekiti</SelectItem>
            <SelectItem value="Enugu">Enugu</SelectItem>
            <SelectItem value="FCT">Federal Capital Territory</SelectItem>
            <SelectItem value="Gombe">Gombe</SelectItem>
            <SelectItem value="Imo">Imo</SelectItem>
            <SelectItem value="Jigawa">Jigawa</SelectItem>
            <SelectItem value="Kaduna">Kaduna</SelectItem>
            <SelectItem value="Kano">Kano</SelectItem>
            <SelectItem value="Katsina">Katsina</SelectItem>
            <SelectItem value="Kebbi">Kebbi</SelectItem>
            <SelectItem value="Kogi">Kogi</SelectItem>
            <SelectItem value="Kwara">Kwara</SelectItem>
            <SelectItem value="Lagos">Lagos</SelectItem>
            <SelectItem value="Nasarawa">Nasarawa</SelectItem>
            <SelectItem value="Niger">Niger</SelectItem>
            <SelectItem value="Ogun">Ogun</SelectItem>
            <SelectItem value="Ondo">Ondo</SelectItem>
            <SelectItem value="Osun">Osun</SelectItem>
            <SelectItem value="Oyo">Oyo</SelectItem>
            <SelectItem value="Plateau">Plateau</SelectItem>
            <SelectItem value="Rivers">Rivers</SelectItem>
            <SelectItem value="Sokoto">Sokoto</SelectItem>
            <SelectItem value="Taraba">Taraba</SelectItem>
            <SelectItem value="Yobe">Yobe</SelectItem>
            <SelectItem value="Zamfara">Zamfara</SelectItem>
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
                <p>Total Votes: {stats.total}</p>
                <p>Tinubu: {stats.tinubu}</p>
                <p>Obi: {stats.obi}</p>
                <p>Atiku: {stats.atiku}</p>
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