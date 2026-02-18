import { useCallback, useState } from 'react';
import { useApp } from './context/AppContext';
import { roosters } from './data/roosters';
import { TopBar } from './components/TopBar';
import { SearchBar } from './components/SearchBar';
import { HeroBanner } from './components/HeroBanner';
import { LanguageGrid } from './components/LanguageGrid';
import { VoiceSelector } from './components/VoiceSelector';
import { FXSettings } from './components/FXSettings';
import { BottomPlayer } from './components/BottomPlayer';
import { ApiKeyModal } from './components/ApiKeyModal';

function CspNotice({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div style={{
      position: 'fixed', bottom: 84, left: '50%', transform: 'translateX(-50%)', zIndex: 300,
      background: 'rgba(17,14,7,.97)', border: '1px solid rgba(251,191,36,.4)',
      borderRadius: 14, padding: '16px 22px', maxWidth: 440, width: '92%',
      boxShadow: '0 8px 40px rgba(0,0,0,.7)', animation: 'slideUp .3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>{'\u26A0\uFE0F'}</span>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
            color: '#fbbf24', marginBottom: 5,
          }}>Audio blocked by browser sandbox</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)',
            lineHeight: 1.7, letterSpacing: '.04em',
          }}>
            This environment blocks calls to external APIs via Content Security Policy.<br />
            <span style={{ color: 'var(--green)' }}>{'\u2713'} Fix:</span> Run locally on{' '}
            <span style={{ color: 'var(--gold)' }}>localhost</span> (Vite) or open in{' '}
            <span style={{ color: 'var(--gold)' }}>CodeSandbox / StackBlitz</span>.
          </div>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{ color: 'var(--text-dim)', fontSize: 16, flexShrink: 0, marginTop: -2, padding: 4 }}
        >{'\u2715'}</button>
      </div>
    </div>
  );
}

export default function App() {
  const app = useApp();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const currentRooster = app.playing !== null ? roosters[app.playing] : roosters[app.featured];

  const handleSearchToggle = useCallback(() => {
    app.setSearchOpen(!app.searchOpen);
    if (app.searchOpen) app.setSearch('');
  }, [app]);

  const handleRegionChange = useCallback((r: string) => {
    if (r === '__fav') {
      setShowFavoritesOnly(prev => !prev);
    } else {
      setShowFavoritesOnly(false);
      app.setRegion(r);
    }
  }, [app]);

  const handleKeySubmit = useCallback((key: string) => {
    app.setApiKey(key);
    app.setShowKeyModal(false);
  }, [app]);

  const handleKeyRemove = useCallback(() => {
    app.setApiKey('');
    app.clearAudioCache();
    app.setShowKeyModal(false);
  }, [app]);

  const handleSetFeatured = useCallback((idx: number) => {
    app.setFeatured(idx);
  }, [app]);

  const handlePlay = useCallback((idx: number) => {
    app.setFeatured(idx);
    app.playRooster(idx);
  }, [app]);

  const handleToggleCurrentFav = useCallback(() => {
    const idx = app.playing !== null ? app.playing : app.featured;
    app.toggleFavorite(idx);
  }, [app]);

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', color: 'var(--text)',
      fontFamily: 'var(--font-display)', overflow: 'hidden',
    }}>
      {app.showCspNotice && <CspNotice onDismiss={() => app.setShowCspNotice(false)} />}

      <TopBar
        activeTab={app.activeTab}
        onTabChange={app.setActiveTab}
        apiKey={app.apiKey}
        onSearchToggle={handleSearchToggle}
        onKeyModal={() => app.setShowKeyModal(true)}
      />

      <ApiKeyModal
        open={app.showKeyModal}
        hasKey={!!app.apiKey}
        onClose={() => app.setShowKeyModal(false)}
        onSubmit={handleKeySubmit}
        onRemove={handleKeyRemove}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {app.activeTab === 'browse' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <SearchBar
              value={app.search}
              onChange={app.setSearch}
              visible={app.searchOpen}
            />
            <HeroBanner
              roosters={roosters}
              featured={app.featured}
              playing={app.playing}
              loading={app.loading}
              onSetFeatured={handleSetFeatured}
              onPlay={handlePlay}
            />
            <LanguageGrid
              region={app.region}
              search={app.search}
              playing={app.playing}
              loading={app.loading}
              errors={app.errors}
              favorites={app.favorites}
              showFavoritesOnly={showFavoritesOnly}
              onRegionChange={handleRegionChange}
              onPlay={handlePlay}
              onFavorite={app.toggleFavorite}
              isInCache={app.isInCache}
            />
          </div>
        )}

        {app.activeTab === 'voice' && (
          <VoiceSelector
            selected={app.selectedVoice}
            onSelect={app.setSelectedVoice}
          />
        )}

        {app.activeTab === 'settings' && (
          <FXSettings
            settings={app.voiceSettings}
            onSettingChange={app.setVoiceSetting}
            onBulkChange={app.setVoiceSettingsBulk}
          />
        )}
      </div>

      <BottomPlayer
        currentRooster={currentRooster}
        voice={app.selectedVoice}
        playing={app.playing}
        cachedCount={app.cachedCount}
        totalCount={roosters.length}
        onToggleFavorite={handleToggleCurrentFav}
        isFavorite={app.isFavorite(app.playing !== null ? app.playing : app.featured)}
      />
    </div>
  );
}
