import { memo, useMemo, useCallback } from 'react';

import { RoosterCard } from './RoosterCard';
import { roosters as allRoosters } from '../data/roosters';

const REGIONS = ['All', 'Europe', 'Americas', 'Asia', 'MiddleEast', 'Africa'] as const;

const REGION_COLORS: Record<string, string> = {
  All: 'var(--gold)',
  Europe: 'var(--region-europe)',
  Americas: 'var(--region-americas)',
  Asia: 'var(--region-asia)',
  MiddleEast: 'var(--region-middleeast)',
  Africa: 'var(--region-africa)',
};

interface LanguageGridProps {
  region: string;
  search: string;
  playing: number | null;
  loading: Record<number, boolean>;
  errors: Record<number, string | null>;
  favorites: number[];
  showFavoritesOnly?: boolean;
  onRegionChange: (r: string) => void;
  onPlay: (idx: number) => void;
  onFavorite: (idx: number) => void;
  isInCache: (idx: number) => boolean;
}

export const LanguageGrid = memo(function LanguageGrid({
  region, search, playing, loading, errors, favorites,
  showFavoritesOnly,
  onRegionChange, onPlay, onFavorite, isInCache,
}: LanguageGridProps) {

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return allRoosters
      .map((r, i) => ({ rooster: r, idx: i }))
      .filter(({ rooster, idx }) => {
        if (showFavoritesOnly && !favorites.includes(idx)) return false;
        if (region !== 'All' && rooster.region !== region) return false;
        if (s && !rooster.lang.toLowerCase().includes(s) && !rooster.text.toLowerCase().includes(s)) return false;
        return true;
      });
  }, [region, search, favorites, showFavoritesOnly]);

  const isFav = useCallback((idx: number) => favorites.includes(idx), [favorites]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '18px clamp(12px, 3vw, 24px)' }}>
      {/* Region filters */}
      <div style={{
        display: 'flex', gap: 7, marginBottom: 18,
        flexWrap: 'wrap', alignItems: 'center',
      }}>
        {REGIONS.map(r => {
          const col = REGION_COLORS[r];
          const sel = region === r;
          return (
            <button
              key={r}
              onClick={() => onRegionChange(r)}
              aria-pressed={sel}
              style={{
                background: sel ? `color-mix(in srgb, ${col} 10%, transparent)` : 'rgba(255,255,255,.03)',
                border: `1px solid ${sel ? `color-mix(in srgb, ${col} 33%, transparent)` : 'rgba(255,255,255,.07)'}`,
                color: sel ? col : 'var(--text-dim)',
                borderRadius: 'var(--radius-full)', padding: '5px 13px',
                fontSize: 10, fontFamily: 'var(--font-mono)',
                letterSpacing: '.1em', transition: 'all .16s ease',
              }}
            >
              {r === 'MiddleEast' ? 'MIDDLE EAST' : r.toUpperCase()}
            </button>
          );
        })}

        {/* Favorites filter */}
        <button
          onClick={() => onRegionChange(showFavoritesOnly ? region : '__fav')}
          aria-pressed={!!showFavoritesOnly}
          style={{
            background: showFavoritesOnly ? 'rgba(239,68,68,.1)' : 'rgba(255,255,255,.03)',
            border: `1px solid ${showFavoritesOnly ? 'rgba(239,68,68,.3)' : 'rgba(255,255,255,.07)'}`,
            color: showFavoritesOnly ? '#ef4444' : 'var(--text-dim)',
            borderRadius: 'var(--radius-full)', padding: '5px 13px',
            fontSize: 10, fontFamily: 'var(--font-mono)',
            letterSpacing: '.1em', transition: 'all .16s ease',
          }}
        >
          {'\u2764'} FAVORITES ({favorites.length})
        </button>

        <span style={{
          marginLeft: 'auto', fontFamily: 'var(--font-mono)',
          fontSize: 10, color: 'var(--text-faint)',
        }}>
          {filtered.length}/{allRoosters.length}
        </span>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 10,
      }}>
        {filtered.map(({ rooster, idx }, i) => (
          <RoosterCard
            key={idx}
            rooster={rooster}
            idx={idx}
            isPlaying={playing === idx}
            isLoading={!!loading[idx]}
            isCached={isInCache(idx)}
            isFavorite={isFav(idx)}
            error={errors[idx] || null}
            animDelay={(i % 12) * 0.04}
            onPlay={onPlay}
            onFavorite={onFavorite}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{'\uD83D\uDC13'}</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text-dim)',
          }}>No roosters found</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)',
            marginTop: 8,
          }}>Try a different search or region filter</div>
        </div>
      )}
    </div>
  );
});
