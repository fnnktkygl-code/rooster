import type { VoiceSettings } from '../types';
import { MODEL_ID } from '../data/voices';

export class TtsError extends Error {
  constructor(message: string, public code: 'SANDBOX_BLOCKED' | 'INVALID_KEY' | 'QUOTA' | 'API_ERROR') {
    super(message);
  }
}

export async function generateTts(
  ttsText: string,
  voiceId: string,
  apiKey: string,
  settings: VoiceSettings,
): Promise<string> {
  const key = apiKey.trim().replace(/[^\x20-\x7E]/g, '');
  if (!key) throw new TtsError('Invalid API Key', 'INVALID_KEY');

  let res: Response;
  try {
    res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
      method: 'POST',
      headers: {
        'xi-api-key': key,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: ttsText,
        model_id: MODEL_ID,
        voice_settings: settings,
      }),
    });
  } catch {
    throw new TtsError('Audio blocked by browser sandbox \u2014 run locally', 'SANDBOX_BLOCKED');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({} as Record<string, unknown>));
    const detail = data.detail as { message?: string; status?: string } | undefined;
    const msg = detail?.message || detail?.status || '';
    if (res.status === 401) throw new TtsError('Invalid API Key', 'INVALID_KEY');
    if (res.status === 429) throw new TtsError('Quota exceeded \u2014 try again later', 'QUOTA');
    throw new TtsError(`Error ${res.status}${msg ? ': ' + msg.slice(0, 60) : ''}`, 'API_ERROR');
  }

  return URL.createObjectURL(await res.blob());
}
