"use client";

import { useState, useRef, useEffect } from 'react';
import { StreamingChannel } from '@/lib/streaming-types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface VideoPlayerProps {
  channel: StreamingChannel;
  onChannelChange: () => void;
}

export function VideoPlayer({ channel, onChannelChange }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState(channel.quality[0]?.resolution || '1080p');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    // Simulate loading when channel changes
    setIsLoading(true);
    setHasError(false);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [channel.id]);

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

  const getEmbedUrl = (channel: StreamingChannel) => {
    // Convert streaming URLs to embeddable formats when possible
    if (channel.streamUrl.includes('youtube.com')) {
      const videoId = channel.streamUrl.split('v=')[1] || channel.streamUrl.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1`;
    } else if (channel.streamUrl.includes('jiocinema.com')) {
      return 'https://www.jiocinema.com/embed/sports/cricket/live';
    } else if (channel.streamUrl.includes('hotstar.com')) {
      return 'https://www.hotstar.com/in/sports/cricket/embed';
    } else if (channel.streamUrl.includes('ptvsports.tv')) {
      return 'https://www.ptvsports.tv/live/embed';
    }
    
    // For other streams, show custom player interface
    return null;
  };

  const embedUrl = getEmbedUrl(channel);

  return (
    <Card className="bg-black/50 backdrop-blur-sm border-white/10">
      <CardContent className="p-0">
        <div ref={playerRef} className="relative group">
          {/* Main Video Area */}
          <div className="aspect-video bg-gradient-to-br from-blue-900/50 to-emerald-900/50 flex items-center justify-center relative overflow-hidden rounded-t-lg">
            
            {/* Channel Header */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {channel.isLive && (
                  <Badge className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </Badge>
                )}
                
                <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <img 
                    src={channel.logo} 
                    alt={channel.name}
                    className="w-6 h-4 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5eb952c4-c69c-497e-99df-b5dafe392a9a.png}`;
                    }}
                  />
                  {channel.name}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  👥 {channel.viewerCount.toLocaleString()}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onChannelChange}
                  className="bg-black/70 text-white hover:bg-black/80 px-3 py-1 rounded-full text-sm"
                >
                  📺 Change Channel
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                <div className="text-white text-lg">Loading {channel.name}...</div>
                <div className="text-white/60 text-sm mt-2">
                  Connecting to stream server...
                </div>
              </div>
            )}

            {/* Error State */}
            {hasError && !isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/70">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <div className="text-white text-xl mb-2">Stream Unavailable</div>
                <div className="text-white/60 text-sm mb-4 text-center">
                  Unable to load {channel.name}. This might be due to geo-restrictions<br />
                  or the stream being temporarily unavailable.
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => { setHasError(false); setIsLoading(true); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Retry
                  </Button>
                  <Button 
                    onClick={onChannelChange}
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    Try Another Channel
                  </Button>
                </div>
              </div>
            )}

            {/* Embedded Stream or Placeholder */}
            {!isLoading && !hasError && (
              <>
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    onError={() => setHasError(true)}
                  />
                ) : (
                  <>
                    {/* Custom Stream Interface */}
                    <div className="absolute inset-0">
                      <img 
                        src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c135b854-6019-4b2f-bbee-29551bcf4d7c.png" 
                        alt="Live cricket match broadcasting from professional stadium with multiple cameras"
                        className="w-full h-full object-cover opacity-80"
                        onError={(e) => {
                          e.currentTarget.src = "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/f4823a5b-d22f-40dc-a708-f11e659777ce.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                    </div>

                    {/* Stream Info Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      <div className="text-center bg-black/70 backdrop-blur-sm p-6 rounded-lg">
                        <div className="text-white text-2xl font-bold mb-2">
                          🏏 {channel.currentProgram?.title || 'Live Cricket'}
                        </div>
                        <div className="text-white/80 mb-4">
                          {channel.currentProgram?.description || channel.description}
                        </div>
                        <Button 
                          onClick={() => window.open(channel.streamUrl, '_blank')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Watch on {channel.name}
                        </Button>
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
                  </>
                )}
              </>
            )}

            {/* Control Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
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
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                    className="bg-black/50 text-white text-sm border border-white/20 rounded px-2 py-1"
                  >
                    {channel.quality.map((q) => (
                      <option key={q.resolution} value={q.resolution} className="bg-black text-white">
                        {q.resolution}
                      </option>
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

          {/* Stream Info Panel */}
          <div className="p-4 bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <img 
                  src={channel.logo} 
                  alt={channel.name}
                  className="w-8 h-6 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c7b0da3d-90c1-4576-8841-289988584596.png}`;
                  }}
                />
                <div>
                  <h3 className="text-white font-semibold">
                    {channel.name}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {channel.currentProgram?.title || channel.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-white/70">
                <span>{selectedQuality}</span>
                <span>•</span>
                <span>{channel.language.join(', ')}</span>
                <span>•</span>
                <span>{channel.viewerCount.toLocaleString()} viewers</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}