import { Link } from 'wouter';
import logoImg from '@/assets/meridian-logo.png';

export function Logo({ theme = 'light', className = '' }: { theme?: 'light' | 'dark', className?: string }) {
  return (
    <Link href="/" className={`flex items-center group ${className}`}>
      <img
        src={logoImg}
        alt="Meridian"
        className={`h-[22px] w-auto object-contain ${theme === 'dark' ? 'brightness-0 invert' : ''}`}
      />
    </Link>
  );
}
