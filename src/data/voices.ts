import type { Voice, VoiceSettings } from '../types';

export const voices: Voice[] = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel',  tag: 'Expressive',   gender: 'female' },
  { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi',    tag: 'Passionate',   gender: 'female' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella',   tag: 'Warm',         gender: 'female' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni',  tag: 'Balanced',     gender: 'male' },
  { id: 'MF3mGyEYCl7XYWbV9V29', name: 'Elli',    tag: 'Young',        gender: 'female' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh',    tag: 'Deep',         gender: 'male' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold',  tag: 'Crisp',        gender: 'male' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam',    tag: 'Narrative',    gender: 'male' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam',     tag: 'Raspy',        gender: 'male' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel',  tag: 'Authoritative', gender: 'male' },
  { id: 'flq6f7yk4E4fJM5XTYuZ', name: 'Michael', tag: 'Calm',         gender: 'male' },
  { id: 'g5CIjZEefAph4nQFvHAz', name: 'Ethan',   tag: 'Whispery',     gender: 'male' },
];

export const MODEL_ID = 'eleven_multilingual_v2';

export const defaultVoiceSettings: VoiceSettings = {
  stability: 0.30,
  similarity_boost: 0.75,
  style: 1.0,
  use_speaker_boost: true,
};

export interface Preset {
  name: string;
  icon: string;
  stability: number;
  similarity_boost: number;
  style: number;
}

export const presets: Preset[] = [
  { name: 'Wild Rooster', icon: '\uD83D\uDC13', stability: 0.05, similarity_boost: 0.75, style: 1.0 },
  { name: 'Expressive',   icon: '\uD83C\uDFA4', stability: 0.30, similarity_boost: 0.75, style: 1.0 },
  { name: 'Balanced',     icon: '\uD83C\uDF99', stability: 0.50, similarity_boost: 0.80, style: 0.7 },
  { name: 'Calm Crow',    icon: '\uD83E\uDDD8', stability: 0.70, similarity_boost: 0.85, style: 0.4 },
  { name: 'Max Chaos',    icon: '\uD83D\uDD25', stability: 0.01, similarity_boost: 0.60, style: 1.0 },
  { name: 'Natural',      icon: '\uD83D\uDCFB', stability: 0.60, similarity_boost: 0.90, style: 0.5 },
];
