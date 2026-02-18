import { memo } from 'react';
import type { Rooster } from '../types';
import { ThumbnailStrip } from './ThumbnailStrip';

interface HeroBannerProps {
  roosters: Rooster[];
  featured: number;
  playing: number | null;
  loading: Record<number, boolean>;
  onSetFeatured: (idx: number) => void;
  onPlay: (idx: number) => void;
}

export const HeroBanner = memo(function HeroBanner({
  roosters, featured, playing, loading,
  onSetFeatured, onPlay,
}: HeroBannerProps) {
  const r = roosters[featured];
  const isLoading = !!loading[featured];
  const isPlaying = playing === featured;

  return (
    <div style={{
      position: 'relative', flexShrink: 0,
      height: 'clamp(400px, 60vh, 520px)',
      overflow: 'hidden',
    }}>
      {/* ── Background layers ── */}
      <div style={{ position: 'absolute', inset: 0, background: '#080604' }} />

      {/* Hero Image */}
      <div style={{
        position: 'absolute', right: 0, top: 0, width: '100%', height: '100%',
        backgroundImage: 'url("/rooster/hero_rooster_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'right 30% center',
        opacity: 0.85,
        animation: 'kenBurns 30s ease-in-out infinite alternate',
      }} />

      {/* Cinematic Gradient Overlays */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, #080604 0%, rgba(8,6,4,0.95) 20%, rgba(8,6,4,0.6) 45%, rgba(8,6,4,0.1) 70%, transparent 100%)'
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, #080604 0%, transparent 35%)'
      }} />

      {/* ── Content ── */}
      <div style={{
        position: 'relative', zIndex: 2, height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 clamp(24px, 5vw, 64px)',
        paddingTop: 40,
      }}>
        {/* Lossless Indicator */}
        <div style={{
          position: 'absolute', top: 24, right: 32,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(0,0,0,0.4)', padding: '4px 12px',
          borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 1s ease both',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 8px var(--gold)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', color: '#fff', fontWeight: 600 }}>LOSSLESS AUDIO ACTIVE</span>
        </div>

        {/* Label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 16, animation: 'slideUp .5s ease',
        }}>
          <div style={{ width: 34, height: 1, background: 'var(--gold)' }} />
          <span style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 14, color: 'var(--gold)', letterSpacing: '.06em',
          }}>Featured Collection</span>
        </div>

        {/* Title */}
        <div style={{ animation: 'slideUp .6s ease' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(52px, 9vw, 110px)', lineHeight: 0.9,
            color: '#fff', maxWidth: '12ch',
          }}>
            {r.lang}
          </h1>
        </div>

        {/* Rooster text + IPA */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          margin: '24px 0 12px', animation: 'slideUp .7s ease',
        }}>
          <span style={{ fontSize: 'clamp(20px, 4vw, 32px)' }}>{r.flag}</span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 4vw, 32px)',
            fontWeight: 400, color: 'rgba(255,255,255,.9)', letterSpacing: '0.04em'
          }}>
            {r.text}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-dim)', letterSpacing: '0.05em'
          }}>{r.ipa}</span>
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: 15,
          color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.6,
          maxWidth: 400, animation: 'slideUp .75s ease',
        }}>
          Immerse yourself in the crisp, resonant morning call.<br />
          Captured in 24-bit/96kHz high-fidelity stereo for the ultimate auditory experience.
        </p>

        {/* Action Row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
          marginBottom: 40, animation: 'slideUp .8s ease',
        }}>
          <button
            onClick={() => onPlay(featured)}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'rgba(201, 168, 76, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.25)',
              borderRadius: 'var(--radius-full)',
              padding: '12px 28px 12px 12px',
              backdropFilter: 'blur(20px)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: '#000',
              boxShadow: '0 4px 15px rgba(201, 168, 76, 0.4)',
            }}>
              {isLoading
                ? <span style={{ animation: 'spin 1s linear infinite', display: 'block' }}>{'\u27F3'}</span>
                : isPlaying ? '\u23F9' : '\u25B6'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12,
                color: 'var(--gold)', letterSpacing: '.1em',
              }}>
                {isLoading ? 'INITIATING\u2026' : isPlaying ? 'STOP' : 'PLAY NOW'}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                color: 'var(--text-muted)', letterSpacing: '.05em',
              }}>Lossless Master</div>
            </div>
          </button>

          <button style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', cursor: 'pointer',
          }}>
            {'\u2661'}
          </button>
        </div>

        {/* Thumbnail strip */}
        <ThumbnailStrip
          roosters={roosters}
          selected={featured}
          onSelect={onSetFeatured}
        />
      </div>
    </div>
  );
});
