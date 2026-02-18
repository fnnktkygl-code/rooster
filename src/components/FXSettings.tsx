import { memo, useCallback } from 'react';
import type { VoiceSettings } from '../types';
import { presets } from '../data/voices';
import { Slider } from './Slider';

interface FXSettingsProps {
  settings: VoiceSettings;
  onSettingChange: (key: keyof VoiceSettings, value: number | boolean) => void;
  onBulkChange: (partial: Partial<VoiceSettings>) => void;
}

export const FXSettings = memo(function FXSettings({
  settings, onSettingChange, onBulkChange,
}: FXSettingsProps) {

  const handleStability = useCallback((v: number) => onSettingChange('stability', v), [onSettingChange]);
  const handleSimilarity = useCallback((v: number) => onSettingChange('similarity_boost', v), [onSettingChange]);
  const handleStyle = useCallback((v: number) => onSettingChange('style', v), [onSettingChange]);
  const handleBoost = useCallback(() => onSettingChange('use_speaker_boost', !settings.use_speaker_boost), [onSettingChange, settings.use_speaker_boost]);

  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      padding: 'clamp(20px, 4vw, 32px) clamp(16px, 5vw, 40px)',
      maxWidth: 600, animation: 'fadeIn .3s ease',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 38px)',
        fontWeight: 300, marginBottom: 6,
      }}>
        Voice <span style={{ color: 'var(--gold)' }}>FX Settings</span>
      </h2>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)',
        marginBottom: 32, letterSpacing: '.08em',
      }}>
        ElevenLabs synthesis parameters \u00B7 Changes clear the audio cache
      </p>

      {/* Phonation Control */}
      <section style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '28px 30px', marginBottom: 16,
      }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600,
          color: 'var(--gold)', marginBottom: 22,
        }}>{'\uD83D\uDCD0'} Phonation Control</h3>

        <Slider
          label="Stability"
          value={settings.stability}
          min={0} max={1} step={0.01}
          onChange={handleStability}
          description="0.05 = wild screaming rooster \u00B7 1.0 = calm speech"
        />
        <Slider
          label="Similarity Boost"
          value={settings.similarity_boost}
          min={0} max={1} step={0.01}
          onChange={handleSimilarity}
          color="var(--region-europe)"
          description="Higher = closer to the voice's original character"
        />
        <Slider
          label="Style Exaggeration"
          value={settings.style}
          min={0} max={1} step={0.01}
          onChange={handleStyle}
          color="var(--region-americas)"
          description="1.0 = maximum expressiveness, animal-like vocal exaggeration"
        />
      </section>

      {/* Speaker Boost */}
      <section style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '22px 30px', marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600,
              color: 'var(--gold)', marginBottom: 4,
            }}>{'\uD83D\uDD0A'} Speaker Boost</h3>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)',
            }}>Enhances audio clarity and presence</div>
          </div>
          <button
            onClick={handleBoost}
            role="switch"
            aria-checked={settings.use_speaker_boost}
            aria-label="Speaker Boost"
            style={{
              width: 44, height: 24, borderRadius: 12,
              background: settings.use_speaker_boost ? 'var(--gold)' : 'rgba(255,255,255,.1)',
              position: 'relative', transition: 'background .2s',
              padding: 0,
            }}
          >
            <div style={{
              position: 'absolute', top: 3,
              left: settings.use_speaker_boost ? 22 : 3,
              width: 16, height: 16, borderRadius: '50%',
              background: '#fff', transition: 'left .2s',
            }} />
          </button>
        </div>
      </section>

      {/* Quick Presets */}
      <section style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '22px 30px',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600,
          color: 'var(--gold)', marginBottom: 14,
        }}>{'\u26A1'} Quick Presets</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: 9,
        }}>
          {presets.map(p => (
            <PresetButton key={p.name} preset={p} onApply={onBulkChange} />
          ))}
        </div>
      </section>
    </div>
  );
});

const PresetButton = memo(function PresetButton({
  preset,
  onApply,
}: {
  preset: typeof presets[number];
  onApply: (partial: Partial<VoiceSettings>) => void;
}) {
  const handleClick = useCallback(() => {
    onApply({
      stability: preset.stability,
      similarity_boost: preset.similarity_boost,
      style: preset.style,
    });
  }, [preset, onApply]);

  return (
    <button
      onClick={handleClick}
      aria-label={`Apply ${preset.name} preset`}
      style={{
        background: 'rgba(255,255,255,.035)',
        border: '1px solid rgba(255,255,255,.07)',
        borderRadius: 10, padding: '10px 8px',
        fontFamily: 'var(--font-mono)', fontSize: 9,
        color: 'var(--text-muted)', letterSpacing: '.05em',
        transition: 'all .16s ease',
      }}
    >
      {preset.icon} {preset.name}
    </button>
  );
});
