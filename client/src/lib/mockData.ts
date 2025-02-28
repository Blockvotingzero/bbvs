
import type { User, Candidate, Vote } from '@/types/schema';

// Mock candidates data
export const mockCandidates: Candidate[] = [
  { 
    id: 1, 
    name: "Bola Ahmed Tinubu", 
    party: "APC", 
    avatar: "https://avatars.githubusercontent.com/u/1?v=4" 
  },
  { 
    id: 2, 
    name: "Peter Obi", 
    party: "LP", 
    avatar: "https://avatars.githubusercontent.com/u/2?v=4" 
  },
  { 
    id: 3, 
    name: "Atiku Abubakar", 
    party: "PDP", 
    avatar: "https://avatars.githubusercontent.com/u/3?v=4" 
  }
];

// Utility function to generate transaction hashes
export const generateTransactionHash = (): string => {
  return '0x' + Array(64).fill(0).map(() => 
    Math.floor(Math.random() * 16).toString(16)).join('');
};

// Generate mock votes with consistent properties
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

  return votes.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Generate and export votes
export const mockVotes = generateMockVotes();

// Helper functions
export const getCandidateById = (id: number): Candidate | undefined => {
  return mockCandidates.find(c => c.id === id);
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

// Mock verification function
export const verifyUser = async (nin: string, phoneNumber: string): Promise<{success: boolean, otp: string}> => {
  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Mock verification - always succeeds with a fixed OTP for demo
  return { success: true, otp: "123456" };
};

// Mock voting function with consistent behavior
export const castVote = async (params: {
  nin: string;
  phoneNumber: string;
  candidateId: number;
  otp: string;
}): Promise<{success: boolean, vote: Vote | null}> => {
  // Simulate voting delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock validation
  if (params.otp !== "123456") {
    return { success: false, vote: null };
  }
  
  // Create a new vote with consistent properties
  const newVote: Vote = {
    id: mockVotes.length + 1,
    candidateId: params.candidateId,
    voterHash: generateTransactionHash(),
    timestamp: new Date().toISOString(),
    blockHeight: 14050000 + mockVotes.length,
    transactionHash: generateTransactionHash()
  };
  
  // Add to mock votes (in a real app, this would be persisted)
  mockVotes.unshift(newVote);
  
  return { success: true, vote: newVote };
};
