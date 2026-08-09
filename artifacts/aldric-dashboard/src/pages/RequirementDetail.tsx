import { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NeedAssistance } from '@/components/NeedAssistance';
import { getDashboardSubmissions, type DashboardRequirement } from '@/lib/submissions-api';
import { useAuth } from '@/lib/auth-context';

const REQUIREMENT_STAGES = [
  'Submitted',
  'Under Review',
  'Verification',
  'Searching for Match',
  'Introduction Available',
  'Completed',
  'Closed',
];

function Timeline({ status }: { status: string }) {
  const currentIdx = REQUIREMENT_STAGES.indexOf(status);

  return (
    <div className="space-y-5">
      {REQUIREMENT_STAGES.map((stage, i) => {
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
              {i < REQUIREMENT_STAGES.length - 1 && <div className="h-7 w-px bg-gray-200" />}
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

export default function RequirementDetail() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [req, setReq] = useState<DashboardRequirement | null>(null);

  useEffect(() => {
    getDashboardSubmissions(user?.email).then(data => {
      setReq(data.requirements.find(r => r.id === params.id) ?? data.requirements[0] ?? null);
    });
  }, [params.id, user?.email]);

  if (!req) {
    return (
      <DashboardLayout title="Dashboard">
        <p className="text-sm text-gray-500">Loading requirement...</p>
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
          <p className="mb-4 text-sm font-medium uppercase text-gray-500">{req.category}</p>
          <h2 className="mb-4 text-xl font-bold text-black">{req.title}</h2>
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">
            <span>Submitted&nbsp; <strong className="text-black">{req.dateSubmitted}</strong></span>
            <span className="text-black">·</span>
            <span>Reference <strong className="text-black">{req.reference}</strong></span>
            <span className="text-black">·</span>
            <span>Status <strong className="text-black">{req.status}</strong></span>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-11 rounded-2xl bg-[#FAFAFA] p-8">
            <div>
              <p className="mb-4 text-sm font-semibold text-gray-500">Geography / Market</p>
              <p className="text-[22px] font-medium leading-tight text-black">{req.geography}</p>
            </div>
            <div>
              <p className="mb-4 text-sm font-semibold text-gray-500">Deal Size</p>
              <p className="text-[22px] font-medium leading-tight text-black">{req.dealSize}</p>
            </div>
            <div>
              <p className="mb-4 text-sm font-semibold text-gray-500">Description</p>
              <p className="text-[22px] font-medium leading-snug text-black">{req.description}</p>
            </div>
            <div>
              <p className="mb-4 text-sm font-semibold text-gray-500">Timeline / Urgency</p>
              <p className="text-[22px] font-medium leading-tight text-black">{req.timeline}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#FAFAFA] p-8">
            <h3 className="mb-12 font-bold text-black">Timeline of Updates</h3>
            <Timeline status={req.status} />
            <div className="mt-12 space-y-6">
              <div className="border-l-2 border-black bg-white px-5 py-4">
                <p className="mb-4 text-sm font-medium tracking-wide text-gray-500">28 JUL 2026</p>
                <p className="text-sm text-gray-600">Submission received. Awaiting internal review.</p>
              </div>
            </div>
          </div>
        </div>

        <NeedAssistance />
      </div>
    </DashboardLayout>
  );
}
