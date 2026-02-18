import { memo, useCallback, useRef, useEffect } from 'react';
import type { Rooster } from '../types';
import { Flag } from './Flag';

interface ThumbnailItemProps {
  rooster: Rooster;
  idx: number;
  selected: boolean;
  onClick: (idx: number) => void;
}

const ThumbnailItem = memo(function ThumbnailItem({ rooster, idx, selected, onClick }: ThumbnailItemProps) {
  const handleClick = useCallback(() => onClick(idx), [onClick, idx]);
  const size = selected ? 68 : 54;

  return (
    <button
      onClick={handleClick}
      aria-label={`Select ${rooster.lang}`}
      aria-pressed={selected}
      style={{
        flexShrink: 0, textAlign: 'center',
        opacity: selected ? 1 : 0.52,
        transform: selected ? 'scale(1.06)' : 'scale(0.94)',
        transition: 'all .22s cubic-bezier(.34,1.56,.64,1)',
        padding: 0, background: 'none',
      }}
    >
      <div style={{
        width: size, height: size, borderRadius: '50%',
        border: `2.5px solid ${selected ? 'var(--gold)' : 'rgba(255,255,255,0.18)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', marginBottom: 6,
        background: selected
          ? 'radial-gradient(circle at 38% 32%, hsl(28,72%,44%) 0%, hsl(20,62%,15%) 60%, hsl(12,50%,8%) 100%)'
          : 'radial-gradient(circle, hsl(28,50%,20%) 0%, hsl(20,40%,10%) 100%)',
        boxShadow: selected
          ? '0 0 0 3px rgba(201,168,76,0.2), 0 6px 24px rgba(0,0,0,0.7)'
          : '0 3px 12px rgba(0,0,0,0.5)',
        transition: 'all .22s ease',
        position: 'relative',
      }}>
        <Flag countryCode={rooster.countryCode} emoji={rooster.flag} size={size * 0.5} />
        {selected && (
          <div style={{
            position: 'absolute', inset: -4, borderRadius: '50%',
            border: '2px solid rgba(201,168,76,0.5)',
            animation: 'pulse 2s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        )}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: selected ? 8.5 : 7.5,
        color: selected ? 'var(--gold)' : 'var(--text-faint)',
        letterSpacing: '.08em', textTransform: 'uppercase',
        whiteSpace: 'nowrap', fontWeight: selected ? 600 : 400,
      }}>
        {rooster.lang.split(' ')[0].slice(0, 9)}
      </div>
    </button>
  );
});

interface ThumbnailStripProps {
  roosters: Rooster[];
  selected: number;
  onSelect: (idx: number) => void;
}

export const ThumbnailStrip = memo(function ThumbnailStrip({ roosters, selected, onSelect }: ThumbnailStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to selected
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const child = container.children[selected] as HTMLElement | undefined;
      if (child) {
        const left = child.offsetLeft - container.offsetWidth / 2 + child.offsetWidth / 2;
        container.scrollTo({ left, behavior: 'smooth' });
      }
    }
  }, [selected]);

  return (
    <div
      ref={scrollRef}
      role="listbox"
      aria-label="Select a country"
      style={{
        display: 'flex', gap: 16, alignItems: 'flex-end',
        overflowX: 'auto', paddingBottom: 4,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        animation: 'slideUp .9s ease',
      }}
    >
      <style>{`.thumb-strip::-webkit-scrollbar{display:none;}`}</style>
      {roosters.map((r, i) => (
        <ThumbnailItem
          key={i}
          rooster={r}
          idx={i}
          selected={selected === i}
          onClick={onSelect}
        />
      ))}
    </div>
  );
});
