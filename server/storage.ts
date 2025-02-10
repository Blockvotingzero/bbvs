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
      { id: 1, name: "Bola Ahmed Tinubu", party: "Progressive Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=tinubu" },
      { id: 2, name: "Peter Obi", party: "Labour Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=obi" },
      { id: 3, name: "Atiku Abubakar", party: "People's Democratic Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=atiku" }
    ];

    mockCandidates.forEach(candidate => {
      this.candidates.set(candidate.id, candidate);
    });

    // Initialize with mock votes
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - 7);

    // Generate 1000 mock votes with realistic distribution
    for (let i = 0; i < 1000; i++) {
      const rand = Math.random();
      let candidateId = 1;
      if (rand > 0.4) {
        candidateId = rand > 0.75 ? 3 : 2;
      }

      const timestamp = new Date(startTime.getTime() + Math.random() * (Date.now() - startTime.getTime()));
      const vote: Vote = {
        id: i + 1,
        candidateId,
        voterHash: `0x${nanoid(40)}`,
        timestamp,
        blockHeight: 1000000 + i,
        transactionHash: `0x${nanoid(64)}`
      };

      this.votes.set(vote.id, vote);
      this.currentId = Math.max(this.currentId, vote.id + 1);
    }
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
    return Array.from(this.votes.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  async createVote(candidateId: number, voterHash: string): Promise<Vote> {
    const id = this.currentId++;
    const vote: Vote = {
      id,
      candidateId,
      voterHash,
      timestamp: new Date(),
      blockHeight: Math.max(...Array.from(this.votes.values()).map(v => v.blockHeight)) + 1,
      transactionHash: `0x${nanoid(64)}`
    };
    this.votes.set(id, vote);
    return vote;
  }
}

export const storage = new MemStorage();