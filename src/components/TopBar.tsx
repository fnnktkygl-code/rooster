import { memo } from 'react';
import type { Tab } from '../types';

interface TopBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  apiKey: string;
  onSearchToggle: () => void;
  onKeyModal: () => void;
}

const TABS: [Tab, string][] = [
  ['browse', 'Browse'],
  ['voice', 'Voice'],
  ['settings', 'FX Settings'],
];

export const TopBar = memo(function TopBar({
  activeTab, onTabChange, apiKey, onSearchToggle, onKeyModal,
}: TopBarProps) {
  return (
    <nav
      aria-label="Main navigation"
      style={{
        height: 52, flexShrink: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 20px',
        background: 'rgba(8,6,4,.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,168,76,.1)', zIndex: 60,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 22 }} aria-hidden="true">{'\uD83D\uDC13'}</span>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          letterSpacing: '.16em', userSelect: 'none',
        }}>
          ROOSTER<span style={{ color: 'var(--gold)' }}>GALLERY</span>
        </span>
      </div>

      {/* Tabs - hidden on mobile, shown as icons */}
      <div style={{ display: 'flex', gap: 24 }} className="desktop-tabs">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            aria-current={activeTab === id ? 'page' : undefined}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '.16em', textTransform: 'uppercase',
              color: activeTab === id ? 'var(--gold)' : 'var(--text-dim)',
              borderBottom: activeTab === id ? '1px solid var(--gold)' : '1px solid transparent',
              paddingBottom: 2, transition: 'all .16s ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Status pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-full)',
          padding: '4px 10px',
        }} className="status-pill">
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: apiKey ? 'var(--green)' : 'var(--gold)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '.12em',
            color: apiKey ? 'var(--green)' : 'var(--gold)',
          }}>
            {apiKey ? 'AUDIO ACTIVE' : 'API KEY NEEDED'}
          </span>
        </div>

        {/* Search */}
        <button
          onClick={onSearchToggle}
          aria-label="Toggle search"
          style={{
            color: 'var(--text-dim)', fontSize: 15, padding: 4,
            transition: 'color .15s',
          }}
        >
          {'\uD83D\uDD0D'}
        </button>

        {/* Key button */}
        <button
          onClick={onKeyModal}
          aria-label={apiKey ? 'Change API key' : 'Enter API key'}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            background: apiKey ? 'linear-gradient(135deg,var(--gold),#7a5c0f)' : 'rgba(255,255,255,.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13,
            border: `1px solid ${apiKey ? 'rgba(201,168,76,.4)' : 'rgba(255,255,255,.15)'}`,
          }}
        >
          {apiKey ? '\u2713' : '\uD83D\uDD11'}
        </button>
      </div>
    </nav>
  );
});
