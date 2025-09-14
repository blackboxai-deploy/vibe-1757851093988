"use client";

import { MatchData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface MatchHeaderProps {
  matchData: MatchData;
  lastUpdate: Date;
}

export function MatchHeader({ matchData, lastUpdate }: MatchHeaderProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      live: 'bg-red-500 text-white animate-pulse',
      upcoming: 'bg-yellow-500 text-white',
      completed: 'bg-green-500 text-white'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.upcoming}>
        {status === 'live' ? '🔴 LIVE' : status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="bg-gradient-to-r from-blue-900/50 to-emerald-900/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={matchData.teams.team1.flag} 
              alt={`${matchData.teams.team1.name} flag`}
              className="w-8 h-6 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f1af9b1c-f80d-489f-bf09-574d5cb0553a.png" + matchData.teams.team1.shortName;
              }}
            />
            <span className="text-white font-semibold text-lg">
              {matchData.teams.team1.shortName}
            </span>
          </div>
          
          <div className="text-white/60 text-sm font-medium">VS</div>
          
          <div className="flex items-center gap-3">
            <img 
              src={matchData.teams.team2.flag} 
              alt={`${matchData.teams.team2.name} flag`}
              className="w-8 h-6 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6ce59b7c-2f62-4776-be05-7d09ce43f8ed.png" + matchData.teams.team2.shortName;
              }}
            />
            <span className="text-white font-semibold text-lg">
              {matchData.teams.team2.shortName}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:items-end gap-2">
          {getStatusBadge(matchData.status)}
          <div className="text-white/80 text-sm">
            {matchData.matchType} • {formatTime(matchData.startTime)}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-white/60">Venue:</span>
            <div className="text-white font-medium">{matchData.venue}</div>
          </div>
          
          {matchData.tossWinner && (
            <div>
              <span className="text-white/60">Toss:</span>
              <div className="text-white font-medium">
                {matchData.tossWinner} won, chose to {matchData.tossDecision}
              </div>
            </div>
          )}
          
          {matchData.weather && (
            <div>
              <span className="text-white/60">Weather:</span>
              <div className="text-white font-medium">
                {matchData.weather.condition}, {matchData.weather.temperature}°C
              </div>
            </div>
          )}
          
          <div>
            <span className="text-white/60">Last Updated:</span>
            <div className="text-white font-medium">
              {lastUpdate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}