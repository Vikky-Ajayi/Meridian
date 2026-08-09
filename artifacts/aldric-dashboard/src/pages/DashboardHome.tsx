import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { NeedAssistance } from '@/components/NeedAssistance';
import { useAuth } from '@/lib/auth-context';
import { getDashboardSubmissions, type DashboardCapability, type DashboardRequirement } from '@/lib/submissions-api';

/* Share/external-link arrow — matches the design's curved arrow */
function ShareArrow() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6m0 0v6m0-6L10 14"/>
    </svg>
  );
}

function ActionCard({ href, iconBg, icon, title, desc }: { href: string; iconBg: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link href={href}>
      <div className="bg-[#F8F9FB] rounded-xl p-6 cursor-pointer hover:bg-gray-100 transition-colors h-full">
        <div className={`w-11 h-11 ${iconBg} rounded-full flex items-center justify-center mb-4 text-white`}>{icon}</div>
        <h3 className="text-gray-900 font-bold text-lg mb-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-5">{desc}</p>
        <ShareArrow />
      </div>
    </Link>
  );
}

function CapabilityCard({ cap }: { cap: DashboardCapability }) {
  return (
    <Link href={`/dashboard/capability/${cap.id}`}>
      <div className="bg-white rounded-xl border border-gray-100 p-5 cursor-pointer hover:shadow-sm transition-shadow">
        <p className="text-xs font-semibold tracking-widest text-gray-400 mb-1">{cap.category}</p>
        <h4 className="font-bold text-gray-900 text-lg mb-2">{cap.title}</h4>
        <div className="mb-4"><StatusBadge status={cap.status} /></div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Date Submitted</span>
            <span className="font-semibold text-gray-900">{cap.dateSubmitted}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Reference</span>
            <span className="font-bold text-gray-900">{cap.reference}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1 text-[#0F61E9] text-sm font-semibold">
          View Details
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}

function RequirementCard({ req }: { req: DashboardRequirement }) {
  return (
    <Link href={`/dashboard/requirement/${req.id}`}>
      <div className="bg-white rounded-xl border border-gray-100 p-5 cursor-pointer hover:shadow-sm transition-shadow">
        <p className="text-xs font-semibold tracking-widest text-gray-400 mb-1">{req.category}</p>
        <h4 className="font-bold text-gray-900 text-lg mb-2">{req.title}</h4>
        <div className="mb-4"><StatusBadge status={req.status} /></div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Deal Size</span>
            <span className="font-semibold text-gray-900">{req.dealSize}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Date Submitted</span>
            <span className="font-semibold text-gray-900">{req.dateSubmitted}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Reference</span>
            <span className="font-bold text-gray-900">{req.reference}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-1 text-[#0F61E9] text-sm font-semibold">
          View Details
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function DashboardHome() {
  const { user, setPendingUser } = useAuth();
  const firstName = user?.name.split(' ')[0] ?? '';
  const [capabilities, setCapabilities] = useState<DashboardCapability[]>([]);
  const [requirements, setRequirements] = useState<DashboardRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    getDashboardSubmissions(user?.email)
      .then(data => {
        setCapabilities(data.capabilities);
        setRequirements(data.requirements);
        const submittedUser =
          data.capabilities.find(c => c.fullName)?.fullName ||
          data.requirements.find(r => r.fullName)?.fullName;
        if (submittedUser && user?.email) {
          setPendingUser({ name: submittedUser, email: user.email });
        }
      })
      .catch(err => setLoadError(err instanceof Error ? err.message : 'Failed to load submissions.'))
      .finally(() => setLoading(false));
  }, [user?.email]);

  return (
    <DashboardLayout title="Dashboard">
      <div className="max-w-5xl">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back, {firstName}</h2>
          <p className="text-gray-500 text-sm">Here's where things stand across your submissions.</p>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <ActionCard
            href="/dashboard/register-capability"
            iconBg="bg-[#0F61E9]"
            title="Register New Capability"
            desc="Add a new relationship or access you can offer"
            icon={
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
              </svg>
            }
          />
          <ActionCard
            href="/dashboard/submit-requirement"
            iconBg="bg-[#0D1B3E]"
            title="Submit New Requirement"
            desc="Describe a new introduction you are seeking"
            icon={
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
            }
          />
        </div>

        {/* My Capabilities */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">My Capabilities</h3>
            <span className="text-sm text-gray-400">{capabilities.length} total</span>
          </div>
          {loading && <p className="text-sm text-gray-500">Loading submissions...</p>}
          {loadError && <p className="text-sm text-red-500">{loadError}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!loading && capabilities.length === 0 && <p className="text-sm text-gray-500">No capabilities submitted yet.</p>}
            {capabilities.map(c => <CapabilityCard key={c.id} cap={c} />)}
          </div>
        </div>

        {/* My Requirements */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">My Requirements</h3>
            <span className="text-sm text-gray-400">{requirements.length} total</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {!loading && requirements.length === 0 && <p className="text-sm text-gray-500">No requirements submitted yet.</p>}
            {requirements.map(r => <RequirementCard key={r.id} req={r} />)}
          </div>
        </div>

        <NeedAssistance />
      </div>
    </DashboardLayout>
  );
}
