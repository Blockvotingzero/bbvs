import { mockCandidates, mockVotes, generateMockVotes } from './mockData';
import type { User, Candidate, Vote } from '@/types/schema';

// Mock API client that uses static data
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
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock verification - always succeeds with a fixed OTP for demo
    return { success: true, otp: "123456" };
  },

  castVote: async (params: {
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

    // Create a new mock vote
    const newVote: Vote = {
      id: mockVotes.length + 1,
      candidateId: params.candidateId,
      voterHash: `0x${Math.random().toString(16).slice(2)}`,
      timestamp: new Date().toISOString(),
      blockHeight: Math.floor(Math.random() * 1000000) + 1,
      transactionHash: `0x${Math.random().toString(16).slice(2)}`
    };

    return { success: true, vote: newVote };
  }
};