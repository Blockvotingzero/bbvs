
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
        const updated = [nextVote, ...prev].slice(0, 5);
        return updated;
      });
      currentIndex = (currentIndex + 1) % votes.length;
    }, 3000);

    return () => clearInterval(interval);
  }, [votes]);

  return (
    <div className="h-[200px] overflow-hidden">
      <h3 className="text-lg font-semibold mb-2">Live Votes</h3>
      {displayedVotes.map((vote, i) => (
        <div
          key={`${vote.id}-${i}`}
          className="bg-card p-3 rounded-lg mb-2 text-sm animate-slide-in"
        >
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs">
              {vote.transactionHash.slice(0, 10)}...
            </span>
            <span className="text-muted-foreground text-xs">
              {new Date(vote.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
