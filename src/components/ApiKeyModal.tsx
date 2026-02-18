import { memo, useState, useCallback } from 'react';

interface ApiKeyModalProps {
  open: boolean;
  hasKey: boolean;
  onClose: () => void;
  onSubmit: (key: string) => void;
  onRemove: () => void;
}

export const ApiKeyModal = memo(function ApiKeyModal({
  open, hasKey, onClose, onSubmit, onRemove,
}: ApiKeyModalProps) {
  const [input, setInput] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (trimmed) {
      onSubmit(trimmed);
      setInput('');
    }
  }, [input, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onClose();
  }, [handleSubmit, onClose]);

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="API Key"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.8)',
        zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{
        background: 'var(--bg-modal)',
        border: '1px solid rgba(201,168,76,.3)',
        borderRadius: 'var(--radius-xl)', padding: '36px 40px',
        maxWidth: 460, width: '90%',
        animation: 'slideUp .3s ease',
      }}>
        <div style={{ fontSize: 34, textAlign: 'center', marginBottom: 12 }}>{'\uD83D\uDD11'}</div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600,
          textAlign: 'center', marginBottom: 8,
        }}>
          {hasKey ? 'Change API Key' : 'Unlock Rooster Gallery'}
        </h2>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-dim)',
          textAlign: 'center', marginBottom: 6, lineHeight: 1.7, letterSpacing: '.06em',
        }}>
          ElevenLabs API key required \u00B7 Get yours free at elevenlabs.io
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          color: 'rgba(251,191,36,.4)', textAlign: 'center',
          marginBottom: 6, letterSpacing: '.05em',
        }}>
          Your key is stored locally in your browser and never sent to any server except ElevenLabs.
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          color: 'rgba(251,191,36,.3)', textAlign: 'center',
          marginBottom: 20, letterSpacing: '.05em',
        }}>
          {'\u26A0'} Sandbox environments may block API calls \u2014 run locally for best results
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="password"
            placeholder="Paste API key here\u2026"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="ElevenLabs API key"
            autoFocus
            style={{
              flex: 1, background: 'var(--bg-elevated)',
              border: '1px solid var(--border-gold)',
              borderRadius: 10, padding: '12px 16px',
              color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 13,
            }}
          />
          <button
            onClick={handleSubmit}
            style={{
              background: 'linear-gradient(135deg, var(--gold), #7a5c0f)',
              color: '#000', borderRadius: 10, padding: '12px 20px',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15,
              whiteSpace: 'nowrap',
            }}
          >
            Unlock \u2192
          </button>
        </div>

        {hasKey && (
          <button
            onClick={() => { onRemove(); setInput(''); }}
            style={{
              width: '100%', marginTop: 10,
              border: '1px solid rgba(239,68,68,.25)',
              borderRadius: 8, padding: 8,
              color: 'rgba(239,68,68,.5)',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.06em',
            }}
          >
            Remove Key & Clear Cache
          </button>
        )}
      </div>
    </div>
  );
});
