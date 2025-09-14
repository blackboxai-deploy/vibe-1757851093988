"use client";

import { useEffect, useRef, useCallback } from 'react';

export function usePolling(callback: () => void | Promise<void>, interval: number, enabled = true) {
  const savedCallback = useRef<() => void | Promise<void>>(callback);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    const tick = async () => {
      if (savedCallback.current) {
        await savedCallback.current();
      }
    };

    if (enabled && interval > 0) {
      intervalRef.current = setInterval(tick, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, enabled]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const startPolling = useCallback(() => {
    if (!intervalRef.current && enabled && interval > 0) {
      const tick = async () => {
        if (savedCallback.current) {
          await savedCallback.current();
        }
      };
      intervalRef.current = setInterval(tick, interval);
    }
  }, [interval, enabled]);

  return { stopPolling, startPolling };
}