import { memo, useCallback } from 'react';
import type { Rooster, Region } from '../types';
import { Flag } from './Flag';

const REGION_COLORS: Record<Region, string> = {
  Europe: 'var(--region-europe)',
  Americas: 'var(--region-americas)',
  Asia: 'var(--region-asia)',
  MiddleEast: 'var(--region-middleeast)',
  Africa: 'var(--region-africa)',
};

interface RoosterCardProps {
  rooster: Rooster;
  idx: number;
  isPlaying: boolean;
  isLoading: boolean;
  isCached: boolean;
  isFavorite: boolean;
  error: string | null;
  animDelay: number;
  onPlay: (idx: number) => void;
  onFavorite: (idx: number) => void;
}

export const RoosterCard = memo(function RoosterCard({
  rooster, idx, isPlaying, isLoading, isCached, isFavorite, error, animDelay,
  onPlay, onFavorite,
}: RoosterCardProps) {
  const col = REGION_COLORS[rooster.region];

  const handleClick = useCallback(() => onPlay(idx), [onPlay, idx]);
  const handleFav = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite(idx);
  }, [onFavorite, idx]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Play ${rooster.lang}: ${rooster.text}`}
      onClick={handleClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
      style={{
        background: isPlaying
          ? `linear-gradient(135deg, color-mix(in srgb, ${col} 8%, transparent), rgba(0,0,0,.85))`
          : 'var(--bg-card)',
        border: `1px solid ${isPlaying ? col : error ? 'rgba(239,68,68,.3)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '13px 15px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isPlaying ? `0 6px 28px color-mix(in srgb, ${col} 16%, transparent)` : 'none',
        animation: `cardEnter 0.4s ease both`,
        animationDelay: `${animDelay}s`,
        transition: 'all 0.22s cubic-bezier(.34,1.56,.64,1)',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${col}, transparent)`,
        opacity: isPlaying ? 1 : 0.18,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Flag */}
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          border: `1.5px solid ${isPlaying ? col : 'rgba(255,255,255,.12)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isPlaying ? `color-mix(in srgb, ${col} 10%, transparent)` : 'rgba(0,0,0,.25)',
          flexShrink: 0, overflow: 'hidden',
        }}>
          <Flag countryCode={rooster.countryCode} emoji={rooster.flag} size={28} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '.14em',
            color: isPlaying ? col : 'var(--text-dim)', marginBottom: 2,
            textTransform: 'uppercase',
          }}>{rooster.lang}</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
            color: isPlaying ? '#fff' : 'var(--text)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{rooster.text}</div>
        </div>

        {/* Favorite */}
        <button
          onClick={handleFav}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          style={{
            fontSize: 14, color: isFavorite ? '#ef4444' : 'var(--text-faint)',
            transition: 'color 0.15s', flexShrink: 0,
            padding: '4px',
          }}
        >
          {isFavorite ? '\u2764' : '\u2661'}
        </button>

        {/* Play indicator */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: isPlaying ? col : isCached ? 'rgba(74,222,128,.1)' : 'rgba(255,255,255,.05)',
          border: `1px solid ${isPlaying ? col : isCached ? 'rgba(74,222,128,.3)' : 'rgba(255,255,255,.09)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10,
          color: isPlaying ? '#000' : isCached ? 'var(--green)' : 'var(--text-muted)',
          flexShrink: 0,
          animation: isLoading ? 'spin 1s linear infinite' : 'none',
        }}>
          {isLoading ? '\u27F3' : isPlaying ? '\u23F9' : error ? '\u26A0' : '\u25B6'}
        </div>
      </div>

      {/* Waveform when playing */}
      {isPlaying && (
        <div style={{ marginTop: 9, display: 'flex', gap: 1.5, alignItems: 'center', height: 14 }}>
          {Array.from({ length: 22 }, (_, j) => (
            <div key={j} style={{
              width: 2.5, borderRadius: 1, background: col, height: 3,
              animation: `wavebar ${0.3 + Math.abs(Math.sin(j * 0.5)) * 0.3}s ease-in-out infinite`,
              animationDelay: `${j * 0.042}s`,
              opacity: 0.4 + Math.abs(Math.sin(j * 0.7)) * 0.6,
            }} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          fontSize: 9, color: 'rgba(239,68,68,.65)',
          fontFamily: 'var(--font-mono)', marginTop: 5,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          \u26A0 {error}
        </div>
      )}
    </div>
  );
});
