import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  nin: text("nin").notNull(),
  phoneNumber: text("phone_number").notNull(),
  hasVoted: boolean("has_voted").notNull().default(false),
});

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  party: text("party").notNull(),
  avatar: text("avatar").notNull(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").notNull(),
  voterHash: text("voter_hash").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  blockHeight: integer("block_height").notNull(),
  transactionHash: text("transaction_hash").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertVoteSchema = createInsertSchema(votes);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Vote = typeof votes.$inferSelect;
export type Candidate = typeof candidates.$inferSelect;
