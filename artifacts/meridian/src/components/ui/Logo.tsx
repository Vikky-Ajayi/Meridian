import { Link } from 'wouter';

interface LogoProps {
  theme?: 'light' | 'dark';
  className?: string;
}

export function Logo({ theme = 'light', className = '' }: LogoProps) {
  const wordColor  = theme === 'dark' ? '#FFFFFF' : '#0D0D0D';
  const subColor   = theme === 'dark' ? '#CCCCCC' : '#4A4A4A';

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-[9px] ${className}`}
      style={{ textDecoration: 'none' }}
    >
      {/* Two-peak mountain icon */}
      <svg
        width="28"
        height="22"
        viewBox="0 0 28 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ display: 'block', flexShrink: 0 }}
      >
        {/* Left peak — taller, wider */}
        <polygon points="0,22 10,0 19,22" fill="#1767e8" />
        {/* Right peak — shorter, offset right */}
        <polygon points="15,22 22,5 28,22" fill="#1767e8" />
      </svg>

      {/* Wordmark */}
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '6px', whiteSpace: 'nowrap' }}>
        <span style={{
          fontFamily: "'Instrument Sans', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: 800,
          letterSpacing: '-0.01em',
          color: wordColor,
          lineHeight: 1,
        }}>
          ALDRIC
        </span>
        <span style={{
          fontFamily: "'Instrument Sans', Arial, sans-serif",
          fontSize: '16px',
          fontWeight: 400,
          letterSpacing: '-0.01em',
          color: subColor,
          lineHeight: 1,
        }}>
          Private
        </span>
      </span>
    </Link>
  );
}
