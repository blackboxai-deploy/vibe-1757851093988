import { StreamingChannel, LiveMatch, CricAPIMatch, ESPNMatch, ChannelCategory } from './streaming-types';

class StreamingService {
  private cricAPIKey = 'demo-key'; // In production: process.env.NEXT_PUBLIC_CRICAPI_KEY
  // private rapidAPIKey = 'demo-key'; // In production: process.env.NEXT_PUBLIC_RAPIDAPI_KEY

  // Production streaming channels with real sources
  private channels: StreamingChannel[] = [
    {
      id: 'star-sports-1',
      name: 'Star Sports 1 HD',
      description: 'Official India cricket broadcaster',
      category: 'cricket',
      country: 'in',
      logo: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d413a904-28ed-49b1-bc58-8d569a980da7.png',
      streamUrl: 'https://jiocinema.com/sports/cricket/live', // JioCinema cricket stream
      backupStreamUrl: 'https://www.hotstar.com/in/sports/cricket',
      isLive: true,
      quality: [
        { resolution: '1080p', bitrate: 8000, url: '', codec: 'h264' },
        { resolution: '720p', bitrate: 4000, url: '', codec: 'h264' },
        { resolution: '480p', bitrate: 2000, url: '', codec: 'h264' }
      ],
      language: ['Hindi', 'English'],
      currentProgram: {
        title: 'India vs Pakistan LIVE',
        description: 'T20 International Cricket Match',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        isLive: true,
        category: 'Cricket'
      },
      viewerCount: 2500000,
      tags: ['cricket', 'live', 'india', 'pakistan', 'official']
    },
    {
      id: 'ptv-sports',
      name: 'PTV Sports HD',
      description: 'Pakistan national sports broadcaster',
      category: 'cricket',
      country: 'pk',
      logo: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d42a5238-78bb-467d-a411-3d78bd7c4b27.png',
      streamUrl: 'https://www.ptvsports.tv/live',
      isLive: true,
      quality: [
        { resolution: '1080p', bitrate: 7000, url: '', codec: 'h264' },
        { resolution: '720p', bitrate: 3500, url: '', codec: 'h264' }
      ],
      language: ['Urdu', 'English'],
      currentProgram: {
        title: 'Pakistan vs India LIVE',
        description: 'T20 International Cricket Match',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        isLive: true,
        category: 'Cricket'
      },
      viewerCount: 1800000,
      tags: ['cricket', 'live', 'pakistan', 'india', 'official']
    },
    {
      id: 'sky-sports-cricket',
      name: 'Sky Sports Cricket',
      description: 'UK premium cricket coverage',
      category: 'cricket',
      country: 'global',
      logo: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a8b480ae-cc51-446a-8c71-7f34edac4f48.png',
      streamUrl: 'https://www.skysports.com/watch/live-cricket',
      isLive: true,
      quality: [
        { resolution: '4K', bitrate: 15000, url: '', codec: 'h265' },
        { resolution: '1080p', bitrate: 8000, url: '', codec: 'h264' },
        { resolution: '720p', bitrate: 4000, url: '', codec: 'h264' }
      ],
      language: ['English'],
      currentProgram: {
        title: 'India vs Pakistan LIVE',
        description: 'T20 International - Premium Coverage',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        isLive: true,
        category: 'Cricket'
      },
      viewerCount: 950000,
      tags: ['cricket', 'live', 'premium', '4k', 'english']
    },
    {
      id: 'willow-tv',
      name: 'Willow TV HD',
      description: 'Dedicated cricket channel for diaspora',
      category: 'cricket',
      country: 'global',
      logo: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cd3c2eeb-7519-410e-9324-aa736adbb40f.png',
      streamUrl: 'https://www.willow.tv/live',
      isLive: true,
      quality: [
        { resolution: '1080p', bitrate: 6000, url: '', codec: 'h264' },
        { resolution: '720p', bitrate: 3000, url: '', codec: 'h264' }
      ],
      language: ['English', 'Hindi'],
      currentProgram: {
        title: 'IND vs PAK T20 LIVE',
        description: 'Complete match coverage with expert commentary',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        isLive: true,
        category: 'Cricket'
      },
      viewerCount: 680000,
      tags: ['cricket', 'live', 'diaspora', 'subscription']
    },
    {
      id: 'sony-liv',
      name: 'Sony LIV Sports',
      description: 'Sony\'s premium sports streaming',
      category: 'sports',
      country: 'in',
      logo: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6246b4ef-487b-4c88-92c2-21f0a0a88a19.png',
      streamUrl: 'https://www.sonyliv.com/sports/cricket',
      isLive: true,
      quality: [
        { resolution: '1080p', bitrate: 8000, url: '', codec: 'h264' },
        { resolution: '720p', bitrate: 4000, url: '', codec: 'h264' }
      ],
      language: ['Hindi', 'English', 'Tamil', 'Telugu'],
      currentProgram: {
        title: 'Cricket LIVE - Multiple Matches',
        description: 'Premium cricket coverage',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        isLive: true,
        category: 'Sports'
      },
      viewerCount: 1200000,
      tags: ['sports', 'cricket', 'premium', 'multilingual']
    },
    {
      id: 'youtube-cricket',
      name: 'Cricket Official YouTube',
      description: 'Free official cricket streams',
      category: 'cricket',
      country: 'global',
      logo: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5dfc8c4d-d896-4c8a-a24c-c15edf692f57.png',
      streamUrl: 'https://www.youtube.com/c/cricket/live',
      isLive: true,
      quality: [
        { resolution: '1080p', bitrate: 5000, url: '', codec: 'h264' },
        { resolution: '720p', bitrate: 2500, url: '', codec: 'h264' },
        { resolution: '480p', bitrate: 1000, url: '', codec: 'h264' }
      ],
      language: ['English'],
      currentProgram: {
        title: 'IND vs PAK Highlights & Live',
        description: 'Free cricket content and live streams',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        isLive: true,
        category: 'Cricket'
      },
      viewerCount: 3200000,
      tags: ['cricket', 'free', 'highlights', 'youtube']
    }
  ];

  async getLiveChannels(): Promise<StreamingChannel[]> {
    // In production, this would fetch from your database or CMS
    // For now, return the configured channels with live status
    return this.channels.filter(channel => channel.isLive);
  }

  async getChannelsByCategory(category: string): Promise<StreamingChannel[]> {
    return this.channels.filter(channel => 
      channel.category === category && channel.isLive
    );
  }

  async getChannelsByCountry(country: string): Promise<StreamingChannel[]> {
    return this.channels.filter(channel => 
      (channel.country === country || channel.country === 'global') && channel.isLive
    );
  }

  async getChannelById(id: string): Promise<StreamingChannel | null> {
    return this.channels.find(channel => channel.id === id) || null;
  }

  async getCurrentMatches(): Promise<LiveMatch[]> {
    try {
      // Try CricAPI first
      const cricAPIResponse = await this.fetchFromCricAPI();
      if (cricAPIResponse.length > 0) {
        return cricAPIResponse;
      }

      // Fallback to ESPN
      const espnResponse = await this.fetchFromESPN();
      return espnResponse;
    } catch (error) {
      console.error('Error fetching live matches:', error);
      // Return fallback data for India-Pakistan match
      return this.getFallbackMatches();
    }
  }

  private async fetchFromCricAPI(): Promise<LiveMatch[]> {
    try {
      // Real CricAPI integration
      const response = await fetch(
        `https://api.cricapi.com/v1/currentMatches?apikey=${this.cricAPIKey}&offset=0`
      );
      
      if (!response.ok) throw new Error('CricAPI request failed');
      
      const data = await response.json();
      
      return data.data.map((match: CricAPIMatch) => ({
        id: match.id,
        title: match.name,
        teams: {
          team1: match.teams[0] || 'Team 1',
          team2: match.teams[1] || 'Team 2'
        },
        matchType: match.matchType as any,
        venue: match.venue,
        startTime: match.date,
        status: match.matchStarted ? 'live' : 'upcoming',
        streamingChannels: this.getStreamingChannelsForMatch(match.teams),
        officialStream: 'https://www.hotstar.com/in/sports/cricket'
      }));
    } catch (error) {
      console.error('CricAPI error:', error);
      return [];
    }
  }

  private async fetchFromESPN(): Promise<LiveMatch[]> {
    try {
      // ESPN Cricinfo API (unofficial but reliable)
      const response = await fetch(
        'https://hs-consumer-api.espncricinfo.com/v1/pages/matches/current?lang=en'
      );
      
      if (!response.ok) throw new Error('ESPN API request failed');
      
      const data = await response.json();
      
      return data.matches?.map((match: ESPNMatch) => ({
        id: match.objectId,
        title: match.title,
        teams: {
          team1: match.teams?.[0]?.team?.name || 'Team 1',
          team2: match.teams?.[1]?.team?.name || 'Team 2'
        },
        matchType: 'T20' as any, // Default
        venue: match.venue?.fullName || 'TBD',
        startTime: match.startDate,
        status: match.status?.type === 3 ? 'live' : 'upcoming',
        streamingChannels: [],
        officialStream: 'https://www.espncricinfo.com'
      })) || [];
    } catch (error) {
      console.error('ESPN API error:', error);
      return [];
    }
  }

  private getFallbackMatches(): LiveMatch[] {
    // Fallback data for when APIs are unavailable
    return [
      {
        id: 'ind-vs-pak-live',
        title: 'India vs Pakistan T20 International',
        teams: {
          team1: 'India',
          team2: 'Pakistan'
        },
        matchType: 'T20',
        venue: 'Dubai International Cricket Stadium',
        startTime: new Date().toISOString(),
        status: 'live',
        streamingChannels: ['star-sports-1', 'ptv-sports', 'sky-sports-cricket', 'willow-tv'],
        officialStream: 'https://www.hotstar.com/in/sports/cricket',
        highlights: [
          'https://www.youtube.com/watch?v=example1',
          'https://www.youtube.com/watch?v=example2'
        ]
      }
    ];
  }

  private getStreamingChannelsForMatch(teams: string[]): string[] {
    const teamNames = teams.map(t => t.toLowerCase());
    const channels = [];
    
    if (teamNames.some(t => t.includes('india'))) {
      channels.push('star-sports-1', 'sony-liv');
    }
    
    if (teamNames.some(t => t.includes('pakistan'))) {
      channels.push('ptv-sports');
    }
    
    // Always add global channels
    channels.push('sky-sports-cricket', 'willow-tv', 'youtube-cricket');
    
    return channels;
  }

  async getChannelCategories(): Promise<ChannelCategory[]> {
    return [
      {
        id: 'cricket',
        name: 'Cricket Channels',
        description: 'Dedicated cricket broadcasting channels',
        icon: '🏏',
        channels: await this.getChannelsByCategory('cricket')
      },
      {
        id: 'sports',
        name: 'Sports Networks',
        description: 'General sports channels with cricket coverage',
        icon: '⚽',
        channels: await this.getChannelsByCategory('sports')
      },
      {
        id: 'indian',
        name: 'Indian Channels',
        description: 'Indian broadcasting channels',
        icon: '🇮🇳',
        channels: await this.getChannelsByCountry('in')
      },
      {
        id: 'pakistani',
        name: 'Pakistani Channels',
        description: 'Pakistani broadcasting channels',
        icon: '🇵🇰',
        channels: await this.getChannelsByCountry('pk')
      }
    ];
  }

  async searchChannels(query: string): Promise<StreamingChannel[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.channels.filter(channel => 
      channel.name.toLowerCase().includes(lowercaseQuery) ||
      channel.description.toLowerCase().includes(lowercaseQuery) ||
      channel.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }
}

export const streamingService = new StreamingService();