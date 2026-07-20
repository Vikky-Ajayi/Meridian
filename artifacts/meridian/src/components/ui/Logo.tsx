import { Link } from 'wouter';

export function Logo({ theme = 'light', className = '' }: { theme?: 'light' | 'dark', className?: string }) {
  const isDark = theme === 'dark';
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="flex items-end gap-[3px] h-6">
        <div className="w-1.5 h-6 bg-[#0F61E9]"></div>
        <div className="w-1.5 h-[18px] bg-[#0F61E9]"></div>
        <div className="w-1.5 h-3 bg-[#0F61E9]"></div>
      </div>
      <span className={`font-bold text-xl tracking-[0.15em] uppercase ${isDark ? 'text-white' : 'text-[#000B2D]'}`}>
        Meridian
      </span>
    </Link>
  );
}
