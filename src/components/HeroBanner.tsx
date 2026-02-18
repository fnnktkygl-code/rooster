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
      height: 'clamp(320px, 50vh, 430px)',
      overflow: 'hidden',
    }}>
      {/* ── Background layers ── */}
      <div style={{ position: 'absolute', inset: 0, background: '#08060a' }} />

      {/* Amber atmospheric glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 65% 90% at 82% 48%, rgba(160,80,8,0.72) 0%, rgba(110,52,6,0.55) 22%, rgba(65,28,4,0.38) 48%, transparent 72%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 40% 55% at 92% 22%, rgba(140,65,6,0.45) 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 30% 40% at 75% 75%, rgba(90,40,4,0.4) 0%, transparent 55%)' }} />

      {/* Rooster silhouette */}
      <div style={{
        position: 'absolute', right: '5%', bottom: '10%',
        width: 'clamp(200px, 30vw, 400px)', height: 'clamp(200px, 30vw, 400px)',
        opacity: 0.08,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23C9A84C' d='M352 96c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 9.3 4 17.7 10.3 23.5C261.3 135.4 224 182.2 224 237v27c-48.1 0-96 34-96 96v48c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-48c0-62-47.9-96-96-96v-27c0-28.2 17.3-52.5 42-62.5C348 168.5 352 136 352 96zm-32 0a16 16 0 1 1 0 32 16 16 0 0 1 0-32z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        animation: 'kenBurns 18s ease-in-out infinite alternate',
      }} />

      {/* Feather texture overlay */}
      <div style={{
        position: 'absolute', right: 0, top: 0, width: '62%', height: '100%', opacity: 0.05,
        backgroundImage: 'repeating-linear-gradient(168deg, rgba(200,140,20,1) 0px, rgba(200,140,20,1) 1px, transparent 1px, transparent 11px), repeating-linear-gradient(78deg, rgba(160,100,10,1) 0px, rgba(160,100,10,1) 1px, transparent 1px, transparent 18px)',
      }} />

      {/* Gradient overlays for readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,6,4,.98) 0%, rgba(8,6,4,.92) 28%, rgba(8,6,4,.6) 52%, rgba(8,6,4,.15) 75%, transparent 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,6,4,1) 0%, transparent 32%, transparent 55%)' }} />

      {/* ── Content ── */}
      <div style={{
        position: 'relative', zIndex: 2, height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 clamp(20px, 4vw, 44px)',
      }}>
        {/* Label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 14, animation: 'slideUp .5s ease',
        }}>
          <div style={{ width: 26, height: 1, background: 'var(--gold)' }} />
          <span style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: 12, color: 'var(--gold)', letterSpacing: '.1em',
          }}>Featured Collection</span>
        </div>

        {/* Title */}
        <div style={{ animation: 'slideUp .6s ease' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 300,
            fontSize: 'clamp(40px, 7vw, 90px)', lineHeight: 0.94,
            color: '#fff', textShadow: '0 2px 30px rgba(0,0,0,.5)',
          }}>
            {r.lang.includes(' ')
              ? <>{r.lang.split(' ')[0]}<br /><span style={{ color: 'var(--gold)' }}>{r.lang.split(' ').slice(1).join(' ')}</span></>
              : r.lang
            }
          </h1>
        </div>

        {/* Rooster text + IPA */}
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 14,
          margin: '14px 0 8px', animation: 'slideUp .7s ease',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 3vw, 26px)',
            fontWeight: 600, color: 'rgba(245,237,214,.9)',
          }}>
            {r.flag} {r.text}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-dim)',
          }}>{r.ipa}</span>
        </div>

        {/* Description */}
        <p style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13,
          color: 'var(--text-dim)', marginBottom: 22, lineHeight: 1.7,
          maxWidth: 340, animation: 'slideUp .75s ease',
        }}>
          Immerse yourself in the crisp, resonant morning call.<br />
          Captured with AI voice synthesis for the ultimate auditory experience.
        </p>

        {/* CTA */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 'clamp(16px, 3vh, 26px)', animation: 'slideUp .8s ease',
        }}>
          <button
            onClick={() => onPlay(featured)}
            aria-label={isPlaying ? `Stop ${r.lang}` : `Play ${r.lang}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--gold-faint)',
              border: '1px solid var(--gold-dim)',
              borderRadius: 'var(--radius-full)',
              padding: '10px 22px 10px 10px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#000',
            }}>
              {isLoading
                ? <span style={{ animation: 'spin 1s linear infinite', display: 'block' }}>{'\u27F3'}</span>
                : isPlaying ? '\u23F9' : '\u25B6'}
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                color: 'var(--gold)', letterSpacing: '.1em',
              }}>
                {isLoading ? 'GENERATING\u2026' : isPlaying ? 'STOP' : 'PLAY NOW'}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 8,
                color: 'var(--text-dim)', letterSpacing: '.1em',
              }}>ElevenLabs TTS</div>
            </div>
          </button>
        </div>

        {/* Thumbnail strip - ALL roosters */}
        <ThumbnailStrip
          roosters={roosters}
          selected={featured}
          onSelect={onSetFeatured}
        />
      </div>
    </div>
  );
});
