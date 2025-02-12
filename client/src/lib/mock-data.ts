import { type Vote, type Candidate } from "@shared/schema";

export const mockCandidates: Candidate[] = [
  { id: 1, name: "Bola Ahmed Tinubu", party: "Progressive Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=tinubu" },
  { id: 2, name: "Peter Obi", party: "Labour Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=obi" },
  { id: 3, name: "Atiku Abubakar", party: "People's Democratic Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=atiku" }
];

export const mockVotes: Vote[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  candidateId: Math.floor(Math.random() * 3) + 1,
  voterHash: `voter_${i}`,
  timestamp: new Date(Date.now() - Math.random() * 10000000),
  blockHeight: Math.floor(Math.random() * 1000000),
  transactionHash: `tx_${i}`
}));