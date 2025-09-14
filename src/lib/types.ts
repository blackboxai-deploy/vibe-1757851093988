export interface MatchData {
  id: string;
  status: 'live' | 'upcoming' | 'completed';
  teams: {
    team1: Team;
    team2: Team;
  };
  score: {
    team1: Score;
    team2: Score;
  };
  currentInnings: number;
  tossWinner?: string;
  tossDecision?: 'bat' | 'bowl';
  venue: string;
  matchType: string;
  startTime: string;
  weather?: WeatherInfo;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  flag: string;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  role: 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper';
  battingStats?: BattingStats;
  bowlingStats?: BowlingStats;
  isOnField: boolean;
}

export interface Score {
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  runRate: number;
  requiredRunRate?: number;
}

export interface BattingStats {
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isNotOut: boolean;
}

export interface BowlingStats {
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  balls: number;
}

export interface Commentary {
  id: string;
  over: number;
  ball: number;
  runs: number;
  text: string;
  timestamp: string;
  isWicket: boolean;
  isBoundary: boolean;
  player?: string;
}

export interface WeatherInfo {
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export interface LiveChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  country: 'in' | 'pk' | 'other';
}

export interface MatchStats {
  partnerships: Partnership[];
  fallOfWickets: FallOfWicket[];
  powerplayScores: PowerplayScore[];
}

export interface Partnership {
  runs: number;
  balls: number;
  player1: string;
  player2: string;
  isActive: boolean;
}

export interface FallOfWicket {
  wicketNumber: number;
  runs: number;
  overs: number;
  player: string;
  howOut: string;
}

export interface PowerplayScore {
  phase: string;
  overs: string;
  runs: number;
  wickets: number;
  runRate: number;
}