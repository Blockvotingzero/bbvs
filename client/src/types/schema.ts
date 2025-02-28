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
  avatar: z.string().optional(), // Made optional since we're using placeholder images
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

// State schema for geographical data
export const stateSchema = z.object({
  id: z.string(),
  name: z.string(),
  votes: z.record(z.string(), z.number()).optional(),
});

export type User = z.infer<typeof userSchema>;
export type Candidate = z.infer<typeof candidateSchema>;
export type Vote = z.infer<typeof voteSchema>;
export type State = z.infer<typeof stateSchema>;
// Type definitions for the application

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
