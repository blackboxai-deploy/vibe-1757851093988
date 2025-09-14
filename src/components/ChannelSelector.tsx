"use client";

import { useState, useEffect } from 'react';
import { StreamingChannel, ChannelCategory } from '@/lib/streaming-types';
import { streamingService } from '@/lib/streaming-service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChannelSelectorProps {
  onChannelSelect: (channel: StreamingChannel) => void;
  selectedChannel?: StreamingChannel;
}

export function ChannelSelector({ onChannelSelect, selectedChannel }: ChannelSelectorProps) {
  const [categories, setCategories] = useState<ChannelCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StreamingChannel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChannelCategories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchChannels();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadChannelCategories = async () => {
    try {
      setLoading(true);
      const channelCategories = await streamingService.getChannelCategories();
      setCategories(channelCategories);
    } catch (error) {
      console.error('Error loading channel categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchChannels = async () => {
    try {
      const results = await streamingService.searchChannels(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching channels:', error);
    }
  };

  const ChannelCard = ({ channel }: { channel: StreamingChannel }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
        selectedChannel?.id === channel.id 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-white/10 bg-white/5 hover:bg-white/10'
      }`}
      onClick={() => onChannelSelect(channel)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <img 
            src={channel.logo} 
            alt={`${channel.name} logo`}
            className="w-16 h-12 object-cover rounded border border-white/20"
            onError={(e) => {
              e.currentTarget.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/dee6d089-e1ea-44cf-a804-c18f88eb8716.png}`;
            }}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white font-semibold text-sm truncate">
                {channel.name}
              </h3>
              {channel.isLive && (
                <Badge className="bg-red-500 text-white text-xs animate-pulse">
                  LIVE
                </Badge>
              )}
            </div>
            
            <p className="text-white/70 text-xs mb-2 line-clamp-2">
              {channel.description}
            </p>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-white/50">
                  {channel.viewerCount.toLocaleString()} viewers
                </span>
                <span className="text-white/30">•</span>
                <span className="text-white/50">
                  {channel.quality[0]?.resolution || 'HD'}
                </span>
              </div>
              
              <div className="flex gap-1">
                {channel.language.slice(0, 2).map((lang) => (
                  <Badge 
                    key={lang} 
                    variant="outline" 
                    className="text-xs px-1 py-0 text-white/60 border-white/20"
                  >
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
            
            {channel.currentProgram && (
              <div className="mt-2 p-2 bg-white/5 rounded text-xs">
                <div className="text-white font-medium">
                  {channel.currentProgram.title}
                </div>
                {channel.currentProgram.isLive && (
                  <div className="text-red-400 text-xs mt-1">
                    🔴 Live Now
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white/60">Loading channels...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-white text-xl font-bold mb-2">
          🏏 Select Cricket Channel
        </h2>
        <p className="text-white/70 text-sm mb-4">
          Choose from multiple live streaming channels for India-Pakistan cricket
        </p>
        
        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchResults.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </div>
      )}

      {/* Channel Categories */}
      {!searchQuery && (
        <Tabs defaultValue="cricket" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="text-white data-[state=active]:bg-blue-600"
              >
                {category.icon} {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-4">
              <div className="mb-4">
                <h3 className="text-white font-semibold">
                  {category.name} ({category.channels.length})
                </h3>
                <p className="text-white/60 text-sm">
                  {category.description}
                </p>
              </div>
              
              {category.channels.length === 0 ? (
                <div className="text-center py-8 text-white/50">
                  No channels available in this category
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.channels.map((channel) => (
                    <ChannelCard key={channel.id} channel={channel} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => loadChannelCategories()}
          className="text-white border-white/20 hover:bg-white/10"
        >
          🔄 Refresh Channels
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSearchQuery('India Pakistan')}
          className="text-white border-white/20 hover:bg-white/10"
        >
          🏏 India-Pakistan Channels
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSearchQuery('live')}
          className="text-white border-white/20 hover:bg-white/10"
        >
          🔴 Live Channels Only
        </Button>
      </div>
    </div>
  );
}