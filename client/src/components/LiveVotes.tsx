import { useEffect, useState } from 'react';
import { type Vote } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';

export default function LiveVotes() {
  const [displayedVotes, setDisplayedVotes] = useState<Vote[]>([]);
  const { data: votes } = useQuery<Vote[]>({
    queryKey: ["/api/votes"]
  });
  const [candidates, setCandidates] = useState<any[]>([]); // Assuming candidates data is available
  useEffect(()=>{
    fetch('/api/candidates').then(res=>res.json()).then(data=>setCandidates(data))
  },[])

  const getCandidateName = (candidateId: number) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    return candidate ? candidate.name : 'Unknown Candidate';
  };

  const getCandidateParty = (candidateId: number) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    return candidate ? candidate.party : 'Unknown Party';
  };


  useEffect(() => {
    if (!votes || !candidates) return;

    let currentIndex = 0;
    const showNextVote = () => {
      const nextVote = votes[currentIndex];
      setDisplayedVotes([nextVote]);
      currentIndex = (currentIndex + 1) % votes.length;

      // Schedule next vote with random delay between 0.5s and 1.5s
      const nextDelay = 500 + Math.random() * 1000;
      setTimeout(showNextVote, nextDelay);
    };

    showNextVote();
    return () => {};
  }, [votes, candidates]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Live Votes</h3>
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
    </div>
  );
}