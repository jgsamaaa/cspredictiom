export type ProviderName = "PandaScore" | "GRID" | "Abios" | "Manual Stats";

export type MatchStatus = "scheduled" | "live" | "finished";

export type RecommendationAction =
  | "Bet Team A"
  | "Bet Team B"
  | "Wait Live"
  | "Avoid";

export type FormResult = "W" | "L";

export type TeamFormEntry = {
  opponent: string;
  result: FormResult;
  score: string;
  mapOrSeries: string;
  date: string;
};

export type PlayerStat = {
  name: string;
  role: string;
  imageUrl?: string;
  rating: number;
  adr: number;
  kast: number;
  impact: number;
  maps: number;
  headshotRate?: number;
  openingDuelRate?: number;
  clutchRating?: number;
};

export type TeamProfile = {
  id: string;
  name: string;
  shortName: string;
  region: string;
  rank: number;
  powerRating: number;
  form: TeamFormEntry[];
  players: PlayerStat[];
  rosterNotes: string[];
};

export type MapWinRate = {
  map: string;
  teamA: number;
  teamB: number;
  sampleA: number;
  sampleB: number;
  teamACTWinRate?: number;
  teamATWinRate?: number;
  teamBCTWinRate?: number;
  teamBTWinRate?: number;
  teamAPistolWinRate?: number;
  teamBPistolWinRate?: number;
  note?: string;
  aiNote?: string;
};

export type PreviousGame = {
  date: string;
  opponent: string;
  event: string;
  result: FormResult;
  score: string;
  maps: string[];
  sideNote?: string;
};

export type MapInfo = {
  map: string;
  state: "expected" | "picked" | "decider" | "unknown";
  lean: "teamA" | "teamB" | "even";
};

export type HeadToHeadEntry = {
  date: string;
  event: string;
  winner: string;
  score: string;
  maps: string[];
};

export type MarketSnapshot = {
  provider: ProviderName;
  capturedAt: string;
  teamAOdds?: number;
  teamBOdds?: number;
  note: string;
};

export type CSMatch = {
  id: string;
  providerMatchId?: string;
  providerSources: ProviderName[];
  dataFreshness: string;
  status: MatchStatus;
  startsAt: string;
  event: string;
  stage: string;
  bestOf: number;
  teamA: TeamProfile;
  teamB: TeamProfile;
  maps: MapInfo[];
  mapWinRates: MapWinRate[];
  previousGames?: {
    teamA: PreviousGame[];
    teamB: PreviousGame[];
  };
  headToHead: HeadToHeadEntry[];
  rosterNotes: string[];
  marketSnapshots: MarketSnapshot[];
};

export type AnalystResult = {
  matchId: string;
  generatedAt: string;
  summary: string;
  confidence: number;
  recommendedAction: RecommendationAction;
  teamAProbability: number;
  teamBProbability: number;
  mapInsights: Array<{
    map: string;
    teamAStatus: "strong" | "weak" | "even";
    teamBStatus: "strong" | "weak" | "even";
    edge: number;
    summary: string;
    suggestedAngle: string;
  }>;
  reasoning: string[];
  riskFlags: string[];
  dataSources: ProviderName[];
};

export type LiveSnapshot = {
  matchId: string;
  updatedAt: string;
  status: MatchStatus;
  currentMap: string;
  roundScore: string;
  teamAProbability: number;
  teamBProbability: number;
  momentum: string[];
};

export type BetResult = "pending" | "win" | "loss" | "push" | "void";

export type BetJournalEntry = {
  id: string;
  matchId: string;
  matchName: string;
  betType: string;
  odds: number;
  stake: number;
  predictionConfidence: number;
  result: BetResult;
  profitLoss: number;
  notes: string;
  team?: string;
  createdAt: string;
};

export type AnalyticsSummary = {
  totalBets: number;
  winRate: number;
  roi: number;
  netProfit: number;
  bestTeams: Array<{ name: string; profitLoss: number; bets: number }>;
  worstTeams: Array<{ name: string; profitLoss: number; bets: number }>;
  bestBetTypes: Array<{ name: string; roi: number; bets: number }>;
};

export type LearningProfile = {
  totalSettled: number;
  winRate: number;
  roi: number;
  averageConfidence: number;
  confidenceAdjustment: number;
  confidenceBuckets: Array<{
    label: string;
    bets: number;
    winRate: number;
    averageConfidence: number;
  }>;
  currentMatchSignals: string[];
  promptSummary: string;
};
