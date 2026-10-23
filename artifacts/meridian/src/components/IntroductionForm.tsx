import { useState } from 'react';
import { useLocation } from 'wouter';
import { useSubmitIntroductionRequest } from '@workspace/api-client-react';
import { REGIONS } from '@/lib/regions';

export function IntroductionForm() {
  const [, setLocation] = useLocation();
  const mutation = useSubmitIntroductionRequest();
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [region, setRegion] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isValid = fullName.trim() && emailAddress.trim() && region;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || mutation.isPending) return;
    setError(null);
    try {
      const result = await mutation.mutateAsync({
        data: {
          fullName: fullName.trim(),
          emailAddress: emailAddress.trim(),
          region,
          message: message.trim() || undefined,
        },
      });
      sessionStorage.setItem('meridian_enquiry_result', JSON.stringify(result));
      setLocation('/private-banking-success');
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  return (
    <form className="intro-form" onSubmit={handleSubmit}>
      <label>
        Full Name
        <input
          placeholder="e.g. John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </label>
      <label>
        Email address
        <input
          type="email"
          placeholder="e.g. info@example.com"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          required
        />
      </label>
      <label className="full">
        Region
        <select value={region} onChange={(e) => setRegion(e.target.value)} required>
          <option value="" disabled>Select region</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>
      <label className="full">
        Message optional
        <textarea
          placeholder="How can we help?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      {error && <p className="full form-error">{error}</p>}
      <button
        className="full"
        type="submit"
        disabled={!isValid || mutation.isPending}
        style={{ opacity: !isValid || mutation.isPending ? 0.5 : 1 }}
      >
        {mutation.isPending ? 'Submitting…' : 'Request an Introduction'}
      </button>
    </form>
  );
}
