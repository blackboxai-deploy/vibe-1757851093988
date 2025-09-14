export interface StreamingChannel {
  id: string;
  name: string;
  description: string;
  category: 'cricket' | 'sports' | 'news' | 'entertainment';
  country: 'in' | 'pk' | 'global';
  logo: string;
  streamUrl: string;
  backupStreamUrl?: string;
  isLive: boolean;
  quality: StreamQuality[];
  language: string[];
  currentProgram?: CurrentProgram;
  viewerCount: number;
  tags: string[];
}

export interface StreamQuality {
  resolution: '4K' | '1080p' | '720p' | '480p' | '360p';
  bitrate: number;
  url: string;
  codec: string;
}

export interface CurrentProgram {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isLive: boolean;
  category: string;
}

export interface LiveMatch {
  id: string;
  title: string;
  teams: {
    team1: string;
    team2: string;
  };
  matchType: 'Test' | 'ODI' | 'T20' | 'T10';
  venue: string;
  startTime: string;
  status: 'upcoming' | 'live' | 'completed';
  streamingChannels: string[]; // Channel IDs
  officialStream?: string;
  highlights?: string[];
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
  source: string;
}

export interface CricAPIMatch {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  teams: string[];
  score: any[];
  series_id: string;
  fantasyEnabled: boolean;
  bbbEnabled: boolean;
  hasSquad: boolean;
  matchStarted: boolean;
  matchEnded: boolean;
}

export interface ESPNMatch {
  objectId: string;
  title: string;
  description: string;
  teams: Array<{
    team: {
      id: string;
      name: string;
      abbreviation: string;
    };
    score: {
      innings: Array<{
        runs: number;
        wickets: number;
        overs: number;
      }>;
    };
  }>;
  status: {
    type: number;
    description: string;
  };
  venue: {
    fullName: string;
  };
  startDate: string;
}

export interface StreamingSource {
  id: string;
  name: string;
  type: 'youtube' | 'twitch' | 'direct' | 'hls' | 'm3u8';
  url: string;
  embedUrl?: string;
  apiKey?: string;
  isOfficial: boolean;
  quality: StreamQuality[];
  geoRestrictions?: string[];
  requiresAuth: boolean;
}

export interface ChannelCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  channels: StreamingChannel[];
}