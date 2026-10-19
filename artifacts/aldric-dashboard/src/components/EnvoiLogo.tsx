export function EnvoiLogo({ className = '' }: { className?: string }) {
  return (
    <img
      src="/aldric-dashboard/assets/envoi-logo.svg"
      alt="Envoi & Co"
      className={className}
      style={{ height: '22px', width: 'auto', display: 'block' }}
    />
  );
}
