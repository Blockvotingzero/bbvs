import { type Vote, type Candidate } from "@shared/schema";

export const mockCandidates: Candidate[] = [
  { id: 1, name: "Bola Ahmed Tinubu", party: "Progressive Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=tinubu" },
  { id: 2, name: "Peter Obi", party: "Labour Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=obi" },
  { id: 3, name: "Atiku Abubakar", party: "People's Democratic Party", avatar: "https://api.dicebear.com/7.x/avatars/svg?seed=atiku" }
];

// Generate realistic voting distribution (1000 votes)
const stateVotes = {
  "Abia": {"APC": 563, "LP": 57, "PDP": 380},
  "Adamawa": {"APC": 406, "LP": 281, "PDP": 313},
  "Akwa Ibom": {"APC": 462, "LP": 228, "PDP": 310},
  "Anambra": {"APC": 435, "LP": 104, "PDP": 461},
  "Bauchi": {"APC": 573, "LP": 379, "PDP": 48},
  "Bayelsa": {"APC": 539, "LP": 44, "PDP": 417},
  "Benue": {"APC": 551, "LP": 216, "PDP": 233},
  "Borno": {"APC": 408, "LP": 30, "PDP": 562},
  "Cross River": {"APC": 423, "LP": 223, "PDP": 354},
  "Delta": {"APC": 459, "LP": 517, "PDP": 24},
  "Ebonyi": {"APC": 554, "LP": 13, "PDP": 433},
  "Edo": {"APC": 543, "LP": 101, "PDP": 356},
  "Ekiti": {"APC": 583, "LP": 332, "PDP": 85},
  "Enugu": {"APC": 579, "LP": 279, "PDP": 142},
  "Gombe": {"APC": 507, "LP": 112, "PDP": 381},
  "Imo": {"APC": 514, "LP": 301, "PDP": 185},
  "Jigawa": {"APC": 471, "LP": 6, "PDP": 523},
  "Kaduna": {"APC": 594, "LP": 81, "PDP": 325},
  "Kano": {"APC": 578, "LP": 216, "PDP": 206},
  "Katsina": {"APC": 487, "LP": 284, "PDP": 229},
  "Kebbi": {"APC": 439, "LP": 220, "PDP": 341},
  "Kogi": {"APC": 595, "LP": 172, "PDP": 233},
  "Kwara": {"APC": 426, "LP": 94, "PDP": 480},
  "Lagos": {"APC": 497, "LP": 49, "PDP": 454},
  "Nasarawa": {"APC": 491, "LP": 433, "PDP": 76},
  "Niger": {"APC": 488, "LP": 270, "PDP": 242},
  "Ogun": {"APC": 411, "LP": 470, "PDP": 119},
  "Ondo": {"APC": 537, "LP": 63, "PDP": 400},
  "Osun": {"APC": 496, "LP": 40, "PDP": 464},
  "Oyo": {"APC": 541, "LP": 150, "PDP": 309},
  "Plateau": {"APC": 560, "LP": 316, "PDP": 124},
  "Rivers": {"APC": 492, "LP": 295, "PDP": 213},
  "Sokoto": {"APC": 449, "LP": 71, "PDP": 480},
  "Taraba": {"APC": 411, "LP": 233, "PDP": 356},
  "Yobe": {"APC": 597, "LP": 148, "PDP": 255},
  "Zamfara": {"APC": 420, "LP": 238, "PDP": 342}
};

const generateMockVotes = () => {
  const votes: Vote[] = [];
  let id = 1;

  // Start time: 7 days ago
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 7);

  // Generate votes based on state statistics
  Object.values(stateVotes).forEach(stateVote => {
    // APC votes
    for (let i = 0; i < stateVote.APC; i++) {
      votes.push(createVote(id++, 1, startTime));
    }
    // LP votes
    for (let i = 0; i < stateVote.LP; i++) {
      votes.push(createVote(id++, 2, startTime));
    }
    // PDP votes
    for (let i = 0; i < stateVote.PDP; i++) {
      votes.push(createVote(id++, 3, startTime));
    }
  });

  return votes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const createVote = (id: number, candidateId: number, startTime: Date): Vote => {
  return {
    id,
    candidateId,
    voterHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    timestamp: new Date(startTime.getTime() + Math.random() * (Date.now() - startTime.getTime())),
    blockHeight: 1000000 + id,
    transactionHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
  };
};

export const mockVotes = generateMockVotes();