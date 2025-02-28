import { 
  mockCandidates, 
  mockVotes, 
  verifyUser as mockVerifyUser,
  castVote as mockCastVote
} from './mockData';
import type { Candidate, Vote } from '@/types/schema';

// API client that uses the consolidated mock data
export const api = {
  getCandidates: async (): Promise<Candidate[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockCandidates];
  },

  getVotes: async (): Promise<Vote[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...mockVotes];
  },

  verifyUser: async (nin: string, phoneNumber: string): Promise<{success: boolean, otp: string}> => {
    return mockVerifyUser(nin, phoneNumber);
  },

  castVote: async (params: {
    nin: string;
    phoneNumber: string;
    candidateId: number;
    otp: string;
  }): Promise<{success: boolean, vote: Vote | null}> => {
    return mockCastVote(params);
  }
};