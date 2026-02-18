import { useRef, useCallback } from 'react';
import { generateTts, TtsError } from './useElevenLabs';
import type { Rooster, VoiceSettings } from '../types';

interface UseAudioPlayerOptions {
  apiKey: string;
  voiceId: string;
  voiceSettings: VoiceSettings;
  onNeedKey: () => void;
  onSandboxBlocked: () => void;
}

interface AudioCache {
  [key: string]: string;
}

export function useAudioPlayer({
  apiKey,
  voiceId,
  voiceSettings,
  onNeedKey,
  onSandboxBlocked,
}: UseAudioPlayerOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef<AudioCache>({});
  const currentIdxRef = useRef<number | null>(null);

  const getCacheKey = useCallback((idx: number) => {
    return `${idx}_${voiceId}_${voiceSettings.stability}_${voiceSettings.style}`;
  }, [voiceId, voiceSettings.stability, voiceSettings.style]);

  const isInCache = useCallback((idx: number) => {
    return !!cacheRef.current[getCacheKey(idx)];
  }, [getCacheKey]);

  const clearCache = useCallback(() => {
    Object.values(cacheRef.current).forEach(url => {
      try { URL.revokeObjectURL(url); } catch { /* ignore */ }
    });
    cacheRef.current = {};
  }, []);

  const play = useCallback(async (
    rooster: Rooster,
    idx: number,
    callbacks: {
      onStart: (idx: number) => void;
      onEnd: (idx: number) => void;
      onError: (idx: number, msg: string) => void;
      onLoadStart: (idx: number) => void;
      onLoadEnd: (idx: number) => void;
    }
  ) => {
    if (!apiKey) { onNeedKey(); return; }

    // Stop current
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // Toggle off if same
    if (currentIdxRef.current === idx) {
      callbacks.onEnd(idx);
      currentIdxRef.current = null;
      return;
    }

    const ck = getCacheKey(idx);
    let url = cacheRef.current[ck];

    if (!url) {
      callbacks.onLoadStart(idx);
      try {
        url = await generateTts(rooster.ttsText, voiceId, apiKey, voiceSettings);
        cacheRef.current[ck] = url;
      } catch (e) {
        if (e instanceof TtsError && e.code === 'SANDBOX_BLOCKED') {
          onSandboxBlocked();
        }
        callbacks.onError(idx, e instanceof TtsError ? e.message : 'Unknown error');
        callbacks.onLoadEnd(idx);
        return;
      }
      callbacks.onLoadEnd(idx);
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    currentIdxRef.current = idx;
    callbacks.onStart(idx);

    audio.onended = () => {
      if (currentIdxRef.current === idx) {
        callbacks.onEnd(idx);
        currentIdxRef.current = null;
      }
    };
    audio.onerror = () => {
      callbacks.onEnd(idx);
      currentIdxRef.current = null;
    };

    const p = audio.play();
    if (p) p.catch(() => {
      callbacks.onEnd(idx);
      currentIdxRef.current = null;
    });
  }, [apiKey, voiceId, voiceSettings, getCacheKey, onNeedKey, onSandboxBlocked]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    currentIdxRef.current = null;
  }, []);

  return { play, stop, clearCache, isInCache, getCacheKey };
}
