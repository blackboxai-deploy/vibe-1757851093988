"use client";

import { useState, useEffect, useCallback } from 'react';
import { MatchData, Commentary, MatchStats, LiveChatMessage } from '@/lib/types';
import { cricketAPI } from '@/lib/cricket-api';
import { usePolling } from './use-polling';

export function useLiveMatch() {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [commentary, setCommentary] = useState<Commentary[]>([]);
  const [matchStats, setMatchStats] = useState<MatchStats | null>(null);
  const [liveChat, setLiveChat] = useState<LiveChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchMatchData = useCallback(async () => {
    try {
      const data = await cricketAPI.getLiveMatch();
      setMatchData(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching match data:', err);
      setError('Failed to fetch live match data');
    }
  }, []);

  const fetchCommentary = useCallback(async () => {
    try {
      const data = await cricketAPI.getCommentary();
      setCommentary(data);
    } catch (err) {
      console.error('Error fetching commentary:', err);
    }
  }, []);

  const fetchMatchStats = useCallback(async () => {
    try {
      const data = await cricketAPI.getMatchStats();
      setMatchStats(data);
    } catch (err) {
      console.error('Error fetching match stats:', err);
    }
  }, []);

  const fetchLiveChat = useCallback(async () => {
    try {
      const data = await cricketAPI.getLiveChat();
      setLiveChat(data);
    } catch (err) {
      console.error('Error fetching live chat:', err);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchMatchData(),
        fetchCommentary(),
        fetchMatchStats(),
        fetchLiveChat()
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchMatchData, fetchCommentary, fetchMatchStats, fetchLiveChat]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Set up polling for live updates (every 30 seconds)
  usePolling(fetchMatchData, 30000, matchData?.status === 'live');
  
  // Commentary updates more frequently (every 15 seconds)
  usePolling(fetchCommentary, 15000, matchData?.status === 'live');
  
  // Chat updates frequently (every 10 seconds)
  usePolling(fetchLiveChat, 10000, matchData?.status === 'live');

  return {
    matchData,
    commentary,
    matchStats,
    liveChat,
    loading,
    error,
    lastUpdate,
    refetch: fetchAllData
  };
}