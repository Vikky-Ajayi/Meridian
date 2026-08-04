export function AldricLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-baseline gap-[3px] ${className}`}>
      <span className="font-black text-[#0F61E9] tracking-tight text-[22px] leading-none">ALDRIC</span>
      <span className="text-[13px] font-normal text-gray-500 leading-none">Private</span>
    </span>
  );
}
