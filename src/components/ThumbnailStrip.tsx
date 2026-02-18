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
  const size = selected ? 74 : 58;

  return (
    <button
      onClick={handleClick}
      aria-label={`Select ${rooster.lang}`}
      aria-pressed={selected}
      style={{
        flexShrink: 0, textAlign: 'center',
        opacity: selected ? 1 : 0.45,
        transform: selected ? 'scale(1.1)' : 'scale(1)',
        transition: 'all .3s cubic-bezier(.34,1.56,.64,1)',
        padding: 0, background: 'none',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: size, height: size, borderRadius: '50%',
        border: `2px solid ${selected ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', marginBottom: 10,
        background: selected
          ? 'radial-gradient(circle at center, rgba(201,168,76,0.3) 0%, rgba(0,0,0,0.8) 100%)'
          : 'rgba(255,255,255,0.03)',
        boxShadow: selected
          ? '0 0 20px rgba(201,168,76,0.2), inset 0 0 15px rgba(201,168,76,0.1)'
          : 'none',
        transition: 'all .3s ease',
        position: 'relative',
      }}>
        {/* Placeholder for rooster image - using Flag as fallback */}
        <div style={{ transform: `scale(${selected ? 1.2 : 1})`, transition: 'transform 0.3s ease' }}>
          <Flag countryCode={rooster.countryCode} emoji={rooster.flag} size={size * 0.55} />
        </div>

        {selected && (
          <div style={{
            position: 'absolute', inset: -2, borderRadius: '50%',
            border: '1.5px solid var(--gold)',
            opacity: 0.5,
          }} />
        )}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9,
        color: selected ? 'var(--gold)' : 'var(--text-dim)',
        letterSpacing: '.1em', textTransform: 'uppercase',
        whiteSpace: 'nowrap', fontWeight: selected ? 600 : 400,
        transition: 'color 0.3s ease',
      }}>
        {rooster.lang.split(' ')[0]}
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
