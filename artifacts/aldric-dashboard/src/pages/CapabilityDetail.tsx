import { useParams, Link } from 'wouter';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NeedAssistance } from '@/components/NeedAssistance';
import { StatusBadge } from '@/components/StatusBadge';
import { MOCK_CAPABILITIES } from '@/lib/mock-data';

const CAPABILITY_STAGES = ['Submitted', 'Under Review', 'Verified', 'Available for Matching', 'Archived'];

function Timeline({ status }: { status: string }) {
  const currentIdx = CAPABILITY_STAGES.indexOf(status);
  return (
    <div className="space-y-3">
      {CAPABILITY_STAGES.map((stage, i) => {
        const done = i < currentIdx;
        const current = i === currentIdx;
        return (
          <div key={stage} className="flex items-start gap-3">
            <div className="flex flex-col items-center mt-1">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                done ? 'bg-green-500' : current ? 'bg-[#0F61E9]' : 'bg-gray-200'
              }`} />
              {i < CAPABILITY_STAGES.length - 1 && <div className="w-0.5 h-6 bg-gray-200 mt-1" />}
            </div>
            <div>
              <p className={`text-sm font-medium ${current ? 'text-gray-900' : done ? 'text-gray-700' : 'text-gray-400'}`}>{stage}</p>
              {current && <p className="text-xs text-gray-400">Current stage</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CapabilityDetail() {
  const params = useParams<{ id: string }>();
  const cap = MOCK_CAPABILITIES.find(c => c.id === params.id) ?? MOCK_CAPABILITIES[0];

  return (
    <DashboardLayout title="Dashboard">
      <div className="max-w-5xl">
        {/* Back link */}
        <Link href="/dashboard">
          <div className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back to Dashboard
          </div>
        </Link>

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-widest text-gray-400 mb-1">{cap.category}</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{cap.title}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <span>Submitted <strong className="text-gray-900">{cap.dateSubmitted}</strong></span>
            <span className="text-gray-300">·</span>
            <span>Reference <strong className="text-gray-900">{cap.reference}</strong></span>
            <span className="text-gray-300">·</span>
            <span>Status <strong className="text-gray-900">{cap.status}</strong></span>
          </div>
        </div>

        {/* Two-column detail + timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left: Details */}
          <div className="bg-white rounded-xl p-6 space-y-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">Geography / Market</p>
              <p className="font-medium text-gray-900">{cap.geography}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Deal Size</p>
              <p className="font-medium text-gray-900">{cap.dealSize}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Description</p>
              <p className="font-semibold text-gray-900 leading-relaxed">{cap.description}</p>
            </div>
            {cap.priorExperience && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Prior Experience</p>
                <p className="font-semibold text-gray-900 leading-relaxed">{cap.priorExperience}</p>
              </div>
            )}
          </div>

          {/* Right: Timeline */}
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-6">Timeline of Updates</h3>
            <Timeline status={cap.status} />

            <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
              <div className="border-l-2 border-gray-200 pl-3">
                <p className="text-xs font-semibold text-gray-400 mb-1 tracking-wide">28 JUL 2026</p>
                <p className="text-sm text-gray-600">Submission received. Awaiting internal review.</p>
              </div>
              {cap.status === 'Verified' || cap.status === 'Available for Matching' ? (
                <div className="border-l-2 border-gray-200 pl-3">
                  <p className="text-xs font-semibold text-gray-400 mb-1 tracking-wide">29 JUL 2026</p>
                  <p className="text-sm text-gray-600">Verified by our team and made available for matching.</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <NeedAssistance />
      </div>
    </DashboardLayout>
  );
}
