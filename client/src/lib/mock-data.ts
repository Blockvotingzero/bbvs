import { type Vote, type Candidate } from "@shared/schema";

export const mockCandidates: Candidate[] = [
  { id: 1, name: "John Doe", party: "Progressive Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=john" },
  { id: 2, name: "Jane Smith", party: "Conservative Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=jane" },
  { id: 3, name: "Mike Johnson", party: "Liberty Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=mike" }
];

export const mockVotes: Vote[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  candidateId: Math.floor(Math.random() * 3) + 1,
  voterHash: `voter_${i}`,
  timestamp: new Date(Date.now() - Math.random() * 10000000),
  blockHeight: Math.floor(Math.random() * 1000000),
  transactionHash: `tx_${i}`
}));
