
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockCandidates, mockVotes, verifyUser, submitVote } from "../mockData";
import type { Candidate, Vote } from "../mockData";

// API hooks that will be connected to blockchain in the future
export function useCandidates() {
  return useQuery<Candidate[]>({
    queryKey: ["candidates"],
    queryFn: async () => {
      // This will be replaced with a blockchain API call
      return mockCandidates;
    },
  });
}

export function useVotes() {
  return useQuery<Vote[]>({
    queryKey: ["votes"],
    queryFn: async () => {
      // This will be replaced with a blockchain API call
      return mockVotes;
    },
  });
}

export function useVerifyUser() {
  return useMutation({
    mutationFn: async ({ nin, phoneNumber }: { nin: string; phoneNumber: string }) => {
      // This will be replaced with a blockchain API call
      return await verifyUser(nin, phoneNumber);
    }
  });
}

export function useSubmitVote() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      nin: string;
      phoneNumber: string;
      candidateId: number;
      otp: string;
    }) => {
      // This will be replaced with a blockchain API call
      return await submitVote(data);
    },
    onSuccess: () => {
      // Invalidate votes query to refresh data
      queryClient.invalidateQueries({ queryKey: ["votes"] });
    }
  });
}
