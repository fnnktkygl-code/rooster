import { memo, useCallback } from 'react';
import type { Voice } from '../types';
import { voices } from '../data/voices';

interface VoiceSelectorProps {
  selected: Voice;
  onSelect: (v: Voice) => void;
}

export const VoiceSelector = memo(function VoiceSelector({ selected, onSelect }: VoiceSelectorProps) {
  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      padding: 'clamp(20px, 4vw, 32px) clamp(16px, 5vw, 40px)',
      animation: 'fadeIn .3s ease',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 38px)',
        fontWeight: 300, marginBottom: 6,
      }}>
        Choose <span style={{ color: 'var(--gold)' }}>Voice</span>
      </h2>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)',
        marginBottom: 28, letterSpacing: '.08em',
      }}>
        Active: <span style={{ color: 'var(--gold)' }}>{selected.name}</span> \u00B7 {selected.tag} \u00B7 Changing voice clears cache
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 12,
      }}>
        {voices.map(v => (
          <VoiceCard
            key={v.id}
            voice={v}
            isSelected={selected.id === v.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
});

const VoiceCard = memo(function VoiceCard({
  voice, isSelected, onSelect,
}: {
  voice: Voice;
  isSelected: boolean;
  onSelect: (v: Voice) => void;
}) {
  const handleClick = useCallback(() => onSelect(voice), [onSelect, voice]);

  return (
    <button
      onClick={handleClick}
      aria-pressed={isSelected}
      aria-label={`Select voice ${voice.name}: ${voice.tag}`}
      style={{
        background: isSelected ? 'var(--gold-faint)' : 'var(--bg-card)',
        border: `1px solid ${isSelected ? 'var(--gold)' : 'var(--border)'}`,
        borderRadius: 14, padding: '20px 22px',
        position: 'relative', textAlign: 'left',
        transition: 'all .16s ease',
      }}
    >
      {isSelected && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--gold)', animation: 'pulse 2s infinite',
        }} />
      )}
      <div style={{ fontSize: 32, marginBottom: 10 }}>
        {voice.gender === 'female' ? '\uD83D\uDC69' : '\uD83D\uDC68'}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
        color: isSelected ? 'var(--gold)' : 'var(--text)', marginBottom: 3,
      }}>{voice.name}</div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 9,
        color: 'var(--text-dim)', letterSpacing: '.08em',
      }}>{voice.tag} \u00B7 {voice.gender === 'female' ? 'Female' : 'Male'}</div>
    </button>
  );
});
