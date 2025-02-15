
import { useEffect, useState } from 'react';
import { type Vote } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';

export default function LiveVotes() {
  const [displayedVotes, setDisplayedVotes] = useState<Vote[]>([]);
  const { data: votes } = useQuery<Vote[]>({
    queryKey: ["/api/votes"]
  });

  const { data: candidates } = useQuery({
    queryKey: ["/api/candidates"]
  });
  
  useEffect(() => {
    if (!votes || !candidates) return;
    
    let currentIndex = 0;
    const showNextVote = () => {
      const nextVote = votes[currentIndex];
      setDisplayedVotes(prev => {
        const newVotes = [...prev, nextVote].slice(-3);
        return newVotes.filter((v, i, arr) => 
          arr.findIndex(vote => vote.id === v.id) === i
        );
      });
      currentIndex = (currentIndex + 1) % votes.length;
    };

    // Create varying intervals between 1.5 and 3 seconds
    const interval = setInterval(() => {
      showNextVote();
      clearInterval(interval);
      const nextDelay = 1500 + Math.random() * 1500;
      setTimeout(() => {
        showNextVote();
      }, nextDelay);
    }, 2000);

    return () => clearInterval(interval);
  }, [votes, candidates]);

  const getCandidateName = (candidateId: number) => {
    return candidates?.find(c => c.id === candidateId)?.name || '';
  }

  const getCandidateParty = (candidateId: number) => {
    return candidates?.find(c => c.id === candidateId)?.party || '';
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Live Votes</h3>
      <div className="h-[280px] relative overflow-hidden">
        {displayedVotes.map((vote, i) => {
          const candidate = candidates?.find(c => c.id === vote.candidateId);
          const partyColor = vote.candidateId === 1 ? 'bg-red-500' : 
                           vote.candidateId === 2 ? 'bg-blue-500' : 
                           'bg-green-500';
          
          return (
            <div
              key={`${vote.id}-${i}`}
              className="absolute w-full transform transition-all duration-500 ease-in-out animate-slide-down"
              style={{
                top: i * 90,
                opacity: 1,
              }}
            >
              <div className="bg-card p-4 rounded-lg border">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 ${partyColor} rounded-full animate-pulse`}></div>
                      <span className="font-mono text-sm">
                        {vote.transactionHash.slice(0, 10)}...
                      </span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {new Date(vote.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Vote cast for <span className="font-semibold text-foreground">{getCandidateName(vote.candidateId)}</span>
                    <span className="mx-1">•</span>
                    <span>{getCandidateParty(vote.candidateId)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
