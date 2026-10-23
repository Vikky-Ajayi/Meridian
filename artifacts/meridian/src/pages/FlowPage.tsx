import { useState } from 'react';
import { useLocation } from 'wouter';
import { Navbar } from '@/components/layout/Navbar';
import { PhoneDialCodeSelect } from '@/components/PhoneDialCodeSelect';
import {
  useLogBelowMinimumEnquiry,
  useSubmitMoveMoneyEnquiry,
  useSubmitPrivateBankingEnquiry,
} from '@workspace/api-client-react';
import { COUNTRIES } from '@/lib/countries';

const BELOW_MINIMUM_OPTION = 'Less than £50,000';

type FlowType = 'move' | 'bank';

const moveSteps = [
  {
    question: 'What Is The Approximate Amount You Are Looking To Move?',
    options: [BELOW_MINIMUM_OPTION, '£50,000 - £500,000', '£500,000 - £1million', '£1million - £10 million', '£10 million+', 'Prefer not to disclose'],
    multi: false,
  },
  {
    question: 'Where Are The Funds Currently Located?',
    options: COUNTRIES,
    multi: false,
    searchable: true,
  },
  {
    question: 'Where Do You Intend To Move The Funds?',
    options: COUNTRIES,
    multi: false,
    searchable: true,
  },
  {
    question: 'What Is The Purpose Of The Transfer?',
    options: ['Asset diversification', 'Property purchase', 'Business transaction', 'Investment purposes', 'Wealth planning', 'Other'],
    multi: false,
  },
  {
    question: 'When Are You Looking To Proceed?',
    options: ['Immediately', 'Within 30 days', '1-3 months', '3+ months', 'Researching options'],
    multi: false,
  },
  {
    question: 'Are The Funds Currently Held In A Bank Or Another Regulated Financial Institution?',
    options: ['Yes', 'No', 'Currently being arranged'],
    multi: false,
  },
] as const;

type Step = {
  question: string;
  options: readonly string[];
  multi: boolean;
  searchable?: boolean;
};

const bankSteps = [
  {
    question: 'What Type Of Banking Relationship Are You Seeking?',
    options: ['Personal private banking', 'Business banking', 'Family office services', 'Investment banking relationship', 'Other'],
    multi: false,
  },
  {
    question: 'What Is Your Approximate Investable Wealth?',
    options: ['£250,000 - £1million', '£1million - £5 million', '£5 million - £25 million', '£25 million+', 'Prefer not to disclose'],
    multi: false,
  },
  {
    question: 'Which Jurisdictions Are You Interested In?',
    options: ['UK', 'Switzerland', 'UAE', 'Europe', 'Caribbean', 'Other'],
    multi: true,
  },
  {
    question: 'What Are Your Main Reasons For Seeking Private Banking?',
    options: ['Wealth management', 'International banking access', 'Asset protection planning', 'Business requirements', 'Credit/lending facilities', 'Other'],
    multi: true,
  },
  {
    question: 'How Soon Are You Looking To Establish A Relationship?',
    options: ['Immediately', 'Within 3 months', '3-12 months', 'Exploring options'],
    multi: false,
  },
] as const;

function BelowMinimumNotice({ onBack }: { onBack: () => void }) {
  return (
    <div className="flow-card below-minimum">
      <h2>Thank You For Your Interest</h2>
      <p>
        Our service is designed for individuals and businesses looking to move significant
        amounts of capital. Unfortunately, the amount you've selected falls below our current
        minimum threshold.
      </p>
      <p>If you need to move larger funds in the future, we'd be delighted to assist you.</p>
      <p>
        You can also recommend our service to friends, family or business associates who may
        benefit from our expertise.
      </p>
      <p>We look forward to assisting you in the future.</p>
      <div className="flow-actions">
        <button className="back" type="button" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
}

function CountryOptions({
  options,
  selected,
  onSelect,
}: {
  options: readonly string[];
  selected: string;
  onSelect: (option: string) => void;
}) {
  const [query, setQuery] = useState('');
  const matches = options.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <>
      <input
        className="country-search"
        type="search"
        placeholder="Search countries"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search countries"
      />
      <div className="option-list country-list">
        {matches.map((option) => (
          <button
            className={`flow-option ${selected === option ? 'selected' : ''}`}
            type="button"
            key={option}
            onClick={() => onSelect(option)}
          >
            <span className="radio" />
            {option}
          </button>
        ))}
        {matches.length === 0 && <p className="country-empty">No matching country</p>}
      </div>
    </>
  );
}

function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flow-progress">
      {Array.from({ length: total }).map((_, index) => (
        <span className={index <= step ? 'done' : ''} key={index} />
      ))}
    </div>
  );
}

interface ContactState {
  fullName: string;
  countryOfResidence: string;
  dialCode: string;
  whatsappNumber: string;
  emailAddress: string;
}

function ContactStep({
  type,
  step,
  total,
  onBack,
  onSubmit,
  isSubmitting,
  error,
}: {
  type: FlowType;
  step: number;
  total: number;
  onBack: () => void;
  onSubmit: (contact: ContactState) => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [contact, setContact] = useState<ContactState>({
    fullName: '',
    countryOfResidence: '',
    dialCode: '+44',
    whatsappNumber: '',
    emailAddress: '',
  });

  const set = (field: keyof ContactState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setContact((prev) => ({ ...prev, [field]: e.target.value }));

  const isValid =
    contact.fullName.trim() &&
    contact.countryOfResidence.trim() &&
    contact.whatsappNumber.trim() &&
    contact.emailAddress.trim();

  return (
    <div className="flow-card contact-step">
      <div className="step-label">Step {step + 1} of {total}</div>
      <Progress step={step} total={total} />
      <h2>A Few Details So The Desk Can Reach You.</h2>
      <div className="flow-fields">
        <label>
          Full name
          <input
            placeholder="Your full name"
            value={contact.fullName}
            onChange={set('fullName')}
          />
        </label>
        <label>
          Country of residence
          <input
            placeholder="e.g. United Kingdom"
            value={contact.countryOfResidence}
            onChange={set('countryOfResidence')}
          />
        </label>
        <label>
          Best WhatsApp number
          <div className="phone-input">
            <PhoneDialCodeSelect
              value={contact.dialCode}
              onChange={(dial) => setContact((prev) => ({ ...prev, dialCode: dial }))}
            />
            <input
              placeholder="7700 000000"
              value={contact.whatsappNumber}
              onChange={set('whatsappNumber')}
            />
          </div>
        </label>
        <label>
          Email address
          <input
            type="email"
            placeholder="your@email.com"
            value={contact.emailAddress}
            onChange={set('emailAddress')}
          />
        </label>
      </div>
      {error && (
        <p style={{ color: '#c00', fontSize: 14, marginTop: 12 }}>{error}</p>
      )}
      <div className="flow-actions">
        <button className="back" type="button" onClick={onBack} disabled={isSubmitting}>
          ← Back
        </button>
        <button
          className="continue"
          type="button"
          disabled={!isValid || isSubmitting}
          style={{ opacity: !isValid || isSubmitting ? 0.5 : 1 }}
          onClick={() => onSubmit(contact)}
        >
          {isSubmitting
            ? 'Submitting…'
            : type === 'bank'
            ? 'Submit Enquiry'
            : 'Get My WhatsApp Line'}
        </button>
      </div>
    </div>
  );
}

export function FlowPage({ type }: { type: FlowType }) {
  const isBank = type === 'bank';
  const steps: readonly Step[] = isBank ? bankSteps : moveSteps;
  const totalSteps = steps.length + 1; // +1 for contact step
  const [step, setStep] = useState(0);
  // selections[i] is a string (single) or string[] (multi) for step i
  const [selections, setSelections] = useState<(string | string[])[]>(
    () => steps.map((s) => (s.multi ? [] : ''))
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [belowMinimum, setBelowMinimum] = useState(false);

  const [, setLocation] = useLocation();
  const moveMoneyMutation = useSubmitMoveMoneyEnquiry();
  const privateBankingMutation = useSubmitPrivateBankingEnquiry();
  const logBelowMinimum = useLogBelowMinimumEnquiry();
  const mutation = isBank ? privateBankingMutation : moveMoneyMutation;
  const isSubmitting = mutation.isPending;

  const isContactStep = step === totalSteps - 1;
  const current = steps[Math.min(step, steps.length - 1)];
  const isMulti = !isContactStep && current?.multi;
  const pageTitle = isBank ? 'Private Banking Introduction' : 'Move Money Abroad';

  function toggleOption(option: string) {
    setSelections((prev) => {
      const updated = [...prev];
      if (isMulti) {
        const arr = (updated[step] as string[]) || [];
        updated[step] = arr.includes(option)
          ? arr.filter((o) => o !== option)
          : [...arr, option];
      } else {
        updated[step] = option;
      }
      return updated;
    });
  }

  function isSelected(option: string): boolean {
    const sel = selections[step];
    if (isMulti) return (sel as string[]).includes(option);
    return sel === option;
  }

  function canContinue(): boolean {
    if (isContactStep) return true;
    const sel = selections[step];
    if (isMulti) return (sel as string[]).length > 0;
    return typeof sel === 'string' && sel !== '';
  }

  function handleContinue() {
    if (!isBank && step === 0 && selections[0] === BELOW_MINIMUM_OPTION) {
      // Amount only, no contact details; a logging failure must not block the message.
      logBelowMinimum.mutate({ data: { amountRange: BELOW_MINIMUM_OPTION } });
      setBelowMinimum(true);
      return;
    }
    setStep(step + 1);
  }

  async function handleSubmit(contact: ContactState) {
    setSubmitError(null);
    // Combine country dial code + number into one field
    const fullWhatsapp = `${contact.dialCode} ${contact.whatsappNumber}`.trim();
    try {
      let result;
      if (isBank) {
        result = await privateBankingMutation.mutateAsync({
          data: {
            bankingRelationshipType: selections[0] as string,
            investableWealth: selections[1] as string,
            jurisdictions: selections[2] as string[],
            reasons: selections[3] as string[],
            timeline: selections[4] as string,
            fullName: contact.fullName,
            countryOfResidence: contact.countryOfResidence,
            whatsappNumber: fullWhatsapp,
            emailAddress: contact.emailAddress,
          },
        });
        sessionStorage.setItem('meridian_enquiry_result', JSON.stringify(result));
        setLocation('/private-banking-success');
      } else {
        result = await moveMoneyMutation.mutateAsync({
          data: {
            amountRange: selections[0] as string,
            fundsLocation: selections[1] as string,
            destination: selections[2] as string,
            purpose: selections[3] as string,
            timeline: selections[4] as string,
            regulatedInstitution: selections[5] as string,
            fullName: contact.fullName,
            countryOfResidence: contact.countryOfResidence,
            whatsappNumber: fullWhatsapp,
            emailAddress: contact.emailAddress,
          },
        });
        sessionStorage.setItem('meridian_enquiry_result', JSON.stringify(result));
        setLocation('/move-money-success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      // Surface a cleaner message for network/404 errors
      setSubmitError(
        msg.includes('404') || msg.includes('NOT_FOUND')
          ? 'Unable to reach the server. Please try again shortly.'
          : msg
      );
    }
  }

  return (
    <div className={`flow-page ${isBank ? 'is-bank' : 'is-move'}`}>
      <Navbar />
      <main className="flow-shell">
        <div className="flow-heading">
          <div>Private Client Desk</div>
          <h1>{pageTitle}</h1>
        </div>

        {belowMinimum ? (
          <BelowMinimumNotice onBack={() => setBelowMinimum(false)} />
        ) : isContactStep ? (
          <ContactStep
            type={type}
            step={step}
            total={totalSteps}
            onBack={() => setStep(step - 1)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={submitError}
          />
        ) : (
          <div className="flow-card">
            <div className="step-label">Step {step + 1} of {totalSteps}</div>
            <Progress step={step} total={totalSteps} />
            <h2>{current.question}</h2>
            {isMulti && <p className="select-note">Select All That Apply</p>}
            {current.searchable ? (
              <CountryOptions
                key={step}
                options={current.options}
                selected={selections[step] as string}
                onSelect={toggleOption}
              />
            ) : (
              <div className="option-list">
                {current.options.map((option) => (
                  <button
                    className={`flow-option ${isSelected(option) ? 'selected' : ''}`}
                    type="button"
                    key={option}
                    onClick={() => toggleOption(option)}
                  >
                    <span className={isMulti ? 'check' : 'radio'} />
                    {option}
                  </button>
                ))}
              </div>
            )}
            <div className="flow-actions">
              {step > 0 && (
                <button className="back" type="button" onClick={() => setStep(step - 1)}>
                  ← Back
                </button>
              )}
              <button
                className="continue"
                type="button"
                disabled={!canContinue()}
                style={{ opacity: canContinue() ? 1 : 0.5 }}
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
