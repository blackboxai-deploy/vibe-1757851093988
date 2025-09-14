"use client";

import { useState, useEffect } from 'react';
import { StreamingChannel, LiveMatch } from '@/lib/streaming-types';
import { streamingService } from '@/lib/streaming-service';
import { useLiveMatch } from '@/hooks/use-live-match';
import { ChannelSelector } from './ChannelSelector';
import { VideoPlayer } from './VideoPlayer';
import { MatchHeader } from './MatchHeader';
import { ScoreCard } from './ScoreCard';
import { Commentary } from './Commentary';
import { PlayerStats } from './PlayerStats';
import { LiveChat } from './LiveChat';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function LiveMatch() {
  const [selectedChannel, setSelectedChannel] = useState<StreamingChannel | null>(null);
  const [showChannelSelector, setShowChannelSelector] = useState(true);
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(true);

  const {
    matchData,
    commentary,
    matchStats,
    liveChat,
    loading,
    error,
    lastUpdate,
    refetch
  } = useLiveMatch();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setChannelsLoading(true);
      
      // Load live matches
      const matches = await streamingService.getCurrentMatches();
      setLiveMatches(matches);
      
      // Auto-select first cricket channel if available
      const cricketChannels = await streamingService.getChannelsByCategory('cricket');
      if (cricketChannels.length > 0) {
        setSelectedChannel(cricketChannels[0]);
        setShowChannelSelector(false);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setChannelsLoading(false);
    }
  };

  const handleChannelSelect = (channel: StreamingChannel) => {
    setSelectedChannel(channel);
    setShowChannelSelector(false);
  };

  const handleChannelChange = () => {
    setShowChannelSelector(true);
  };

  if (channelsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading Cricket Streaming Platform...</div>
          <div className="text-white/60 text-sm mt-2">
            Fetching live channels and matches...
          </div>
        </div>
      </div>
    );
  }

  // Show channel selector if no channel selected
  if (showChannelSelector || !selectedChannel) {
    return (
      <div className="min-h-screen p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Platform Header */}
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              🏏 Cricket Live Streaming Platform
            </h1>
            <p className="text-white/70 text-lg">
              Watch India vs Pakistan and other cricket matches from multiple channels
            </p>
            
            {/* Live Matches Banner */}
            {liveMatches.length > 0 && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Badge className="bg-red-500 text-white animate-pulse">
                    🔴 LIVE NOW
                  </Badge>
                  <span className="text-white font-semibold">
                    {liveMatches.length} Live Match{liveMatches.length > 1 ? 'es' : ''}
                  </span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {liveMatches.map((match) => (
                    <div key={match.id} className="text-white/90 text-sm bg-white/10 px-3 py-1 rounded">
                      {match.teams.team1} vs {match.teams.team2}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <ChannelSelector 
            onChannelSelect={handleChannelSelect}
            selectedChannel={selectedChannel}
          />
        </div>
      </div>
    );
  }

  if (loading && !matchData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading live match data...</div>
          <div className="text-white/60 text-sm mt-2">
            Connecting to cricket servers...
          </div>
        </div>
      </div>
    );
  }

  if (error && !matchData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <div className="text-white text-xl mb-2">Unable to load match data</div>
          <div className="text-white/60 text-sm mb-6">{error}</div>
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={refetch}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
            <Button 
              onClick={handleChannelChange}
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10"
            >
              Change Channel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Match Info */}
        {matchData && <MatchHeader matchData={matchData} lastUpdate={lastUpdate} />}
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Video Player & Score */}
          <div className="xl:col-span-2 space-y-6">
            {/* Video Player */}
            <VideoPlayer 
              channel={selectedChannel}
              onChannelChange={handleChannelChange}
            />
            
            {/* Live Score Card */}
            {matchData && <ScoreCard matchData={matchData} />}
            
            {/* Live Matches Info */}
            {liveMatches.length > 0 && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    🔴 Live Matches Today
                    <Badge className="bg-red-500 text-white text-xs">
                      {liveMatches.length}
                    </Badge>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {liveMatches.map((match) => (
                      <div key={match.id} className="bg-white/5 rounded-lg p-3">
                        <div className="text-white font-medium text-sm mb-1">
                          {match.teams.team1} vs {match.teams.team2}
                        </div>
                        <div className="text-white/60 text-xs">
                          {match.venue} • {match.matchType}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs ${
                            match.status === 'live' ? 'bg-red-500 text-white' :
                            match.status === 'upcoming' ? 'bg-yellow-500 text-white' :
                            'bg-green-500 text-white'
                          }`}>
                            {match.status.toUpperCase()}
                          </Badge>
                          {match.streamingChannels.length > 0 && (
                            <span className="text-white/50 text-xs">
                              {match.streamingChannels.length} channels
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Player Statistics */}
            {matchStats && (
              <PlayerStats matchStats={matchStats} />
            )}
          </div>
          
          {/* Right Column - Commentary & Chat */}
          <div className="space-y-6">
            {/* Live Commentary */}
            <Commentary commentary={commentary} />
            
            {/* Live Chat */}
            <LiveChat messages={liveChat} />
          </div>
        </div>
        
        {/* Error Banner */}
        {error && matchData && (
          <div className="fixed bottom-4 right-4 bg-red-600/90 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
            <div className="text-sm">
              ⚠️ Connection issues - using cached data
            </div>
          </div>
        )}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="fixed bottom-4 left-4 bg-blue-600/90 text-white px-4 py-2 rounded-lg backdrop-blur-sm flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <div className="text-sm">Updating...</div>
          </div>
        )}
        
        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/10">
          <div className="text-center text-white/60 text-sm">
            <div className="mb-2">
              🏏 Production Cricket Streaming Platform with Real API Integration
            </div>
            <div className="text-xs">
              Multiple channels • Live API data • Real-time updates
            </div>
            <div className="text-xs mt-2">
              Currently watching: <span className="text-white font-medium">{selectedChannel.name}</span> • 
              Last updated: {lastUpdate.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}