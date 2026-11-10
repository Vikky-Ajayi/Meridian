import { useCallback, useEffect, useRef, useState } from 'react';
import { getThread, restartThread, sendThreadMessage, type Conversation, type Thread } from '@/lib/admin-api';
import { formatDate, FormChip } from './AdminBits';

interface Props {
  conversations: Conversation[];
  loading: boolean;
  selected: string | null;
  onSelect: (waId: string | null) => void;
  onChanged: () => void;
  onOpenApplication: (reference: string) => void;
  repliesConnected: boolean;
}

const time = (iso: string) => {
  const d = new Date(iso);
  const today = new Date().toDateString() === d.toDateString();
  return today ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : formatDate(iso);
};

function Ticks({ status }: { status: string }) {
  if (status === 'failed') return <span className="text-red-600 font-medium">Not delivered</span>;
  const label = status === 'read' ? 'Read' : status === 'delivered' ? 'Delivered' : 'Sent';
  return <span className={status === 'read' ? 'text-[#0F61E9]' : ''}>{label}</span>;
}

export function InboxView({ conversations, loading, selected, onSelect, onChanged, onOpenApplication, repliesConnected }: Props) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [threadError, setThreadError] = useState('');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadThread = useCallback(async (waId: string) => {
    try {
      setThread(await getThread(waId));
      setThreadError('');
    } catch (err) {
      setThreadError(err instanceof Error ? err.message : 'Could not load this conversation.');
    }
  }, []);

  useEffect(() => {
    setThread(null);
    setDraft('');
    setSendError('');
    if (!selected) return;
    loadThread(selected);
    const timer = window.setInterval(() => loadThread(selected), 15_000);
    return () => window.clearInterval(timer);
  }, [selected, loadThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [thread?.messages.length]);

  async function send(action: 'text' | 'restart') {
    if (!selected) return;
    setSending(true);
    setSendError('');
    try {
      setThread(action === 'text' ? await sendThreadMessage(selected, draft) : await restartThread(selected));
      if (action === 'text') setDraft('');
      onChanged();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Could not send.');
    } finally {
      setSending(false);
    }
  }

  const convo = thread?.conversation ?? conversations.find((c) => c.waId === selected) ?? null;

  return (
    <div className="border border-[#ECEEF2] rounded-xl overflow-hidden grid md:grid-cols-[320px_minmax(0,1fr)] md:h-[calc(100vh-140px)] min-h-[480px]">
      <div className={`border-r border-[#ECEEF2] overflow-y-auto ${selected ? 'hidden md:block' : ''}`}>
        {!repliesConnected && (
          <p className="m-3 rounded-lg bg-orange-50 border border-orange-200 px-3 py-2.5 text-xs text-orange-900 leading-relaxed">
            Replies won't appear here until the WhatsApp webhook is set up (WHATSAPP_APP_SECRET and WHATSAPP_WEBHOOK_VERIFY_TOKEN).
          </p>
        )}
        {loading && <p className="p-6 text-sm text-gray-500">Loading conversations…</p>}
        {!loading && conversations.length === 0 && (
          <p className="p-6 text-sm text-gray-500 leading-relaxed">No WhatsApp messages yet. Messages you send and replies you receive appear here.</p>
        )}
        {conversations.map((c) => (
          <button
            key={c.waId}
            type="button"
            onClick={() => onSelect(c.waId)}
            className={`w-full text-left px-4 py-3.5 border-b border-[#ECEEF2] flex flex-col gap-1 transition-colors ${selected === c.waId ? 'bg-[#E6F1FF]' : 'hover:bg-[#FAFBFC]'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={`truncate ${c.awaitingReply ? 'font-semibold' : 'font-medium'}`}>{c.name}</span>
              {c.lastMessage && <span className="text-xs text-gray-400 whitespace-nowrap tabular-nums">{time(c.lastMessage.at)}</span>}
            </div>
            <div className="flex items-center gap-2 min-w-0">
              {c.awaitingReply && <span className="w-2 h-2 rounded-full bg-[#25D366] flex-shrink-0" aria-label="Awaiting your reply" />}
              <span className="text-[13px] text-gray-500 truncate">
                {c.lastMessage?.direction === 'out' && 'You: '}
                {c.lastMessage?.body ?? ''}
              </span>
            </div>
            <div className="text-xs">{c.form ? <FormChip form={c.form} /> : <span className="text-gray-400">Not an applicant</span>}</div>
          </button>
        ))}
      </div>

      <div className={`flex flex-col min-h-0 ${selected ? '' : 'hidden md:flex'}`}>
        {!selected ? (
          <div className="flex-1 grid place-items-center p-8 text-sm text-gray-500 text-center">Choose a conversation to read and reply.</div>
        ) : (
          <>
            <div className="px-4 md:px-5 py-3.5 border-b border-[#ECEEF2] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button type="button" className="md:hidden w-8 h-8 grid place-items-center rounded-full bg-[#F8F9FB]" onClick={() => onSelect(null)} aria-label="Back to conversations">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <div className="min-w-0">
                  <div className="font-medium truncate">{convo?.name ?? `+${selected}`}</div>
                  <div className="text-xs text-gray-500 tabular-nums">+{selected}</div>
                </div>
              </div>
              {convo?.reference && (
                <button type="button" onClick={() => onOpenApplication(convo.reference!)} className="text-[13px] font-medium text-[#0F61E9] whitespace-nowrap hover:underline">
                  Open application
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-5 py-4 flex flex-col gap-2.5 bg-[#FBFBFC] min-h-[240px]">
              {threadError && <p className="text-sm text-red-600">{threadError}</p>}
              {!thread && !threadError && <p className="text-sm text-gray-500">Loading…</p>}
              {thread?.messages.map((m) => (
                <div key={m.id} className={`max-w-[85%] flex flex-col gap-1 ${m.direction === 'out' ? 'self-end items-end' : 'self-start items-start'}`}>
                  <div className={`rounded-[10px] px-3 py-2 text-[13.5px] leading-relaxed whitespace-pre-line break-words shadow-[0_1px_1px_rgba(0,0,0,0.06)] ${m.direction === 'out' ? 'bg-[#DCF8C6] rounded-br-[2px]' : 'bg-white rounded-bl-[2px] border border-[#ECEEF2]'}`}>
                    {m.body}
                  </div>
                  <div className="text-[11px] text-gray-400 flex gap-2 tabular-nums">
                    {m.templateName && <span>Template · {m.templateName}</span>}
                    <span>{time(m.at)}</span>
                    {m.direction === 'out' && <Ticks status={m.status} />}
                  </div>
                  {m.error && <div className="text-[11px] text-red-600 max-w-full">{m.error}</div>}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-[#ECEEF2] p-3 md:p-4 flex flex-col gap-2">
              {sendError && <p className="text-[13px] text-red-600" role="alert">{sendError}</p>}
              {convo?.canReply ? (
                <form
                  className="flex gap-2 items-end"
                  onSubmit={(e) => { e.preventDefault(); if (draft.trim()) send('text'); }}
                >
                  <label htmlFor="inbox-reply" className="sr-only">Reply</label>
                  <textarea
                    id="inbox-reply"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (draft.trim() && !sending) send('text'); } }}
                    rows={2}
                    placeholder="Type a reply. Enter to send, Shift+Enter for a new line."
                    className="flex-1 border border-[#ECEEF2] rounded-[10px] px-3 py-2.5 text-[13.5px] resize-none focus:outline-none focus:border-[#0F61E9]"
                  />
                  <button type="submit" disabled={sending || !draft.trim()} className="rounded-lg px-4 py-2.5 text-sm font-medium bg-black text-white hover:bg-gray-800 disabled:opacity-50">
                    {sending ? 'Sending…' : 'Send'}
                  </button>
                </form>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[13px] text-gray-500 flex-1 min-w-[220px]">
                    {convo?.lastInboundAt
                      ? 'More than 24 hours since their last message, so WhatsApp only allows a template message.'
                      : "They haven't messaged yet, so WhatsApp only allows a template message."}
                  </p>
                  <button type="button" disabled={sending} onClick={() => send('restart')} className="rounded-lg px-4 py-2.5 text-sm font-medium bg-[#F8F9FB] hover:bg-[#EEF0F3] disabled:opacity-50">
                    {sending ? 'Sending…' : 'Send restart message'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
