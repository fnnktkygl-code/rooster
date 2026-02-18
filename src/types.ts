export type Region = 'Europe' | 'Americas' | 'Asia' | 'MiddleEast' | 'Africa';

export interface Rooster {
  lang: string;
  flag: string;
  countryCode: string | null;
  text: string;
  ipa: string;
  region: Region;
  ttsText: string;
}

export interface Voice {
  id: string;
  name: string;
  tag: string;
  gender: 'male' | 'female';
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

export type Tab = 'browse' | 'voice' | 'settings';
