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
  votes: number;
  image: string;
}

export interface Vote {
  id: number;
  candidateId: number;
  timestamp: string;
  transactionHash: string;
}

export const staticCandidates: Candidate[] = [
  {
    id: 1,
    name: "Bola Tinubu",
    party: "APC",
    votes: 124,
    image: "https://placekitten.com/200/200?1"
  },
  {
    id: 2,
    name: "Peter Obi",
    party: "LP",
    votes: 98,
    image: "https://placekitten.com/200/200?2"
  },
  {
    id: 3,
    name: "Atiku Abubakar",
    party: "PDP",
    votes: 87,
    image: "https://placekitten.com/200/200?3"
  }
];

export const staticVotes: Vote[] = [
  {
    id: 1,
    candidateId: 1,
    timestamp: "2023-10-01T12:00:00Z",
    transactionHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"
  },
  {
    id: 2,
    candidateId: 2,
    timestamp: "2023-10-01T12:15:00Z",
    transactionHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3"
  },
  {
    id: 3,
    candidateId: 3,
    timestamp: "2023-10-01T12:30:00Z",
    transactionHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4"
  }
];

// Initialize local storage with static data if it doesn't exist
export const initializeLocalStorage = () => {
  if (!localStorage.getItem('candidates')) {
    localStorage.setItem('candidates', JSON.stringify(staticCandidates));
  }

  if (!localStorage.getItem('votes')) {
    localStorage.setItem('votes', JSON.stringify(staticVotes));
  }
};

// Mock verification function (simulates server verification)  - now uses local storage
export const verifyUser = async (nin: string, phoneNumber: string): Promise<{success: boolean, otp: string}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  //  In a real app, you would verify against a database or other secure method.
  // This is a placeholder for simplicity.
  return { success: true, otp: "123456" };
};

// Mock voting function (simulates server vote) - now uses local storage
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
  
  const candidates = JSON.parse(localStorage.getItem('candidates') || '[]') as Candidate[];
  const candidateIndex = candidates.findIndex(c => c.id === params.candidateId);

  if(candidateIndex === -1) {
    return {success: false, vote: null};
  }

  candidates[candidateIndex].votes++;
  localStorage.setItem('candidates', JSON.stringify(candidates));

  const newVote: Vote = {
    id: (JSON.parse(localStorage.getItem('votes') || '[]') as Vote[]).length + 1,
    candidateId: params.candidateId,
    timestamp: new Date().toISOString(),
    transactionHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
  };
  localStorage.setItem('votes', JSON.stringify([...JSON.parse(localStorage.getItem('votes') || '[]') as Vote[], newVote]));

  return { success: true, vote: newVote };
};