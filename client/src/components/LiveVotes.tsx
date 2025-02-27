import { useEffect, useState } from 'react';
import { type Vote } from '@/types/schema';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockCandidates, mockVotes } from "@/lib/mockData";

export default function LiveVotes() {
  const [displayedVotes, setDisplayedVotes] = useState<Vote[]>([]);

  const getCandidateName = (candidateId: number) => {
    return mockCandidates.find(c => c.id === candidateId)?.name || 'Unknown Candidate';
  };

  const getCandidateParty = (candidateId: number) => {
    return mockCandidates.find(c => c.id === candidateId)?.party || 'Unknown Party';
  };

  useEffect(() => {
    let currentIndex = 0;
    const showNextVote = () => {
      const nextVote = mockVotes[currentIndex];
      setDisplayedVotes([nextVote]);
      currentIndex = (currentIndex + 1) % mockVotes.length;

      // Schedule next vote with random delay between 1s and 3s
      const nextDelay = 1000 + Math.random() * 2000;
      setTimeout(showNextVote, nextDelay);
    };

    showNextVote();
    return () => {};
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Votes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[80px] relative overflow-hidden">
          {displayedVotes.map((vote) => {
            const partyColor = vote.candidateId === 1 ? 'bg-red-500' : 
                           vote.candidateId === 2 ? 'bg-blue-500' : 
                           'bg-green-500';

            return (
              <div
                key={vote.id}
                className="absolute w-full transform transition-all duration-500 ease-in-out animate-slide-down"
              >
                <div className="bg-card p-4 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 ${partyColor} rounded-full animate-pulse`}></div>
                      <span className="font-mono text-sm">
                        {vote.transactionHash.slice(0, 10)}...
                      </span>
                    </div>
                    <span className="text-sm">
                      {getCandidateName(vote.candidateId)} • {getCandidateParty(vote.candidateId)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}