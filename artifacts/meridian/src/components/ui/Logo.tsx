import { Link } from 'wouter';

interface LogoProps {
  theme?: 'light' | 'dark';
  className?: string;
}

export function Logo({ theme = 'light', className = '' }: LogoProps) {
  const textColor = theme === 'dark' ? '#FFFFFF' : '#0A0A0A';

  // Bars are 22px tall (y: 0→22).
  // Instrument Sans cap-height ratio ≈ 0.727, so fontSize = 22 / 0.727 ≈ 30.3
  // to make capital letters exactly the same height as the bars.
  // Text baseline sits at y=22 so cap-tops align with y=0 (top of bars).
  // Gap between last bar (ends x=24) and text start: 12px → x=36.

  return (
    <Link href="/" className={`inline-flex items-center group ${className}`}>
      <svg
        width="160"
        height="22"
        viewBox="0 0 160 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Meridian"
        style={{ display: 'block' }}
      >
        {/* Three equal-height blue bars */}
        <rect x="0"  y="0" width="6" height="22" fill="#1A56E8" />
        <rect x="9"  y="0" width="6" height="22" fill="#1A56E8" />
        <rect x="18" y="0" width="6" height="22" fill="#1A56E8" />

        {/* ERIDIAN — cap height matches bar height; 4 px gap after last bar */}
        <text
          x="28"
          y="22"
          dominantBaseline="auto"
          fontFamily="'Instrument Sans', 'Arial Black', 'Arial', sans-serif"
          fontWeight="800"
          fontSize="30.3"
          letterSpacing="1"
          fill={textColor}
        >
          ERIDIAN
        </text>
      </svg>
    </Link>
  );
}
