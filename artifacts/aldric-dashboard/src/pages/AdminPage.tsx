import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { EnvoiLogo } from '@/components/EnvoiLogo';
import { ApplicationDrawer } from '@/components/admin/ApplicationDrawer';
import { formatDate, formatSubmitted, FormChip, SignalBars, StatusPill } from '@/components/admin/AdminBits';
import {
  getApplications,
  getWhatsappStatuses,
  type AdminApplication,
  type AdminForm,
  type AdminStatus,
  type BrevoConnection,
  type ReplyState,
} from '@/lib/admin-api';
import { leadSignal } from '@/lib/admin-lead-signal';
import { FORM_NAMES, SEQUENCE_DAYS, sequenceState, STEP_NAMES, TEMPLATES } from '@/lib/admin-sequences';

// Admin review dashboard at /envoi-dashboard/admin. Unauthenticated by the
// owner's choice; kept out of search engines with a noindex meta tag (plus
// robots.txt and X-Robots-Tag on the API).

type View = 'queue' | 'followups' | 'templates';
const TITLES: Record<View, string> = { queue: 'Applications', followups: 'WhatsApp follow-ups', templates: 'Message templates' };

const NAV_ICONS: Record<View, ReactElement> = {
  queue: (
    <svg viewBox="0 0 24 24" className="w-[19px] h-[19px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  followups: (
    <svg viewBox="0 0 24 24" className="w-[19px] h-[19px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  ),
  templates: (
    <svg viewBox="0 0 24 24" className="w-[19px] h-[19px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
};

function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: [T, string][]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="inline-flex bg-[#F8F9FB] rounded-full p-1 gap-0.5 max-w-full overflow-x-auto" role="group" aria-label={label}>
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={`px-3.5 py-[7px] rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${value === v ? 'bg-white text-black shadow-[0_1px_2px_rgba(11,15,25,0.08)]' : 'text-gray-500 hover:text-black'}`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

const th = 'text-left text-[11.5px] font-medium tracking-[0.06em] uppercase text-gray-400 px-4 py-3 border-b border-[#ECEEF2] whitespace-nowrap';
const td = 'px-4 py-3.5 border-b border-[#ECEEF2] align-middle';

export default function AdminPage() {
  const [apps, setApps] = useState<AdminApplication[]>([]);
  const [brevo, setBrevo] = useState<BrevoConnection>({ connected: false, missing: [] });
  const [replies, setReplies] = useState<Record<string, ReplyState>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [view, setView] = useState<View>('queue');
  const [form, setForm] = useState<'all' | AdminForm>('all');
  const [status, setStatus] = useState<'all' | AdminStatus>('new');
  const [query, setQuery] = useState('');
  const [openRef, setOpenRef] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Envoi & Co Admin';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  const load = useCallback(async () => {
    setLoadError('');
    try {
      const data = await getApplications();
      setApps(data.applications);
      setBrevo(data.brevo);
      if (data.brevo.connected && data.applications.some((a) => a.status === 'approved')) {
        getWhatsappStatuses().then((r) => setReplies(r.statuses)).catch(() => {});
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load applications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!openRef) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenRef(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openRef]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 3500);
  }, []);

  const replaceApp = useCallback((updated: AdminApplication) => {
    setApps((prev) => prev.map((a) => (a.reference === updated.reference ? updated : a)));
  }, []);

  const pending = apps.filter((a) => a.status === 'new');
  const approved = apps.filter((a) => a.status === 'approved');
  const repliedCount = approved.filter((a) => sequenceState(a, replies[a.reference])?.kind === 'replied').length;
  const runningCount = approved.filter((a) => sequenceState(a, replies[a.reference])?.kind === 'running').length;
  const weekAgo = Date.now() - 7 * 86_400_000;

  const stats: [string, string | number, string][] = [
    ['To review', pending.length, `${pending.filter((a) => leadSignal(a).level === 'strong').length} with a strong signal`],
    ['New this week', apps.filter((a) => Date.parse(a.submittedAt) >= weekAgo).length, 'Across both forms'],
    ['Approved', approved.length, `${runningCount} in the WhatsApp sequence`],
    ['Reply rate', approved.length ? `${Math.round((repliedCount / approved.length) * 100)}%` : '–', `${repliedCount} of ${approved.length} approved replied`],
  ];

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps
      .filter((a) => form === 'all' || a.form === form)
      .filter((a) => status === 'all' || a.status === status)
      .filter((a) => !q || [a.fullName, a.email, a.reference, a.country, a.whatsappNumber].join(' ').toLowerCase().includes(q));
  }, [apps, form, status, query]);

  const openApp = apps.find((a) => a.reference === openRef) ?? null;
  const headline = (a: AdminApplication) => a.answers.find((x) => x.key === (a.form === 'move-money' ? 'amount' : 'wealth'))?.answer ?? '–';
  const timeline = (a: AdminApplication) => a.answers.find((x) => x.key === 'timeline')?.answer ?? '–';

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row text-black">
      <aside className="md:w-[260px] flex-shrink-0 border-b md:border-b-0 md:border-r border-[#ECEEF2] px-4 py-3.5 md:py-6 flex flex-col gap-3 md:gap-10">
        <div className="px-2 flex items-baseline gap-2">
          <EnvoiLogo />
          <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-gray-500">Admin</span>
        </div>
        <nav className="flex md:flex-col gap-1 md:gap-1.5 overflow-x-auto" aria-label="Admin sections">
          {(Object.keys(TITLES) as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-current={view === v ? 'page' : undefined}
              className={`flex items-center gap-3.5 px-3.5 md:px-5 py-2.5 md:py-[13px] rounded-full text-[14px] md:text-[15px] font-medium text-left whitespace-nowrap transition-colors ${view === v ? 'bg-[#E6F1FF]' : 'hover:bg-gray-100'}`}
            >
              {NAV_ICONS[v]}
              {TITLES[v]}
              {v === 'queue' && pending.length > 0 && (
                <span className="ml-auto text-xs font-medium bg-[#0F61E9] text-white rounded-full px-2 py-px tabular-nums">{pending.length}</span>
              )}
            </button>
          ))}
        </nav>
        <p className="hidden md:block mt-auto px-2 text-xs text-gray-500 leading-relaxed">
          Approving an applicant adds them to Brevo, which sends the WhatsApp sequence for their form.
        </p>
      </aside>

      <main className="flex-1 min-w-0 px-4 md:px-10 pb-12">
        <div className="h-16 md:h-[76px] flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-[30px] font-semibold tracking-[-0.04em]">{TITLES[view]}</h1>
          <div className="hidden md:flex items-center gap-2.5 text-[13px] text-gray-500" title={brevo.connected ? undefined : `Missing: ${brevo.missing.join(', ')}`}>
            <span className={`w-2 h-2 rounded-full ${brevo.connected ? 'bg-green-600' : 'bg-orange-500'}`} />
            {loading ? 'Checking WhatsApp…' : brevo.connected ? 'WhatsApp connected via Brevo' : 'WhatsApp not connected yet'}
          </div>
        </div>

        {loadError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex flex-wrap items-center gap-3" role="alert">
            {loadError}
            <button type="button" onClick={() => { setLoading(true); load(); }} className="font-medium underline">Try again</button>
          </div>
        )}

        {view === 'queue' && (
          <section>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-7">
              {stats.map(([k, v, s]) => (
                <div key={k} className="bg-[#F8F9FB] rounded-xl px-5 py-[18px] flex flex-col gap-1.5">
                  <span className="text-[12.5px] text-gray-500 font-medium">{k}</span>
                  <span className="text-[28px] font-semibold tracking-[-0.03em] tabular-nums">{loading ? '–' : v}</span>
                  <span className="text-xs text-gray-400">{s}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2.5 items-center mb-3.5">
              <Segmented<'all' | AdminForm> label="Form" value={form} onChange={setForm} options={[['all', 'All forms'], ['move-money', 'Move Money Abroad'], ['private-banking', 'Private Banking']]} />
              <Segmented<'all' | AdminStatus> label="Status" value={status} onChange={setStatus} options={[['new', 'To review'], ['approved', 'Approved'], ['hold', 'On hold'], ['rejected', 'Rejected'], ['all', 'All']]} />
              <label className="relative flex-1 basis-full md:basis-auto min-w-[180px] md:max-w-[320px] md:ml-auto" htmlFor="admin-search">
                <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                <input
                  id="admin-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, email, reference"
                  className="w-full border border-[#ECEEF2] rounded-full pl-9 pr-3.5 py-[9px] text-[13px] focus:outline-none focus:border-[#0F61E9]"
                />
              </label>
            </div>

            <div className="border border-[#ECEEF2] rounded-xl overflow-x-auto">
              <table className="w-full border-collapse min-w-[760px] text-sm">
                <thead>
                  <tr>
                    <th className={th}>Applicant</th><th className={th}>Form</th><th className={th}>Amount / wealth</th>
                    <th className={th}>Timeline</th><th className={th}>Lead signal</th><th className={th}>Status</th><th className={th}>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">Loading applications…</td></tr>}
                  {!loading && visible.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">{apps.length === 0 ? 'No applications yet. They appear here as soon as someone submits either form.' : 'No applications match these filters.'}</td></tr>
                  )}
                  {!loading && visible.map((a) => (
                    <tr
                      key={a.reference}
                      tabIndex={0}
                      onClick={() => setOpenRef(a.reference)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setOpenRef(a.reference); }}
                      className={`cursor-pointer transition-colors last:[&>td]:border-b-0 ${openRef === a.reference ? 'bg-[#E6F1FF]' : 'hover:bg-[#FAFBFC]'}`}
                    >
                      <td className={td}>
                        <div className="font-medium">{a.fullName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{a.country} · <span className="tabular-nums">{a.reference}</span></div>
                      </td>
                      <td className={td}><FormChip form={a.form} /></td>
                      <td className={`${td} tabular-nums whitespace-nowrap`}>{headline(a)}</td>
                      <td className={td}>{timeline(a)}</td>
                      <td className={td}><SignalBars level={leadSignal(a).level} /></td>
                      <td className={td}><StatusPill app={a} reply={replies[a.reference]} /></td>
                      <td className={`${td} tabular-nums whitespace-nowrap text-gray-600`}>{formatSubmitted(a.submittedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3.5 text-[12.5px] text-gray-500">
              Lead signal is a quick read of the multiple-choice answers (amount, timeline, funds ready, authority) so the strongest applicants stand out. You still make the call.
            </p>
          </section>
        )}

        {view === 'followups' && (
          <section>
            <div className="border border-[#ECEEF2] rounded-xl overflow-x-auto">
              <table className="w-full border-collapse min-w-[680px] text-sm">
                <thead>
                  <tr><th className={th}>Applicant</th><th className={th}>Form</th><th className={th}>Approved</th><th className={th}>Progress</th><th className={th}>Next message</th></tr>
                </thead>
                <tbody>
                  {approved.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">Nobody has been approved yet. Approved applicants and their WhatsApp progress show here.</td></tr>
                  )}
                  {[...approved].sort((x, y) => (y.approvedAt ?? '').localeCompare(x.approvedAt ?? '')).map((a) => {
                    const seq = sequenceState(a, replies[a.reference]);
                    const next = seq?.kind === 'running'
                      ? `${STEP_NAMES[seq.sent].split(' · ')[0]} in ${seq.nextInDays} day${seq.nextInDays === 1 ? '' : 's'}`
                      : seq?.kind === 'replied' ? 'None, they replied' : seq?.kind === 'stopped' ? 'None, follow-ups stopped' : 'None, sequence ended';
                    return (
                      <tr key={a.reference} tabIndex={0} onClick={() => setOpenRef(a.reference)} onKeyDown={(e) => { if (e.key === 'Enter') setOpenRef(a.reference); }} className="cursor-pointer hover:bg-[#FAFBFC] last:[&>td]:border-b-0">
                        <td className={td}><div className="font-medium">{a.fullName}</div><div className="text-xs text-gray-500 mt-0.5 tabular-nums">{a.whatsappNumber}</div></td>
                        <td className={td}><FormChip form={a.form} /></td>
                        <td className={`${td} tabular-nums`}>{a.approvedAt ? formatDate(a.approvedAt) : '–'}</td>
                        <td className={td}><StatusPill app={a} reply={replies[a.reference]} /></td>
                        <td className={td}>{next}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3.5 text-[12.5px] text-gray-500">
              Progress is estimated from the approval date and Brevo's schedule. Replies land in Brevo Conversations, where your team carries on the chat.
            </p>
          </section>
        )}

        {view === 'templates' && (
          <section className="flex flex-col gap-7">
            {(Object.keys(TEMPLATES) as AdminForm[]).map((f) => (
              <div key={f}>
                <h2 className="text-lg font-semibold tracking-[-0.02em] mb-3 flex items-center gap-2.5"><FormChip form={f} /><span className="sr-only">{FORM_NAMES[f]}</span></h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
                  {TEMPLATES[f].map((text, i) => (
                    <div key={i} className="border border-[#ECEEF2] rounded-xl p-4 flex flex-col gap-2 min-w-0">
                      <div className="flex justify-between items-center gap-2 text-[13.5px] font-medium">
                        <span>{STEP_NAMES[i]}</span>
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-sm border bg-[#E6F1FF] text-[#0F61E9] border-blue-200">Day {SEQUENCE_DAYS[i]}</span>
                      </div>
                      <p className="text-[13px] text-gray-500 leading-relaxed whitespace-pre-line">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <p className="text-[12.5px] text-gray-500">
              Read-only. The live copies are the Meta-approved templates in Brevo; {'{{1}}'} becomes the applicant's first name. The sequence stops as soon as the applicant replies or asks not to be contacted.
            </p>
          </section>
        )}
      </main>

      {openApp && (
        <ApplicationDrawer
          app={openApp}
          all={apps}
          reply={replies[openApp.reference]}
          whatsappConnected={brevo.connected}
          missingConfig={brevo.missing}
          onClose={() => setOpenRef(null)}
          onChanged={replaceApp}
          onToast={showToast}
        />
      )}

      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-[calc(24px+env(safe-area-inset-bottom,0px))] z-[80] bg-[#020B2B] text-white px-[18px] py-3 rounded-[10px] text-[13.5px] shadow-[0_8px_24px_rgba(2,11,43,0.25)] max-w-[calc(100vw-32px)]" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
