
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
