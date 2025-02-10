import { type User, type InsertUser, type Vote, type Candidate } from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  getUser(nin: string, phoneNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getCandidates(): Promise<Candidate[]>;
  getVotes(): Promise<Vote[]>;
  createVote(candidateId: number, voterHash: string): Promise<Vote>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private candidates: Map<number, Candidate>;
  private votes: Map<number, Vote>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.candidates = new Map();
    this.votes = new Map();
    this.currentId = 1;

    // Initialize mock candidates
    const mockCandidates: Candidate[] = [
      { id: 1, name: "John Doe", party: "Progressive Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=john" },
      { id: 2, name: "Jane Smith", party: "Conservative Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=jane" },
      { id: 3, name: "Mike Johnson", party: "Liberty Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=mike" }
    ];

    mockCandidates.forEach(candidate => {
      this.candidates.set(candidate.id, candidate);
    });
  }

  async getUser(nin: string, phoneNumber: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      user => user.nin === nin && user.phoneNumber === phoneNumber
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, hasVoted: false };
    this.users.set(id, user);
    return user;
  }

  async getCandidates(): Promise<Candidate[]> {
    return Array.from(this.candidates.values());
  }

  async getVotes(): Promise<Vote[]> {
    return Array.from(this.votes.values());
  }

  async createVote(candidateId: number, voterHash: string): Promise<Vote> {
    const id = this.currentId++;
    const vote: Vote = {
      id,
      candidateId,
      voterHash,
      timestamp: new Date(),
      blockHeight: Math.floor(Math.random() * 1000000),
      transactionHash: nanoid(64)
    };
    this.votes.set(id, vote);
    return vote;
  }
}

export const storage = new MemStorage();
