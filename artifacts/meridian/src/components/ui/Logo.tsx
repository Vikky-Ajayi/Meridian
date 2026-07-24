import { Link } from 'wouter';
import logoSrc from '@/assets/aldric-private-logo.png';

interface LogoProps {
  theme?: 'light' | 'dark';
  className?: string;
}

export function Logo({ theme = 'light', className = '' }: LogoProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      style={{ textDecoration: 'none' }}
    >
      <img
        src={logoSrc}
        alt="Aldric Private"
        style={{
          height: '22px',
          width: 'auto',
          display: 'block',
          filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'none',
        }}
      />
    </Link>
  );
}
