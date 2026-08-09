import { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NeedAssistance } from '@/components/NeedAssistance';
import { getDashboardSubmissions, type DashboardCapability } from '@/lib/submissions-api';
import { useAuth } from '@/lib/auth-context';

const CAPABILITY_STAGES = [
  'Submitted',
  'Under Review',
  'Verified',
  'Available for Matching',
  'Archived',
];

function Timeline({ status }: { status: string }) {
  const currentIdx = CAPABILITY_STAGES.indexOf(status);

  return (
    <div className="space-y-5">
      {CAPABILITY_STAGES.map((stage, i) => {
        const done = i < currentIdx;
        const current = i === currentIdx;

        return (
          <div key={stage} className="flex items-start gap-4">
            <div className="mt-1 flex flex-col items-center">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white">
                <div
                  className={`h-3 w-3 rounded-full ${
                    done ? 'bg-green-600' : current ? 'bg-[#0F61E9]' : 'bg-gray-400'
                  }`}
                />
              </div>
              {i < CAPABILITY_STAGES.length - 1 && <div className="h-7 w-px bg-gray-200" />}
            </div>
            <div>
              <p className="text-sm font-medium text-black">{stage}</p>
              {current && <p className="text-xs text-gray-500">Current stage</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CapabilityDetail() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [cap, setCap] = useState<DashboardCapability | null>(null);

  useEffect(() => {
    getDashboardSubmissions(user?.email).then(data => {
      setCap(data.capabilities.find(c => c.id === params.id) ?? data.capabilities[0] ?? null);
    });
  }, [params.id, user?.email]);

  if (!cap) {
    return (
      <DashboardLayout title="Dashboard">
        <p className="text-sm text-gray-500">Loading capability...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="max-w-[1080px]">
        <Link href="/dashboard">
          <div className="mb-8 inline-flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Dashboard
          </div>
        </Link>

        <div className="mb-8">
          <p className="mb-4 text-sm font-medium uppercase text-gray-500">{cap.category}</p>
          <h2 className="mb-4 text-xl font-bold text-black">{cap.title}</h2>
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
            <span>Submitted&nbsp; <strong className="text-black">{cap.dateSubmitted}</strong></span>
            <span className="text-black">·</span>
            <span>Reference <strong className="text-black">{cap.reference}</strong></span>
            <span className="text-black">·</span>
            <span>Status <strong className="text-black">{cap.status}</strong></span>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-11 rounded-2xl bg-[#FAFAFA] p-8">
            <div>
              <p className="mb-4 text-sm font-semibold text-gray-500">Geography / Market</p>
              <p className="text-[22px] font-medium leading-tight text-black">{cap.geography}</p>
            </div>
            <div>
              <p className="mb-4 text-sm font-semibold text-gray-500">Deal Size</p>
              <p className="text-[22px] font-medium leading-tight text-black">{cap.dealSize}</p>
            </div>
            <div>
              <p className="mb-4 text-sm font-semibold text-gray-500">Description</p>
              <p className="text-[22px] font-medium leading-snug text-black">{cap.description}</p>
            </div>
            {cap.priorExperience && (
              <div>
                <p className="mb-4 text-sm font-semibold text-gray-500">Prior Experience</p>
                <p className="text-[22px] font-medium leading-snug text-black">{cap.priorExperience}</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-[#FAFAFA] p-8">
            <h3 className="mb-12 font-bold text-black">Timeline of Updates</h3>
            <Timeline status={cap.status} />

            <div className="mt-12 space-y-6">
              <div className="border-l-2 border-black bg-white px-5 py-4">
                <p className="mb-4 text-sm font-medium tracking-wide text-gray-500">28 JUL 2026</p>
                <p className="text-sm text-gray-600">Submission received. Awaiting internal review.</p>
              </div>
              {(cap.status === 'Verified' || cap.status === 'Available for Matching') && (
                <div className="border-l-2 border-black bg-white px-5 py-4">
                  <p className="mb-4 text-sm font-medium tracking-wide text-gray-500">29 JUL 2026</p>
                  <p className="text-sm text-gray-600">Verified by our team and made available for matching.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <NeedAssistance />
      </div>
    </DashboardLayout>
  );
}
