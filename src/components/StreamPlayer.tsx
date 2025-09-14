"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface StreamPlayerProps {
  isLive: boolean;
}

export function StreamPlayer({ isLive }: StreamPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quality, setQuality] = useState('HD');
  const [viewerCount] = useState(Math.floor(Math.random() * 50000) + 25000);
  const playerRef = useRef<HTMLDivElement>(null);

  const qualities = ['4K', 'HD', 'SD', 'Low'];

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && playerRef.current) {
      playerRef.current.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <Card className="bg-black/50 backdrop-blur-sm border-white/10">
      <CardContent className="p-0">
        <div ref={playerRef} className="relative group">
          {/* Video Player Area */}
          <div className="aspect-video bg-gradient-to-br from-blue-900/50 to-emerald-900/50 flex items-center justify-center relative overflow-hidden rounded-t-lg">
            {/* Background Stadium Image */}
            <div className="absolute inset-0">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b1a54db9-b38e-46e8-92e0-bd6b62fd31c5.png" 
                alt="Cricket stadium live view with floodlights and green pitch"
                className="w-full h-full object-cover opacity-60"
                onError={(e) => {
                  e.currentTarget.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e00dc01c-3984-48f4-948c-5b0ccf05e004.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            </div>

            {/* Live Indicator */}
            {isLive && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  LIVE
                </div>
              </div>
            )}

            {/* Viewer Count */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                👥 {viewerCount.toLocaleString()} viewers
              </div>
            </div>

            {/* Play/Pause Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="bg-black/70 rounded-full p-6">
                  <div className="w-0 h-0 border-l-[30px] border-l-white border-y-[20px] border-y-transparent ml-2" />
                </div>
              </div>
            )}

            {/* Control Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <div className="flex items-center justify-between">
                {/* Left Controls */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20 p-2"
                  >
                    {isPlaying ? (
                      <div className="flex gap-1">
                        <div className="w-1 h-4 bg-white" />
                        <div className="w-1 h-4 bg-white" />
                      </div>
                    ) : (
                      <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1" />
                    )}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20 p-2"
                    >
                      {isMuted || volume[0] === 0 ? '🔇' : volume[0] < 50 ? '🔉' : '🔊'}
                    </Button>
                    
                    <div className="w-20">
                      <Slider
                        value={isMuted ? [0] : volume}
                        onValueChange={(value) => {
                          setVolume(value);
                          if (value[0] > 0) setIsMuted(false);
                        }}
                        max={100}
                        step={1}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Controls */}
                <div className="flex items-center gap-3">
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="bg-black/50 text-white text-sm border border-white/20 rounded px-2 py-1"
                  >
                    {qualities.map((q) => (
                      <option key={q} value={q} className="bg-black text-white">{q}</option>
                    ))}
                  </select>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20 p-2"
                  >
                    {isFullscreen ? '⤢' : '⛶'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stream Info */}
          <div className="p-4 bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">
                  🏏 India vs Pakistan - LIVE Cricket Match
                </h3>
                <p className="text-white/70 text-sm">
                  T20I • Dubai International Cricket Stadium
                </p>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span>Quality: {quality}</span>
                <span>•</span>
                <span>Volume: {isMuted ? 0 : volume[0]}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}