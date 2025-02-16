import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";

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

      // Mock OTP verification - in production this would send a real SMS
      res.json({ success: true, otp: "123456" });
    } catch (error) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post("/api/vote", async (req, res) => {
    const schema = z.object({
      nin: z.string().min(10),
      phoneNumber: z.string().min(10),
      candidateId: z.number(),
      otp: z.string()
    });

    try {
      const { nin, phoneNumber, candidateId, otp } = schema.parse(req.body);
      
      if (otp !== "123456") {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      let user = await storage.getUser(nin, phoneNumber);
      if (!user) {
        user = await storage.createUser({ nin, phoneNumber });
      }

      if (user.hasVoted) {
        return res.status(400).json({ message: "User has already voted" });
      }

      const voterHash = Math.random().toString(36).substring(2, 15);
      const blockHeight = Math.floor(Math.random() * 1000000);
      const transactionHash = "0x" + Math.random().toString(36).substring(2, 42);
      
      const vote = {
        id: Math.floor(Math.random() * 1000000),
        candidateId,
        voterHash,
        blockHeight,
        transactionHash,
        timestamp: new Date().toISOString()
      };
      
      await storage.updateUser(nin, phoneNumber, true);
      res.json({ success: true, vote });
    } catch (error) {
      console.error("Vote error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to process vote" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
