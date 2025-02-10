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

// Initialize the candidates with dummy votes
async function initializeCandidates() {
  const existingCandidates = await db.select().from(candidates);
  if (existingCandidates.length === 0) {
    // First insert candidates
    await db.insert(candidates).values([
      { name: "Bola Ahmed Tinubu", party: "All Progressives Congress", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=tinubu" },
      { name: "Peter Obi", party: "Labour Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=obi" },
      { name: "Atiku Abubakar", party: "Peoples Democratic Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=atiku" }
    ]);

    // Then add some dummy votes
    const candidates = await db.select().from(candidates);
    const dummyVotes = [];

    // Generate random votes for each candidate
    for (let i = 0; i < 100; i++) {
      const candidateId = candidates[Math.floor(Math.random() * candidates.length)].id;
      dummyVotes.push({
        candidateId,
        voterHash: `dummy_voter_${i}`,
        blockHeight: Math.floor(Math.random() * 1000000),
        transactionHash: Array.from(crypto.getRandomValues(new Uint8Array(32)))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      });
    }

    await db.insert(votes).values(dummyVotes);
  }
}

export const storage = new DatabaseStorage();
initializeCandidates().catch(console.error);