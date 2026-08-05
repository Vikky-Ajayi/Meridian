export function AldricLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src="/aldric-dashboard/assets/aldric-logo.svg"
      alt="ALDRIC Private"
      className={className}
      style={{ height: '22px', width: 'auto', display: 'block' }}
    />
  );
}
