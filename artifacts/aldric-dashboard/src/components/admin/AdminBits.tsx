import type { AdminApplication, AdminForm, ReplyState } from '@/lib/admin-api';
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

const PILL: Record<string, string> = {
  blue: 'bg-[#E6F1FF] text-[#0F61E9] border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  grey: 'bg-gray-100 text-gray-500 border-gray-200',
};

export function statusInfo(app: AdminApplication, reply: ReplyState | undefined): { label: string; tone: keyof typeof PILL } {
  const seq = sequenceState(app, reply);
  if (seq) {
    if (seq.kind === 'replied') return { label: 'Replied', tone: 'green' };
    if (seq.kind === 'stopped') return { label: 'Follow-ups stopped', tone: 'grey' };
    if (seq.kind === 'finished') return { label: 'Sequence ended', tone: 'grey' };
    return { label: `Message ${seq.sent} of 5 sent`, tone: 'orange' };
  }
  if (app.status === 'hold') return { label: 'On hold', tone: 'yellow' };
  if (app.status === 'rejected') return { label: 'Rejected', tone: 'red' };
  return { label: 'To review', tone: 'blue' };
}

export function StatusPill({ app, reply }: { app: AdminApplication; reply: ReplyState | undefined }) {
  const { label, tone } = statusInfo(app, reply);
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
