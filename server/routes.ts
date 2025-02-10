import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import crypto from 'crypto';

export function registerRoutes(app: Express): Server {
  app.get("/api/candidates", async (_req, res) => {
    const candidates = await storage.getCandidates();
    res.json(candidates);
  });

  app.get("/api/votes", async (_req, res) => {
    const votes = await storage.getVotes();
    res.json(votes);
  });

  app.post("/api/verify", async (req, res) => {
    const schema = z.object({
      nin: z.string().min(10),
      phoneNumber: z.string().min(10)
    });

    try {
      const { nin, phoneNumber } = schema.parse(req.body);
      const user = await storage.getUser(nin, phoneNumber);

      if (user?.hasVoted) {
        return res.status(400).json({ message: "User has already voted" });
      }

      // For testing, accept any 6-digit number as OTP
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post("/api/vote", async (req, res) => {
    const schema = z.object({
      nin: z.string().min(10),
      phoneNumber: z.string().min(10),
      candidateId: z.number(),
      otp: z.string().length(6)
    });

    try {
      const { nin, phoneNumber, candidateId, otp } = schema.parse(req.body);

      // For testing, accept any 6-digit OTP
      const isValidOtp = /^\d{6}$/.test(otp);
      if (!isValidOtp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      let user = await storage.getUser(nin, phoneNumber);
      if (!user) {
        user = await storage.createUser({ nin, phoneNumber });
      }

      if (user.hasVoted) {
        return res.status(400).json({ message: "User has already voted" });
      }

      const voterHash = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      const vote = await storage.createVote(candidateId, voterHash);

      res.json({ success: true, vote });
    } catch (error) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}