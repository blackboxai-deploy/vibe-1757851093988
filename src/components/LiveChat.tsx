"use client";

import { useState, useRef, useEffect } from 'react';
import { LiveChatMessage } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LiveChatProps {
  messages: LiveChatMessage[];
}

export function LiveChat({ messages }: LiveChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [localMessages, setLocalMessages] = useState<LiveChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Combine prop messages with local messages
  const allMessages = [...messages, ...localMessages].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: LiveChatMessage = {
      id: `local-${Date.now()}`,
      user: 'You',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      country: 'other'
    };

    setLocalMessages(prev => [message, ...prev]);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCountryFlag = (country: string) => {
    switch (country) {
      case 'in': return '🇮🇳';
      case 'pk': return '🇵🇰';
      default: return '🌍';
    }
  };

  const getMessageStyle = (country: string, isUser = false) => {
    if (isUser) return 'bg-blue-500/20 border-blue-500/30';
    switch (country) {
      case 'in': return 'bg-orange-500/20 border-orange-500/30';
      case 'pk': return 'bg-green-500/20 border-green-500/30';
      default: return 'bg-white/5 border-white/10';
    }
  };

  // Auto-scroll to show latest messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [allMessages]);

  return (
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          💬 Live Chat
          <span className="text-sm text-white/60 font-normal">
            ({allMessages.length} messages)
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-[580px]">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4">
          <div ref={scrollRef} className="space-y-3 pb-4">
            {allMessages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-white/40 text-sm">No messages yet...</div>
              </div>
            ) : (
              allMessages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-lg p-3 border transition-all duration-200 ${getMessageStyle(
                    message.country,
                    message.user === 'You'
                  )}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">
                      {getCountryFlag(message.country)}
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-medium text-sm truncate">
                          {message.user}
                        </span>
                        <span className="text-white/50 text-xs flex-shrink-0">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-white/90 text-sm leading-relaxed break-words">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t border-white/10 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              maxLength={200}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              Send
            </Button>
          </form>
          
          <div className="text-xs text-white/40 mt-2">
            Join the conversation! Support your team! 🏏
          </div>
        </div>
      </CardContent>
    </Card>
  );
}