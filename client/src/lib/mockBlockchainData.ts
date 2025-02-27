
// Mock blockchain data to simulate blockchain interactions
export interface MockVote {
  transactionHash: string;
  candidateId: number;
  timestamp: string;
  blockNumber: number;
}

export interface MockCandidate {
  id: number;
  name: string;
  party: string;
  votes: number;
}

// Generate random transaction hash
const generateTransactionHash = () => {
  return '0x' + Array(64).fill(0).map(() => 
    Math.floor(Math.random() * 16).toString(16)).join('');
};

// Generate mock votes
const generateMockVotes = (count: number): MockVote[] => {
  const votes: MockVote[] = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const randomCandidateId = Math.floor(Math.random() * 3) + 1;
    const randomTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    votes.push({
      transactionHash: generateTransactionHash(),
      candidateId: randomCandidateId,
      timestamp: randomTime.toISOString(),
      blockNumber: 14000000 + Math.floor(Math.random() * 50000)
    });
  }
  
  return votes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Mock candidates
const mockCandidates: MockCandidate[] = [
  { id: 1, name: "Bola Ahmed Tinubu", party: "APC", votes: 0 },
  { id: 2, name: "Peter Obi", party: "LP", votes: 0 },
  { id: 3, name: "Atiku Abubakar", party: "PDP", votes: 0 }
];

// Generate 200 mock votes
const mockVotes = generateMockVotes(200);

// Update candidate vote counts
mockVotes.forEach(vote => {
  const candidate = mockCandidates.find(c => c.id === vote.candidateId);
  if (candidate) {
    candidate.votes += 1;
  }
});

export const getVotes = (): MockVote[] => {
  return mockVotes;
};

export const getCandidates = (): MockCandidate[] => {
  return mockCandidates;
};

export const castVote = (candidateId: number): Promise<MockVote> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newVote: MockVote = {
        transactionHash: generateTransactionHash(),
        candidateId,
        timestamp: new Date().toISOString(),
        blockNumber: 14050000 + Math.floor(Math.random() * 1000)
      };
      
      mockVotes.unshift(newVote);
      
      const candidate = mockCandidates.find(c => c.id === candidateId);
      if (candidate) {
        candidate.votes += 1;
      }
      
      resolve(newVote);
    }, 1500); // Simulate blockchain confirmation time
  });
};
