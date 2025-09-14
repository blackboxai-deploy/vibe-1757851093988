"use client";

import { MatchData } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface ScoreCardProps {
  matchData: MatchData;
}

export function ScoreCard({ matchData }: ScoreCardProps) {
  const { teams, score, currentInnings } = matchData;
  
  const formatOvers = (overs: number, balls: number) => {
    if (balls === 0) return `${overs}.0`;
    return `${overs}.${balls}`;
  };

  const getCurrentBatsmen = (teamId: string) => {
    const team = teamId === teams.team1.id ? teams.team1 : teams.team2;
    return team.players
      .filter(player => player.isOnField && player.battingStats)
      .slice(0, 2);
  };

  const getCurrentBowler = () => {
    const bowlingTeam = currentInnings === 1 ? teams.team2 : teams.team1;
    return bowlingTeam.players.find(player => 
      player.bowlingStats && player.bowlingStats.balls > 0
    );
  };

  const team1Batting = currentInnings === 1;
  const currentScore = team1Batting ? score.team1 : score.team2;
  const currentTeam = team1Batting ? teams.team1 : teams.team2;
  const batsmen = getCurrentBatsmen(currentTeam.id);
  const bowler = getCurrentBowler();

  return (
    <div className="space-y-4">
      {/* Main Score Display */}
      <Card className="bg-gradient-to-r from-blue-800/30 to-emerald-800/30 backdrop-blur-sm border-white/10">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4 mb-2">
              <img 
                src={currentTeam.flag} 
                alt={`${currentTeam.name} flag`}
                className="w-10 h-8 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9601184d-cf70-4bf8-8be6-5b371ee439b4.png" + currentTeam.shortName;
                }}
              />
              <h2 className="text-2xl font-bold text-white">
                {currentTeam.name}
              </h2>
            </div>
            
            <div className="text-6xl font-bold text-white mb-2">
              {currentScore.runs}/{currentScore.wickets}
            </div>
            
            <div className="text-white/80 text-lg">
              ({formatOvers(currentScore.overs, currentScore.balls)} overs)
            </div>
            
            <div className="text-white/60 text-sm mt-2">
              Run Rate: {currentScore.runRate.toFixed(2)} 
              {currentScore.requiredRunRate && currentScore.requiredRunRate > 0 && (
                <span> • Required RR: {currentScore.requiredRunRate.toFixed(2)}</span>
              )}
            </div>
          </div>

          {/* Current Batsmen */}
          {batsmen.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {batsmen.map((batsman) => (
                <div key={batsman.id} className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-semibold">{batsman.name}</span>
                    {batsman.battingStats?.isNotOut && (
                      <span className="text-green-400 text-xs">NOT OUT</span>
                    )}
                  </div>
                  
                  {batsman.battingStats && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-white/60">Runs:</span>
                        <span className="text-white ml-2 font-medium">
                          {batsman.battingStats.runs}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">Balls:</span>
                        <span className="text-white ml-2 font-medium">
                          {batsman.battingStats.balls}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">4s/6s:</span>
                        <span className="text-white ml-2 font-medium">
                          {batsman.battingStats.fours}/{batsman.battingStats.sixes}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">SR:</span>
                        <span className="text-white ml-2 font-medium">
                          {batsman.battingStats.strikeRate.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Current Bowler */}
          {bowler && bowler.bowlingStats && (
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3">Current Bowler</h4>
              <div className="flex justify-between items-center">
                <span className="text-white">{bowler.name}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-white/80">
                    {bowler.bowlingStats.overs}-{bowler.bowlingStats.maidens}-{bowler.bowlingStats.runs}-{bowler.bowlingStats.wickets}
                  </span>
                  <span className="text-white/80">
                    Econ: {bowler.bowlingStats.economy.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Previous Innings (if available) */}
      {currentInnings === 2 && (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={teams.team1.flag} 
                  alt={`${teams.team1.name} flag`}
                  className="w-6 h-5 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b579a3ac-264e-4522-be29-bf3921df1a67.png" + teams.team1.shortName;
                  }}
                />
                <span className="text-white font-medium">{teams.team1.shortName}</span>
              </div>
              <div className="text-white font-semibold">
                {score.team1.runs}/{score.team1.wickets} 
                <span className="text-white/60 ml-2">
                  ({formatOvers(score.team1.overs, score.team1.balls)})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}