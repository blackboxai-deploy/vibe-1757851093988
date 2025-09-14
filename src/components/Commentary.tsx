"use client";

import { Commentary as CommentaryType } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CommentaryProps {
  commentary: CommentaryType[];
}

export function Commentary({ commentary }: CommentaryProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCommentaryIcon = (comment: CommentaryType) => {
    if (comment.isWicket) return '🎯';
    if (comment.isBoundary && comment.runs === 6) return '🚀';
    if (comment.isBoundary && comment.runs === 4) return '🔥';
    if (comment.runs === 0) return '⚪';
    return '🏏';
  };

  const getCommentaryStyle = (comment: CommentaryType) => {
    if (comment.isWicket) return 'bg-red-500/20 border-red-500/30';
    if (comment.isBoundary && comment.runs === 6) return 'bg-purple-500/20 border-purple-500/30';
    if (comment.isBoundary && comment.runs === 4) return 'bg-green-500/20 border-green-500/30';
    return 'bg-white/5 border-white/10';
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          📺 Live Commentary
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px] px-6 pb-4">
          <div className="space-y-3">
            {commentary.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-white/40 text-sm">Loading commentary...</div>
              </div>
            ) : (
              commentary.map((comment) => (
                <div
                  key={comment.id}
                  className={`rounded-lg p-4 border transition-all duration-200 hover:scale-[1.02] ${getCommentaryStyle(comment)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl flex-shrink-0 mt-1">
                      {getCommentaryIcon(comment)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="bg-white/20 text-white px-2 py-1 rounded text-xs font-medium">
                            {comment.over}.{comment.ball}
                          </span>
                          
                          {comment.runs > 0 && (
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              comment.runs >= 6 ? 'bg-purple-500 text-white' :
                              comment.runs === 4 ? 'bg-green-500 text-white' :
                              'bg-blue-500 text-white'
                            }`}>
                              {comment.runs} run{comment.runs > 1 ? 's' : ''}
                            </span>
                          )}
                          
                          {comment.isWicket && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                              WICKET
                            </span>
                          )}
                        </div>
                        
                        <span className="text-white/50 text-xs flex-shrink-0">
                          {formatTime(comment.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-white text-sm leading-relaxed">
                        {comment.text}
                      </p>
                      
                      {comment.player && (
                        <div className="mt-2 text-white/70 text-xs">
                          <span className="font-medium">{comment.player}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}