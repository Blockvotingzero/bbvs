import { type Vote, type Candidate } from "@shared/schema";

export const mockCandidates: Candidate[] = [
  { id: 1, name: "Bola Ahmed Tinubu", party: "Progressive Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=tinubu" },
  { id: 2, name: "Peter Obi", party: "Labour Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=obi" },
  { id: 3, name: "Atiku Abubakar", party: "People's Democratic Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=atiku" }
];

// Generate realistic voting distribution (1000 votes)
const generateMockVotes = (count: number) => {
  // Distribution weights (roughly 40%, 35%, 25%)
  const weights = [0.4, 0.35, 0.25];
  const votes: Vote[] = [];

  // Start time: 7 days ago
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 7);

  for (let i = 0; i < count; i++) {
    // Determine candidate based on weights
    const rand = Math.random();
    let candidateId = 1;
    if (rand > weights[0]) {
      candidateId = rand > (weights[0] + weights[1]) ? 3 : 2;
    }

    // Generate timestamp between start time and now
    const timestamp = new Date(startTime.getTime() + Math.random() * (Date.now() - startTime.getTime()));

    votes.push({
      id: i + 1,
      candidateId,
      voterHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      timestamp,
      blockHeight: 1000000 + i, // Simulating increasing block heights
      transactionHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    });
  }

  // Sort by timestamp
  return votes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const mockVotes = generateMockVotes(1000);