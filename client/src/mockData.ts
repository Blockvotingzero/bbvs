
// This file contains mock data that will be replaced by blockchain API calls in the future

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

export const mockCandidates: Candidate[] = [
  { id: 1, name: "Bola Ahmed Tinubu", party: "Progressive Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=tinubu" },
  { id: 2, name: "Peter Obi", party: "Labour Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=obi" },
  { id: 3, name: "Atiku Abubakar", party: "People's Democratic Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=atiku" }
];

// Generate mock votes
export const mockVotes: Vote[] = Array.from({ length: 1000 }, (_, i) => {
  const candidateId = Math.floor(Math.random() * 3) + 1;
  const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
  return {
    id: i + 1,
    candidateId,
    voterHash: `0x${Math.random().toString(36).substring(2, 42)}`,
    timestamp,
    blockHeight: 1000000 + i,
    transactionHash: `0x${Math.random().toString(36).substring(2, 64)}`
  };
});

// Mock verification function - will be replaced by blockchain API call
export async function verifyUser(nin: string, phoneNumber: string): Promise<{ success: boolean, otp: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, otp: "123456" });
    }, 1000);
  });
}

// Mock vote submission - will be replaced by blockchain API call
export async function submitVote(data: {
  nin: string;
  phoneNumber: string;
  candidateId: number;
  otp: string;
}): Promise<{ success: boolean, vote: Vote }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const vote = {
        id: Math.floor(Math.random() * 1000000),
        candidateId: data.candidateId,
        voterHash: Math.random().toString(36).substring(2, 15),
        blockHeight: Math.floor(Math.random() * 1000000),
        transactionHash: "0x" + Math.random().toString(36).substring(2, 42),
        timestamp: new Date().toISOString()
      };
      
      resolve({ success: true, vote });
    }, 1500);
  });
}
export interface Candidate {
  id: number;
  name: string;
  party: string;
  avatar: string;
  bio: string;
}

export interface Vote {
  id: number;
  candidateId: number;
  voterHash: string;
  timestamp: string;
  blockHeight: number;
  transactionHash: string;
}

// Mock candidate data
export const candidates: Candidate[] = [
  {
    id: 1,
    name: "Jane Smith",
    party: "Progressive Party",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Jane",
    bio: "Experienced lawmaker focused on healthcare reform and education."
  },
  {
    id: 2,
    name: "John Doe",
    party: "Liberty Alliance",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=John",
    bio: "Business leader and advocate for fiscal responsibility and economic growth."
  },
  {
    id: 3,
    name: "Alex Johnson",
    party: "Unity Coalition",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Alex",
    bio: "Community organizer with a platform focused on environmental sustainability."
  }
];

// Generate mock votes
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

// Mock votes data
export const votes: Vote[] = generateMockVotes();

// Mock verification function (simulates blockchain verification)
export const verifyUser = async (nin: string, phoneNumber: string): Promise<{success: boolean, otp: string}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, otp: "123456" };
};

// Mock submit vote function (simulates blockchain transaction)
export const submitVote = async (candidateId: number): Promise<{success: boolean, txHash: string}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { 
    success: true, 
    txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
  };
};
