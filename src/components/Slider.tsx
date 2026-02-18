import { memo } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  color?: string;
  description?: string;
}

export const Slider = memo(function Slider({
  label, value, min, max, step, onChange, color = 'var(--gold)', description,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{
          fontSize: 10, letterSpacing: '.14em', color: 'var(--text-dim)',
          fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
        }}>{label}</span>
        <span style={{
          fontSize: 11, color, fontFamily: 'var(--font-mono)', fontWeight: 600,
        }}>{value.toFixed(2)}</span>
      </div>
      <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,.1)', borderRadius: 2 }}>
        <div style={{
          position: 'absolute', left: 0, width: `${pct}%`, height: '100%',
          background: `linear-gradient(90deg, ${color}60, ${color})`, borderRadius: 2,
        }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          aria-label={label}
          style={{
            position: 'absolute', inset: '-10px 0', opacity: 0,
            cursor: 'pointer', width: '100%', margin: 0, height: 24,
          }}
        />
        <div style={{
          position: 'absolute', top: '50%', left: `${pct}%`,
          transform: 'translate(-50%,-50%)',
          width: 14, height: 14, borderRadius: '50%',
          background: color, border: '2px solid var(--bg)',
          pointerEvents: 'none',
        }} />
      </div>
      {description && (
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          color: 'var(--text-faint)', marginTop: 6,
        }}>{description}</p>
      )}
    </div>
  );
});
