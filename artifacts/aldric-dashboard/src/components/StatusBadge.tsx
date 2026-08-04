type Props = { status: string };

export function StatusBadge({ status }: Props) {
  const cfg: Record<string, string> = {
    'Verified':               'bg-green-50 text-green-600 border border-green-200',
    'Available for Matching': 'bg-green-50 text-green-600 border border-green-200',
    'Under Review':           'bg-orange-50 text-orange-500 border border-orange-200',
    'Searching for Match':    'bg-green-50 text-green-600 border border-green-200',
    'Introduction Available': 'bg-blue-50 text-blue-600 border border-blue-200',
    'Completed':              'bg-green-50 text-green-600 border border-green-200',
    'Closed':                 'text-gray-500',
    'Verification':           'bg-yellow-50 text-yellow-600 border border-yellow-200',
  };
  const cls = cfg[status] ?? 'text-gray-500';
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-sm ${cls}`}>
      {status}
    </span>
  );
}
