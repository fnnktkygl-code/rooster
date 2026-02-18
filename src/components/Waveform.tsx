import { memo } from 'react';

interface WaveformProps {
  color?: string;
  count?: number;
  active?: boolean;
  compact?: boolean;
}

export const Waveform = memo(function Waveform({
  color = 'var(--gold)',
  count = 44,
  active = true,
  compact = false,
}: WaveformProps) {
  const height = compact ? 14 : 28;
  const barWidth = compact ? 2 : 3;

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: compact ? 1 : 2, height }}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            width: barWidth,
            borderRadius: 2,
            background: color,
            height: active ? 4 : `${3 + Math.abs(Math.sin(i * 0.55)) * (compact ? 8 : 14)}px`,
            opacity: active ? 0.5 + Math.abs(Math.sin(i * 0.5)) * 0.5 : 0.18,
            animation: active ? `wavebar ${0.35 + Math.sin(i * 0.7) * 0.25}s ease-in-out infinite` : 'none',
            animationDelay: active ? `${i * 0.042}s` : '0s',
          }}
        />
      ))}
    </div>
  );
});
