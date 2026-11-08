import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  approveApplication,
  saveApplicationNote,
  setApplicationStatus,
  stopApplicationFollowUps,
  type AdminApplication,
  type ReplyState,
} from '@/lib/admin-api';
import { fillTemplate, firstName, sequenceState, SEQUENCE_DAYS, STEP_NAMES, TEMPLATES } from '@/lib/admin-sequences';
import { findDuplicates, leadSignal } from '@/lib/admin-lead-signal';
import { formatDate, FormChip, SignalBars, StatusPill } from './AdminBits';

interface Props {
  app: AdminApplication;
  all: AdminApplication[];
  reply: ReplyState | undefined;
  whatsappConnected: boolean;
  missingConfig: string[];
  onClose: () => void;
  onChanged: (app: AdminApplication) => void;
  onToast: (message: string) => void;
}

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-[11.5px] font-medium tracking-[0.08em] uppercase text-gray-400 mb-2.5">{children}</h3>
);

const WhatsAppGlyph = () => (
  <svg viewBox="0 0 24 24" className="w-[17px] h-[17px]" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.2-.7-2.7-1.1-4.4-3.8-4.6-4-.1-.2-1.1-1.4-1.1-2.7s.7-1.9 1-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.4.6-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" />
  </svg>
);

export function ApplicationDrawer({ app, all, reply, whatsappConnected, missingConfig, onClose, onChanged, onToast }: Props) {
  const [note, setNote] = useState(app.note);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setNote(app.note);
    setError('');
  }, [app.reference, app.note]);

  useEffect(() => {
    closeRef.current?.focus();
  }, [app.reference]);

  const signal = leadSignal(app);
  const duplicates = findDuplicates(app, all);
  const seq = sequenceState(app, reply);
  const submitted = new Date(app.submittedAt);
  const name = firstName(app.fullName);

  async function run(label: string, action: () => Promise<{ application: AdminApplication }>, done: string) {
    setBusy(label);
    setError('');
    try {
      const { application } = await action();
      onChanged(application);
      onToast(done);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setBusy(null);
    }
  }

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(app.whatsappNumber);
      onToast('WhatsApp number copied.');
    } catch {
      onToast(`WhatsApp number: ${app.whatsappNumber}`);
    }
  }

  const btn = 'inline-flex items-center justify-center gap-2 rounded-lg px-[18px] py-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const ghost = `${btn} bg-[#F8F9FB] hover:bg-[#EEF0F3] text-black`;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#020B2B]/30" onClick={onClose} aria-hidden="true" />
      <aside
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[560px] bg-white flex flex-col shadow-[-12px_0_40px_rgba(2,11,43,0.12)]"
        aria-label={`Application from ${app.fullName}`}
      >
        <div className="px-5 md:px-7 pt-[22px] pb-[18px] border-b border-[#ECEEF2] flex flex-col gap-2.5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-black">{app.fullName}</h2>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="w-[34px] h-[34px] rounded-full bg-[#F8F9FB] grid place-items-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-gray-500">
            <FormChip form={app.form} />
            <span>·</span>
            <span className="tabular-nums">{app.reference}</span>
            <span>·</span>
            <span>
              Submitted {formatDate(app.submittedAt)}, {submitted.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <StatusPill app={app} reply={reply} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 md:px-7 py-[22px] flex flex-col gap-[26px]">
          {duplicates.length > 0 && (
            <div className="rounded-[10px] border border-orange-200 bg-orange-50 px-3.5 py-3 text-[13px] leading-relaxed text-orange-900">
              <b className="font-medium">Possible duplicate.</b> Same email or WhatsApp number as{' '}
              {duplicates.map((d) => `${d.reference} (${d.status === 'new' ? 'to review' : d.status})`).join(', ')}.
            </div>
          )}

          <section>
            <SectionTitle>Contact</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                ['WhatsApp', app.whatsappNumber],
                ['Email', app.email],
                ['Country of residence', app.country],
                ['First name used in messages', name],
              ].map(([k, v]) => (
                <div key={k} className="bg-[#F8F9FB] rounded-[10px] px-3.5 py-3 min-w-0">
                  <div className="text-xs text-gray-500">{k}</div>
                  <div className="font-medium mt-0.5 break-words tabular-nums">{v || '–'}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle>Lead signal</SectionTitle>
            <div className="flex flex-col gap-2.5">
              <SignalBars level={signal.level} />
              <ul className="flex flex-col gap-1.5 text-[13px]">
                {signal.reasons.map((r) => (
                  <li key={r.text} className="flex items-baseline gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 -translate-y-px ${r.tone === 'good' ? 'bg-green-600' : r.tone === 'poor' ? 'bg-red-600' : 'bg-orange-500'}`} />
                    {r.text}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <SectionTitle>Answers</SectionTitle>
            <dl className="flex flex-col">
              {app.answers.map((x) => (
                <div key={x.key} className="py-[11px] border-b border-[#ECEEF2] last:border-b-0 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-4">
                  <dt className="text-[13px] text-gray-500 leading-snug">{x.question}</dt>
                  <dd className="text-[13.5px] font-medium leading-snug whitespace-pre-line break-words">{x.answer || '–'}</dd>
                </div>
              ))}
            </dl>
          </section>

          {seq && app.approvedAt && (
            <section>
              <SectionTitle>WhatsApp sequence</SectionTitle>
              <ol className="flex flex-col">
                {SEQUENCE_DAYS.map((d, i) => {
                  const when = Date.parse(app.approvedAt!) + d * 86_400_000;
                  const sent = i < seq.sent;
                  const isNext = seq.kind === 'running' && i === seq.sent;
                  const cancelled = !sent && (seq.kind === 'replied' || seq.kind === 'stopped');
                  const note = sent
                    ? `Sent around ${formatDate(when)}`
                    : cancelled
                      ? seq.kind === 'replied' ? 'Cancelled, applicant replied' : 'Cancelled, follow-ups stopped'
                      : isNext ? `Sends around ${formatDate(when)} if no reply` : `Scheduled for ${formatDate(when)}`;
                  return (
                    <li key={d} className={`relative grid grid-cols-[20px_minmax(0,1fr)_auto] gap-3 items-start pb-3.5 ${cancelled ? 'opacity-45' : ''}`}>
                      {i < SEQUENCE_DAYS.length - 1 && <span className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-[#ECEEF2]" />}
                      <span className={`relative z-[1] w-5 h-5 rounded-full border-2 grid place-items-center ${sent ? 'bg-[#25D366] border-[#25D366]' : isNext ? 'bg-white border-orange-500' : 'bg-white border-[#ECEEF2]'}`}>
                        {sent && <svg viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="white" strokeWidth={2}><path d="M2.5 6.5l2.2 2L9.5 3.5" /></svg>}
                      </span>
                      <div>
                        <div className="text-[13.5px] font-medium">{STEP_NAMES[i]}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{note}</div>
                      </div>
                      <span className="text-xs text-gray-500 tabular-nums whitespace-nowrap">Day {d}</span>
                    </li>
                  );
                })}
              </ol>
              <p className="text-xs text-gray-500">
                {seq.kind === 'replied'
                  ? 'They replied, so Brevo stopped the follow-ups. Continue the chat in Brevo Conversations.'
                  : 'Dates are estimated from the approval date. Brevo stops the follow-ups as soon as they reply.'}
              </p>
            </section>
          )}

          <section>
            <SectionTitle><label htmlFor={`note-${app.reference}`}>Internal note</label></SectionTitle>
            <textarea
              id={`note-${app.reference}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Only your team sees this. Why you approved, rejected or held them."
              className="w-full min-h-[80px] border border-[#ECEEF2] rounded-[10px] px-3 py-2.5 text-[13px] resize-y focus:outline-none focus:border-[#0F61E9]"
            />
            {note !== app.note && (
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  className={`${btn} py-2 bg-black text-white hover:bg-gray-800`}
                  disabled={busy !== null}
                  onClick={() => run('note', () => saveApplicationNote(app.reference, note), 'Note saved.')}
                >
                  {busy === 'note' ? 'Saving…' : 'Save note'}
                </button>
                <button type="button" className={`${ghost} py-2`} onClick={() => setNote(app.note)}>Discard</button>
              </div>
            )}
          </section>
        </div>

        <div className="border-t border-[#ECEEF2] px-5 md:px-7 pt-4 pb-[calc(16px+env(safe-area-inset-bottom,0px))] flex flex-col gap-3">
          {error && <p className="text-[13px] text-red-600" role="alert">{error}</p>}
          {!whatsappConnected && (app.status === 'new' || app.status === 'hold') && (
            <p className="text-[13px] text-gray-500">
              Approving is off until WhatsApp is connected. Missing on the API server: {missingConfig.join(', ')}.
            </p>
          )}
          <div className="flex flex-wrap gap-2.5">
            {(app.status === 'new' || app.status === 'hold') && (
              <>
                <button
                  type="button"
                  className={`${btn} flex-1 min-w-[200px] bg-black text-white hover:bg-gray-800`}
                  disabled={!whatsappConnected || busy !== null}
                  onClick={() => setApproving(true)}
                >
                  <WhatsAppGlyph />
                  Approve &amp; send WhatsApp
                </button>
                {app.status === 'new' ? (
                  <button type="button" className={ghost} disabled={busy !== null} onClick={() => run('hold', () => setApplicationStatus(app.reference, 'hold'), `${name} is on hold.`)}>
                    {busy === 'hold' ? 'Saving…' : 'Put on hold'}
                  </button>
                ) : (
                  <button type="button" className={ghost} disabled={busy !== null} onClick={() => run('new', () => setApplicationStatus(app.reference, 'new'), `${name} is back in the review queue.`)}>
                    {busy === 'new' ? 'Saving…' : 'Back to review'}
                  </button>
                )}
                <button
                  type="button"
                  className={`${btn} bg-red-50 text-red-600 hover:bg-red-100`}
                  disabled={busy !== null}
                  onClick={() => run('rejected', () => setApplicationStatus(app.reference, 'rejected'), `${name} rejected. No message sent.`)}
                >
                  {busy === 'rejected' ? 'Saving…' : 'Reject'}
                </button>
              </>
            )}
            {app.status === 'rejected' && (
              <button type="button" className={ghost} disabled={busy !== null} onClick={() => run('new', () => setApplicationStatus(app.reference, 'new'), `${name} is back in the review queue.`)}>
                {busy === 'new' ? 'Saving…' : 'Move back to review'}
              </button>
            )}
            {app.status === 'approved' && (
              <>
                {seq?.kind === 'running' && (
                  <button type="button" className={ghost} disabled={busy !== null} onClick={() => run('stop', () => stopApplicationFollowUps(app.reference), `Follow-ups stopped for ${name}.`)}>
                    {busy === 'stop' ? 'Stopping…' : 'Stop follow-ups'}
                  </button>
                )}
                <button type="button" className={ghost} onClick={copyNumber}>Copy WhatsApp number</button>
              </>
            )}
          </div>
        </div>
      </aside>

      {approving && (
        <ApproveDialog
          app={app}
          onCancel={() => setApproving(false)}
          onApproved={(updated) => {
            setApproving(false);
            onChanged(updated);
            onToast(`Approved. Message 1 is on its way to ${name} on WhatsApp.`);
          }}
        />
      )}
    </>
  );
}

function ApproveDialog({ app, onCancel, onApproved }: { app: AdminApplication; onCancel: () => void; onApproved: (app: AdminApplication) => void }) {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const confirmRef = useRef<HTMLButtonElement>(null);
  const message = fillTemplate(TEMPLATES[app.form][0], app);

  useEffect(() => {
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !sending) {
        e.stopPropagation();
        onCancel();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onCancel, sending]);

  async function confirm() {
    setSending(true);
    setError('');
    try {
      const { application } = await approveApplication(app.reference);
      onApproved(application);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not approve. Try again.');
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4 bg-[#020B2B]/45" role="dialog" aria-modal="true" aria-labelledby="approve-title" onClick={(e) => { if (e.target === e.currentTarget && !sending) onCancel(); }}>
      <div className="bg-white rounded-2xl w-full max-w-[520px] max-h-[calc(100vh-32px)] overflow-y-auto flex flex-col">
        <header className="px-6 pt-[22px] pb-1.5">
          <h2 id="approve-title" className="text-[21px] font-semibold tracking-[-0.03em] mb-1.5">Approve {firstName(app.fullName)}?</h2>
          <p className="text-[13.5px] text-gray-500 leading-relaxed">
            Brevo sends this WhatsApp message now. If they don't reply, it sends up to four follow-ups over 14 days and stops as soon as they reply.
          </p>
        </header>
        <div className="mx-6 my-4 bg-[#EFE7DD] rounded-xl p-3.5 flex flex-col gap-2">
          <div className="text-xs text-[#54656F] flex flex-wrap justify-between gap-2">
            <span>To {app.fullName} · {app.whatsappNumber}</span>
            <span>From Envoi &amp; Co</span>
          </div>
          <div className="self-end max-w-[92%] bg-[#DCF8C6] rounded-[10px] rounded-br-[2px] px-3 pt-2.5 pb-1.5 text-[13.5px] leading-relaxed text-[#111B21] whitespace-pre-line shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
            {message}
          </div>
        </div>
        {error && <p className="px-6 text-[13px] text-red-600" role="alert">{error}</p>}
        <footer className="px-6 pt-4 pb-[22px] flex flex-wrap justify-end gap-2.5">
          <button type="button" onClick={onCancel} disabled={sending} className="rounded-lg px-[18px] py-3 text-sm font-medium bg-[#F8F9FB] hover:bg-[#EEF0F3] disabled:opacity-50">
            Cancel
          </button>
          <button ref={confirmRef} type="button" onClick={confirm} disabled={sending} className="rounded-lg px-[18px] py-3 text-sm font-medium bg-black text-white hover:bg-gray-800 disabled:opacity-60">
            {sending ? 'Approving…' : 'Approve and send'}
          </button>
        </footer>
      </div>
    </div>
  );
}
