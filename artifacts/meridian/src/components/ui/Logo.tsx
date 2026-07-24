import { Link } from 'wouter';

interface LogoProps {
  theme?: 'light' | 'dark';
  className?: string;
}

export function Logo({ theme = 'light', className = '' }: LogoProps) {
  const textColor = theme === 'dark' ? '#fff' : '#0A0A0A';

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-[10px] ${className}`}
      style={{ textDecoration: 'none' }}
    >
      {/* Caret icon */}
      <svg
        width="22"
        height="20"
        viewBox="0 0 22 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ display: 'block', flexShrink: 0 }}
      >
        <polygon points="2,20 10,2 14,2 7,20" fill="#1767e8" />
        <polygon points="10,2 14,2 22,20 18,20" fill="#1767e8" />
      </svg>

      {/* Wordmark */}
      <span
        style={{
          fontFamily: "'Instrument Sans', Arial, sans-serif",
          fontSize: '15px',
          lineHeight: 1,
          color: textColor,
          whiteSpace: 'nowrap',
          letterSpacing: '-0.02em',
        }}
      >
        <span style={{ fontWeight: 700 }}>Meridian</span>
        <span style={{ fontWeight: 400, marginLeft: '5px' }}>Private</span>
      </span>
    </Link>
  );
}
