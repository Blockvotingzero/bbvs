import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.number(),
  nin: z.string(),
  phoneNumber: z.string(),
  hasVoted: z.boolean(),
});

// Candidate schema
export const candidateSchema = z.object({
  id: z.number(),
  name: z.string(),
  party: z.string(),
  avatar: z.string(),
});

// Vote schema
export const voteSchema = z.object({
  id: z.number(),
  candidateId: z.number(),
  voterHash: z.string(),
  timestamp: z.string(),
  blockHeight: z.number(),
  transactionHash: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type Candidate = z.infer<typeof candidateSchema>;
export type Vote = z.infer<typeof voteSchema>;
