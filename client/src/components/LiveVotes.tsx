
import { useEffect, useState } from 'react';
import { type Vote } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';

export default function LiveVotes() {
  const [displayedVotes, setDisplayedVotes] = useState<Vote[]>([]);
  const { data: votes } = useQuery<Vote[]>({
    queryKey: ["/api/votes"]
  });
  
  useEffect(() => {
    if (!votes) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      const nextVote = votes[currentIndex];
      setDisplayedVotes(prev => {
        if (prev[0]?.id === nextVote.id) return prev;
        return [nextVote];
      });
      currentIndex = (currentIndex + 1) % votes.length;
    }, 3000);

    return () => clearInterval(interval);
  }, [votes]);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Live Votes</h3>
      <div className="h-[100px] relative overflow-hidden">
        {displayedVotes.map((vote, i) => (
          <div
            key={`${vote.id}-${i}`}
            className="absolute w-full transform transition-all duration-500 ease-in-out animate-slide-down"
            style={{
              top: 0,
              opacity: 1,
            }}
          >
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-mono text-sm">
                    {vote.transactionHash.slice(0, 10)}...
                  </span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {new Date(vote.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
