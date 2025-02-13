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
    // Filter votes by state if a state is selected
    const relevantVotes = state && state !== 'all' 
      ? votes.filter(v => {
          // In a real application, you would have state information in your vote data
          // For simulation, we'll use a deterministic way to assign votes to states
          const voteNumber = parseInt(v.transactionHash.slice(-2), 16);
          const stateIndex = voteNumber % 37; // 36 states + FCT
          const states = [
            "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
            "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti",
            "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
            "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
            "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
          ];
          return states[stateIndex] === state;
        })
      : votes;

    const tinubuVotes = relevantVotes.filter(v => v.candidateId === 1).length;
    const obiVotes = relevantVotes.filter(v => v.candidateId === 2).length;
    const atikuVotes = relevantVotes.filter(v => v.candidateId === 3).length;
    const total = relevantVotes.length;

    return {
      total,
      tinubu: tinubuVotes,
      obi: obiVotes,
      atiku: atikuVotes,
      tinubuPercentage: ((tinubuVotes / total) * 100).toFixed(1),
      obiPercentage: ((obiVotes / total) * 100).toFixed(1),
      atikuPercentage: ((atikuVotes / total) * 100).toFixed(1),
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
                <p>Tinubu: {stats.tinubu} ({stats.tinubuPercentage}%)</p>
                <p>Obi: {stats.obi} ({stats.obiPercentage}%)</p>
                <p>Atiku: {stats.atiku} ({stats.atikuPercentage}%)</p>
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