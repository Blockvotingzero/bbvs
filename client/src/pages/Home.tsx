import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCandidates, useVotes } from "@/hooks/useApi";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import NigeriaMap from "@/components/NigeriaMap";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: candidates = [] } = useCandidates();
  const { data: votes = [] } = useVotes();

  const totalVotes = votes.length;

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Secure Blockchain Voting System
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          A transparent and secure way to cast your vote using blockchain technology
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border rounded-lg p-6">
            <div className="text-4xl font-bold mb-2">{candidates.length}</div>
            <div className="text-muted-foreground">Candidates</div>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <div className="text-4xl font-bold mb-2">{totalVotes}</div>
            <div className="text-muted-foreground">Votes Cast</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => setLocation("/liveness-check")}>
            Cast Your Vote
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => setLocation("/results")}
          >
            View Results
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {candidates.map(candidate => (
          <Card key={candidate.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle>{candidate.name}</CardTitle>
              <div className="text-sm text-muted-foreground">{candidate.party}</div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current votes</span>
                <span className="text-sm font-medium">{candidate.votes}</span>
              </div>
              <Progress value={candidate.percentage} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}