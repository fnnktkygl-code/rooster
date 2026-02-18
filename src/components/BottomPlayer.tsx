import { memo } from 'react';
import type { Rooster, Voice } from '../types';
import { Waveform } from './Waveform';
import { Flag } from './Flag';

interface BottomPlayerProps {
  currentRooster: Rooster;
  voice: Voice;
  playing: number | null;
  cachedCount: number;
  totalCount: number;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

export const BottomPlayer = memo(function BottomPlayer({
  currentRooster, voice, playing, cachedCount, totalCount,
  onToggleFavorite, isFavorite,
}: BottomPlayerProps) {
  const isActive = playing !== null;

  return (
    <div style={{
      flexShrink: 0, height: 72,
      background: 'rgba(6,5,3,.98)', backdropFilter: 'blur(24px)',
      borderTop: '1px solid rgba(201,168,76,.1)',
      display: 'flex', alignItems: 'center', padding: '0 clamp(12px, 3vw, 22px)',
      gap: 18, zIndex: 60,
    }}>
      {/* Now playing info */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: 'clamp(160px, 25vw, 220px)', flexShrink: 0,
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 10,
          background: 'var(--gold-faint)',
          border: `1px solid ${isActive ? 'var(--gold)' : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          animation: isActive ? 'glow 1.5s ease-in-out infinite' : 'none',
          overflow: 'hidden',
        }}>
          <Flag countryCode={currentRooster.countryCode} emoji={currentRooster.flag} size={32} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
            color: isActive ? '#fff' : 'var(--text-dim)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {currentRooster.text}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            color: isActive ? 'var(--gold)' : 'var(--text-faint)',
            letterSpacing: '.08em', marginTop: 2,
          }}>
            {currentRooster.lang} \u00B7 {voice.name}
          </div>
        </div>
        <button
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          style={{
            color: isFavorite ? '#ef4444' : 'var(--text-faint)',
            fontSize: 14, padding: 4, transition: 'color .15s',
          }}
        >
          {isFavorite ? '\u2764' : '\u2661'}
        </button>
      </div>

      {/* Center waveform */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 5,
      }} className="player-waveform">
        <Waveform active={isActive} count={44} />
      </div>

      {/* Cache counter */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        width: 'clamp(80px, 15vw, 180px)', justifyContent: 'flex-end',
        flexShrink: 0,
      }} className="player-cache">
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--text-dim)', letterSpacing: '.06em',
          textAlign: 'right',
        }}>
          <span style={{ color: 'var(--gold)' }}>{cachedCount}</span>/{totalCount} cached
        </div>
      </div>
    </div>
  );
});
