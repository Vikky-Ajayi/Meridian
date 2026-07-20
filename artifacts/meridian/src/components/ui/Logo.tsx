import { Link } from 'wouter';

export function Logo({ theme = 'light', className = '' }: { theme?: 'light' | 'dark', className?: string }) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-[#000B2D]';
  return (
    <Link href="/" className={`flex items-center group leading-none ${className}`}>
      {/* Three equal-height bars that visually form the "M" */}
      <span className="flex items-center gap-[3px] mr-[2px]">
        <span className="block w-[4px] h-[20px] bg-[#0F61E9]" />
        <span className="block w-[4px] h-[20px] bg-[#0F61E9]" />
        <span className="block w-[4px] h-[20px] bg-[#0F61E9]" />
      </span>
      {/* ERIDIAN — together with bars reads as |||ERIDIAN = MERIDIAN */}
      <span className={`font-bold text-[17px] tracking-[0.08em] uppercase ${textColor}`}>
        ERIDIAN
      </span>
    </Link>
  );
}
