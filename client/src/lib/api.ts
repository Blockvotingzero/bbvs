
import { staticCandidates, staticVotes } from '@/data/staticData';

export const fetchCandidates = async () => {
  return staticCandidates;
};

export const fetchVotes = async () => {
  return staticVotes;
};

export const castVote = async (data: { candidateId: number }) => {
  const newVote = {
    id: Date.now(),
    candidateId: data.candidateId,
    timestamp: new Date().toISOString(),
    transactionHash: generateRandomHash()
  };
  
  // Update local storage to persist votes
  const votes = JSON.parse(localStorage.getItem('votes') || '[]');
  votes.push(newVote);
  localStorage.setItem('votes', JSON.stringify(votes));
  
  // Update candidate votes
  const candidates = [...staticCandidates];
  const candidate = candidates.find(c => c.id === data.candidateId);
  if (candidate) {
    candidate.votes += 1;
    localStorage.setItem('candidates', JSON.stringify(candidates));
  }
  
  return newVote;
};

export const verifyUser = async (data: { nin: string; phone?: string }) => {
  // Static verification, always returns success
  localStorage.setItem('userNIN', data.nin);
  return { 
    success: true,
    message: 'User verified' 
  };
};

// Utility function to generate a random hash
function generateRandomHash() {
  return Array.from({ length: 64 }, () => 
    '0123456789abcdef'[Math.floor(Math.random() * 16)]
  ).join('');
}
