import { memo, useState } from 'react';

interface FlagProps {
  countryCode: string | null;
  emoji: string;
  size?: number;
  className?: string;
}

export const Flag = memo(function Flag({ countryCode, emoji, size = 40, className }: FlagProps) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!countryCode || imgFailed) {
    return (
      <span
        className={className}
        role="img"
        aria-label="flag"
        style={{ fontSize: size * 0.6, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}
      >
        {emoji}
      </span>
    );
  }

  return (
    <img
      className={className}
      src={`https://flagcdn.com/w${Math.ceil(size * 1.5)}/${countryCode}.png`}
      srcSet={`https://flagcdn.com/w${Math.ceil(size * 3)}/${countryCode}.png 2x`}
      alt={`${countryCode.toUpperCase()} flag`}
      width={size}
      height={Math.round(size * 0.75)}
      loading="lazy"
      onError={() => setImgFailed(true)}
      style={{ objectFit: 'contain', borderRadius: 3 }}
    />
  );
});
