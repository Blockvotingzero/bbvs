
import { candidates, votes, verifyUser, castVote } from '../data/staticData';
import type { Candidate, Vote } from '../data/staticData';

// API client for static data
export const api = {
  getCandidates: async (): Promise<Candidate[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...candidates];
  },
  
  getVotes: async (): Promise<Vote[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...votes];
  },
  
  verifyUser: async (nin: string, phoneNumber: string) => {
    return await verifyUser(nin, phoneNumber);
  },
  
  castVote: async (params: {
    nin: string;
    phoneNumber: string;
    candidateId: number;
    otp: string;
  }) => {
    return await castVote(params);
  }
};
