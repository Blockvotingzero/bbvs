import { Candidate, Vote } from "@/types/schema";

// Mock candidates data with placeholder avatars using data URLs
export const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "Bola Ahmed Tinubu",
    party: "APC",
  },
  {
    id: 2,
    name: "Peter Obi",
    party: "LP",
  },
  {
    id: 3,
    name: "Atiku Abubakar",
    party: "PDP",
  },
];

// Generate random transaction hash
const generateTransactionHash = () => {
  return '0x' + Array(64).fill(0).map(() => 
    Math.floor(Math.random() * 16).toString(16)).join('');
};

// Generate mock votes
export const generateMockVotes = (count: number = 200): Vote[] => {
  const votes: Vote[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const randomCandidateId = Math.floor(Math.random() * 3) + 1;
    const randomTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);

    votes.push({
      id: i + 1,
      candidateId: randomCandidateId,
      voterHash: generateTransactionHash(),
      timestamp: randomTime.toISOString(),
      blockHeight: 14000000 + i,
      transactionHash: generateTransactionHash()
    });
  }

  return votes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate and export votes
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

export const getVoteDistribution = (): Record<string, number> => {
  const distribution: Record<string, number> = {};
  mockCandidates.forEach(candidate => {
    distribution[candidate.party] = getVotesByCandidate(candidate.id).length;
  });
  return distribution;
};