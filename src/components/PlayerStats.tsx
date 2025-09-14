"use client";

import { MatchStats } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PlayerStatsProps {
  matchStats: MatchStats;
}

export function PlayerStats({ matchStats }: PlayerStatsProps) {
  const { partnerships, fallOfWickets, powerplayScores } = matchStats;

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white text-lg">📊 Match Statistics</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="partnerships" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="partnerships" className="text-white data-[state=active]:bg-blue-600">
              Partnerships
            </TabsTrigger>
            <TabsTrigger value="wickets" className="text-white data-[state=active]:bg-blue-600">
              Fall of Wickets
            </TabsTrigger>
            <TabsTrigger value="powerplay" className="text-white data-[state=active]:bg-blue-600">
              Powerplay
            </TabsTrigger>
          </TabsList>
          
          {/* Partnerships Tab */}
          <TabsContent value="partnerships" className="mt-4">
            <div className="space-y-3">
              {partnerships.length === 0 ? (
                <div className="text-center py-6 text-white/60">
                  No partnerships data available
                </div>
              ) : (
                partnerships.map((partnership, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-4 border ${
                      partnership.isActive
                        ? 'bg-green-500/20 border-green-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">
                          {partnership.player1} & {partnership.player2}
                        </span>
                        {partnership.isActive && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Runs:</span>
                        <div className="text-white font-medium text-lg">
                          {partnership.runs}
                        </div>
                      </div>
                      <div>
                        <span className="text-white/60">Balls:</span>
                        <div className="text-white font-medium text-lg">
                          {partnership.balls}
                        </div>
                      </div>
                      <div>
                        <span className="text-white/60">Run Rate:</span>
                        <div className="text-white font-medium text-lg">
                          {((partnership.runs / partnership.balls) * 6).toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Fall of Wickets Tab */}
          <TabsContent value="wickets" className="mt-4">
            <div className="space-y-3">
              {fallOfWickets.length === 0 ? (
                <div className="text-center py-6 text-white/60">
                  No wickets have fallen yet
                </div>
              ) : (
                fallOfWickets.map((wicket, index) => (
                  <div
                    key={index}
                    className="bg-red-500/20 border border-red-500/30 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-semibold">
                          {wicket.wicketNumber}. {wicket.player}
                        </span>
                        <div className="text-white/80 text-sm mt-1">
                          {wicket.howOut}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {wicket.runs}/{wicket.wicketNumber}
                        </div>
                        <div className="text-white/60 text-sm">
                          ({wicket.overs} ov)
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* Powerplay Tab */}
          <TabsContent value="powerplay" className="mt-4">
            <div className="space-y-3">
              {powerplayScores.map((powerplay, index) => (
                <div
                  key={index}
                  className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-semibold">
                      {powerplay.phase}
                    </span>
                    <span className="text-white/80 text-sm">
                      Overs {powerplay.overs}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Runs:</span>
                      <div className="text-white font-medium text-lg">
                        {powerplay.runs}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">Wickets:</span>
                      <div className="text-white font-medium text-lg">
                        {powerplay.wickets}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">Run Rate:</span>
                      <div className="text-white font-medium text-lg">
                        {powerplay.runRate.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}