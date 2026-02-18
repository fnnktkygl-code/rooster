import { memo, useEffect, useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
}

export const SearchBar = memo(function SearchBar({ value, onChange, visible }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={{
      flexShrink: 0, padding: '10px 24px',
      background: 'rgba(8,6,4,.95)',
      borderBottom: '1px solid rgba(201,168,76,.08)',
      animation: 'slideDown 0.2s ease',
    }}>
      <input
        ref={inputRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search language or word\u2026"
        aria-label="Search roosters by language or word"
        style={{
          width: '100%', background: 'var(--bg-elevated)',
          border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)',
          padding: '10px 16px', color: 'var(--text)',
          fontFamily: 'var(--font-display)', fontSize: 16,
        }}
      />
    </div>
  );
});
