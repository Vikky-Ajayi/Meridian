import type { AdminApplication, AdminForm } from '@/lib/admin-api';
import { FORM_NAMES, sequenceState } from '@/lib/admin-sequences';
import type { SignalLevel } from '@/lib/admin-lead-signal';

export function FormChip({ form }: { form: AdminForm }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium whitespace-nowrap">
      <i className={`inline-block w-2 h-2 rounded-[2px] ${form === 'move-money' ? 'bg-[#0F61E9]' : 'bg-[#020B2B]'}`} />
      {FORM_NAMES[form]}
    </span>
  );
}

const PILL = {
  blue: 'bg-[#E6F1FF] text-[#0F61E9] border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  grey: 'bg-gray-100 text-gray-500 border-gray-200',
} as const;

export function statusInfo(app: AdminApplication): { label: string; tone: keyof typeof PILL } {
  const seq = sequenceState(app);
  if (seq) {
    if (seq.kind === 'replied') return { label: 'Replied', tone: 'green' };
    if (seq.kind === 'stopped') return { label: 'Follow-ups stopped', tone: 'grey' };
    if (seq.kind === 'finished') return { label: 'All 5 messages sent', tone: 'grey' };
    if (seq.kind === 'due') return { label: `Message ${seq.next + 1} due`, tone: 'orange' };
    return { label: `Message ${seq.sent} of 5 sent`, tone: 'blue' };
  }
  if (app.status === 'hold') return { label: 'On hold', tone: 'yellow' };
  if (app.status === 'rejected') return { label: 'Rejected', tone: 'red' };
  return { label: 'To review', tone: 'blue' };
}

export function StatusPill({ app }: { app: AdminApplication }) {
  const { label, tone } = statusInfo(app);
  return <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-sm border whitespace-nowrap ${PILL[tone]}`}>{label}</span>;
}

const SIGNAL_LABEL: Record<SignalLevel, string> = { strong: 'Strong', fair: 'Fair', weak: 'Weak' };

export function SignalBars({ level }: { level: SignalLevel }) {
  const lit = level === 'strong' ? 3 : level === 'fair' ? 2 : 1;
  const colour = level === 'strong' ? 'bg-green-600' : level === 'fair' ? 'bg-orange-500' : 'bg-red-600';
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium whitespace-nowrap">
      <span className="inline-flex items-end gap-0.5" aria-hidden="true">
        {[6, 9, 12].map((h, i) => (
          <b key={h} className={`block w-1 rounded-[1px] ${i < lit ? colour : 'bg-gray-200'}`} style={{ height: h }} />
        ))}
      </span>
      {SIGNAL_LABEL[level]}
    </span>
  );
}

export const WhatsAppGlyph = ({ className = 'w-[17px] h-[17px]' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.2-.7-2.7-1.1-4.4-3.8-4.6-4-.1-.2-1.1-1.4-1.1-2.7s.7-1.9 1-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" />
  </svg>
);

export function formatSubmitted(iso: string, now = Date.now()) {
  const date = new Date(iso);
  const days = Math.floor((now - date.getTime()) / 86_400_000);
  if (days <= 0) return `Today, ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const formatDate = (iso: string | number) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

/**
 * Opens a tab synchronously (inside the click) so browsers don't block it,
 * then points it at WhatsApp once the server has recorded the action.
 */
export function openWhatsAppAfter<T>(task: () => Promise<T>, url: string): Promise<T> {
  const tab = window.open('', '_blank');
  return task().then(
    (result) => {
      if (tab) {
        tab.opener = null;
        tab.location.href = url;
      } else {
        window.location.href = url;
      }
      return result;
    },
    (err) => {
      tab?.close();
      throw err;
    },
  );
}
