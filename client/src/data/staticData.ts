
// Static mock data for the voting application
export interface User {
  id: number;
  nin: string;
  phoneNumber: string;
  hasVoted: boolean;
}

export interface Candidate {
  id: number;
  name: string;
  party: string;
  avatar: string;
}

export interface Vote {
  id: number;
  candidateId: number;
  voterHash: string;
  timestamp: string;
  blockHeight: number;
  transactionHash: string;
}

// Mock candidates data
export const candidates: Candidate[] = [
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

// Generate mock votes data
const generateMockVotes = (): Vote[] => {
  const votes: Vote[] = [];
  let id = 1;
  
  // Start time: 7 days ago
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 7);
  
  // Generate random votes
  for (let i = 0; i < 1000; i++) {
    const candidateId = Math.floor(Math.random() * 3) + 1;
    
    // Generate timestamp between start time and now
    const timestamp = new Date(
      startTime.getTime() + Math.random() * (Date.now() - startTime.getTime())
    ).toISOString();

    votes.push({
      id: id++,
      candidateId,
      voterHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      timestamp,
      blockHeight: 1000000 + i, // Simulating increasing block heights
      transactionHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    });
  }

  // Sort by timestamp, most recent first
  return votes.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Generate and export votes
export const votes: Vote[] = generateMockVotes();

// Mock verification function (simulates server verification)
export const verifyUser = async (nin: string, phoneNumber: string): Promise<{success: boolean, otp: string}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, otp: "123456" };
};

// Mock voting function (simulates server vote)
export const castVote = async (params: {
  nin: string, 
  phoneNumber: string, 
  candidateId: number, 
  otp: string
}): Promise<{success: boolean, vote: Vote | null}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (params.otp !== "123456") {
    return { success: false, vote: null };
  }
  
  const newVote: Vote = {
    id: votes.length + 1,
    candidateId: params.candidateId,
    voterHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    timestamp: new Date().toISOString(),
    blockHeight: 1000000 + votes.length,
    transactionHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
  };
  
  return { success: true, vote: newVote };
};
