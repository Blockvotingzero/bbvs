import { Candidate, Vote } from "@/types/schema";

export const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "Bola Ahmed Tinubu",
    party: "APC",
    avatar: "https://example.com/tinubu.jpg",
  },
  {
    id: 2,
    name: "Atiku Abubakar",
    party: "PDP",
    avatar: "https://example.com/atiku.jpg",
  },
  {
    id: 3,
    name: "Peter Obi",
    party: "LP",
    avatar: "https://example.com/obi.jpg",
  },
];

export const generateMockVotes = (count: number = 50): Vote[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    candidateId: mockCandidates[Math.floor(Math.random() * mockCandidates.length)].id,
    voterHash: `0x${Math.random().toString(16).slice(2)}`,
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    blockHeight: Math.floor(Math.random() * 1000000) + 1,
    transactionHash: `0x${Math.random().toString(16).slice(2)}`,
  }));
};

export const mockVotes = generateMockVotes();

// Helper functions
export const getCandidateById = (id: number): Candidate | undefined => {
  return mockCandidates.find(candidate => candidate.id === id);
};

export const getVotesByCandidate = (candidateId: number): Vote[] => {
  return mockVotes.filter(vote => vote.candidateId === candidateId);
};

export const getTotalVotes = (): number => {
  return mockVotes.length;
};

export const getVoteDistribution = (): Record<number, number> => {
  return mockVotes.reduce((acc, vote) => {
    acc[vote.candidateId] = (acc[vote.candidateId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
};
