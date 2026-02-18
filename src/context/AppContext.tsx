import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Tab, Voice, VoiceSettings } from '../types';
import { voices, defaultVoiceSettings } from '../data/voices';
import { roosters } from '../data/roosters';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface AppState {
  // API Key
  apiKey: string;
  setApiKey: (key: string) => void;
  showKeyModal: boolean;
  setShowKeyModal: (v: boolean) => void;

  // Voice
  selectedVoice: Voice;
  setSelectedVoice: (v: Voice) => void;
  voiceSettings: VoiceSettings;
  setVoiceSetting: (key: keyof VoiceSettings, value: number | boolean) => void;
  setVoiceSettingsBulk: (s: Partial<VoiceSettings>) => void;

  // Navigation
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  search: string;
  setSearch: (v: string) => void;
  region: string;
  setRegion: (r: string) => void;

  // Featured / Playing
  featured: number;
  setFeatured: (i: number) => void;
  playing: number | null;
  loading: Record<number, boolean>;
  errors: Record<number, string | null>;
  showCspNotice: boolean;
  setShowCspNotice: (v: boolean) => void;

  // Favorites
  favorites: number[];
  toggleFavorite: (idx: number) => void;
  isFavorite: (idx: number) => boolean;

  // Actions
  playRooster: (idx: number) => void;
  clearAudioCache: () => void;
  isInCache: (idx: number) => boolean;
  cachedCount: number;
}

const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  // Persisted state
  const [apiKey, setApiKey] = useLocalStorage('rooster_api_key', '');
  const [favorites, setFavorites] = useLocalStorage<number[]>('rooster_favorites', []);

  // UI state
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showCspNotice, setShowCspNotice] = useState(false);
  const [selectedVoice, setSelectedVoiceState] = useState<Voice>(voices[0]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(defaultVoiceSettings);
  const [activeTab, setActiveTab] = useState<Tab>('browse');
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [featured, setFeatured] = useState(0);
  const [playing, setPlaying] = useState<number | null>(null);
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [errors, setErrors] = useState<Record<number, string | null>>({});

  const { play, stop, clearCache, isInCache } = useAudioPlayer({
    apiKey,
    voiceId: selectedVoice.id,
    voiceSettings,
    onNeedKey: () => setShowKeyModal(true),
    onSandboxBlocked: () => setShowCspNotice(true),
  });

  const cachedCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < roosters.length; i++) {
      if (isInCache(i)) count++;
    }
    return count;
  }, [isInCache]);

  const clearAudioCache = useCallback(() => {
    clearCache();
    setPlaying(null);
  }, [clearCache]);

  const setSelectedVoice = useCallback((v: Voice) => {
    setSelectedVoiceState(v);
    clearAudioCache();
  }, [clearAudioCache]);

  const setVoiceSetting = useCallback((key: keyof VoiceSettings, value: number | boolean) => {
    setVoiceSettings(s => ({ ...s, [key]: value }));
    clearAudioCache();
  }, [clearAudioCache]);

  const setVoiceSettingsBulk = useCallback((partial: Partial<VoiceSettings>) => {
    setVoiceSettings(s => ({ ...s, ...partial }));
    clearAudioCache();
  }, [clearAudioCache]);

  const playRooster = useCallback((idx: number) => {
    const rooster = roosters[idx];
    if (!rooster) return;

    // If currently playing something else, stop it
    if (playing !== null && playing !== idx) {
      stop();
      setPlaying(null);
    }

    play(rooster, idx, {
      onStart: (i) => setPlaying(i),
      onEnd: () => setPlaying(null),
      onError: (i, msg) => setErrors(e => ({ ...e, [i]: msg })),
      onLoadStart: (i) => { setLoading(l => ({ ...l, [i]: true })); setErrors(e => ({ ...e, [i]: null })); },
      onLoadEnd: (i) => setLoading(l => ({ ...l, [i]: false })),
    });
  }, [play, stop, playing]);

  const toggleFavorite = useCallback((idx: number) => {
    setFavorites(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  }, [setFavorites]);

  const isFavorite = useCallback((idx: number) => favorites.includes(idx), [favorites]);

  const value = useMemo<AppState>(() => ({
    apiKey, setApiKey, showKeyModal, setShowKeyModal,
    selectedVoice, setSelectedVoice, voiceSettings, setVoiceSetting, setVoiceSettingsBulk,
    activeTab, setActiveTab, searchOpen, setSearchOpen, search, setSearch, region, setRegion,
    featured, setFeatured, playing, loading, errors, showCspNotice, setShowCspNotice,
    favorites, toggleFavorite, isFavorite,
    playRooster, clearAudioCache, isInCache, cachedCount,
  }), [
    apiKey, setApiKey, showKeyModal,
    selectedVoice, setSelectedVoice, voiceSettings, setVoiceSetting, setVoiceSettingsBulk,
    activeTab, searchOpen, search, region,
    featured, playing, loading, errors, showCspNotice,
    favorites, toggleFavorite, isFavorite,
    playRooster, clearAudioCache, isInCache, cachedCount,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
