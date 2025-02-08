import { type User, type InsertUser, type Vote, type Candidate, users, candidates, votes } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import crypto from 'crypto';

export interface IStorage {
  getUser(nin: string, phoneNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getCandidates(): Promise<Candidate[]>;
  getVotes(): Promise<Vote[]>;
  createVote(candidateId: number, voterHash: string): Promise<Vote>;
}

export class DatabaseStorage implements IStorage {
  async getUser(nin: string, phoneNumber: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.nin, nin), eq(users.phoneNumber, phoneNumber)));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCandidates(): Promise<Candidate[]> {
    return db.select().from(candidates);
  }

  async getVotes(): Promise<Vote[]> {
    return db.select().from(votes);
  }

  async createVote(candidateId: number, voterHash: string): Promise<Vote> {
    const [vote] = await db
      .insert(votes)
      .values({
        candidateId,
        voterHash,
        blockHeight: Math.floor(Math.random() * 1000000), // Mock block height
        transactionHash: Array.from(crypto.getRandomValues(new Uint8Array(32)))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('') // Generate a random transaction hash
      })
      .returning();
    return vote;
  }
}

// Initialize the candidates
async function initializeCandidates() {
  const existingCandidates = await db.select().from(candidates);
  if (existingCandidates.length === 0) {
    await db.insert(candidates).values([
      { name: "John Doe", party: "Progressive Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=john" },
      { name: "Jane Smith", party: "Conservative Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=jane" },
      { name: "Mike Johnson", party: "Liberty Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=mike" }
    ]);
  }
}

export const storage = new DatabaseStorage();
initializeCandidates().catch(console.error);